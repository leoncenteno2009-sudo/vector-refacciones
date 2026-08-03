'use client'

import React, { useEffect, useRef } from 'react'
import { getAssetPath } from '@/lib/utils'

interface CinematicScrollCanvasProps {
  progressRef: React.MutableRefObject<number>
}

interface SequenceSource {
  video: string
  poster: string
  startTime: number
  endTime: number
}

const FRAME_COUNT = 180
const HEADER_CROP = 68
const SOURCE_WIDTH = 1280
const SOURCE_HEIGHT = 720 - HEADER_CROP
const sequences: SequenceSource[] = [
  {
    video: '/videos/scroll/hero.mp4',
    poster: '/images/scroll/vector-stage-01.jpg',
    startTime: 0.12,
    endTime: 5.65,
  },
  {
    video: '/videos/scroll/compatibility.mp4',
    poster: '/images/scroll/vector-stage-02.jpg',
    startTime: 0.12,
    endTime: 6.75,
  },
  {
    video: '/videos/scroll/distribution.mp4',
    poster: '/images/scroll/vector-stage-03.jpg',
    startTime: 0.12,
    endTime: 5.55,
  },
]

const clamp = (value: number) => Math.min(1, Math.max(0, value))

const smoothstep = (value: number) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

function getStageOpacity(progress: number, index: number) {
  const stageLength = 1 / sequences.length
  const transition = 0.032
  const start = index * stageLength
  const end = start + stageLength

  if (index === 0) return 1 - smoothstep((progress - (end - transition)) / (transition * 2))
  if (index === sequences.length - 1) return smoothstep((progress - (start - transition)) / (transition * 2))

  const fadeIn = smoothstep((progress - (start - transition)) / (transition * 2))
  const fadeOut = 1 - smoothstep((progress - (end - transition)) / (transition * 2))
  return Math.min(fadeIn, fadeOut)
}

function getCoverRect(width: number, height: number, sourceRatio: number) {
  const destinationRatio = width / height
  const compact = width < 720
  let drawWidth = width
  let drawHeight = height

  if (sourceRatio > destinationRatio) drawWidth = height * sourceRatio
  else drawHeight = width / sourceRatio

  const overflowX = width - drawWidth
  return {
    x: overflowX * (compact ? 0.82 : 0.5),
    y: (height - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  }
}

function drawPoster(
  context: CanvasRenderingContext2D,
  poster: HTMLImageElement,
  width: number,
  height: number,
  opacity: number,
) {
  if (!poster.complete || !poster.naturalWidth) return
  const rect = getCoverRect(width, height, poster.naturalWidth / poster.naturalHeight)
  context.save()
  context.globalAlpha = opacity
  context.drawImage(poster, rect.x, rect.y, rect.width, rect.height)
  context.restore()
}

function drawVideo(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  width: number,
  height: number,
  opacity: number,
) {
  if (video.readyState < 2 || !video.videoWidth) return false
  const rect = getCoverRect(width, height, SOURCE_WIDTH / SOURCE_HEIGHT)

  context.save()
  context.globalAlpha = opacity
  context.filter = 'saturate(0.96) contrast(1.015)'
  context.drawImage(
    video,
    0,
    HEADER_CROP,
    SOURCE_WIDTH,
    SOURCE_HEIGHT,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
  )
  context.restore()
  return true
}

function drawFrameLabel(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
) {
  const frameNumber = Math.round(progress * (FRAME_COUNT - 1))
  context.save()
  context.globalAlpha = 0.24
  context.fillStyle = '#171717'
  context.font = `${Math.max(8, Math.round(height * 0.011))}px Manrope, sans-serif`
  context.letterSpacing = '0.14em'
  context.fillText(`FRAME ${String(frameNumber).padStart(3, '0')} / ${FRAME_COUNT}`, width * 0.83, height * 0.94)
  context.restore()
}

export const CinematicScrollCanvas: React.FC<CinematicScrollCanvasProps> = ({ progressRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return

    const posters = sequences.map(({ poster }) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = getAssetPath(poster)
      return image
    })

    const videos = sequences.map(({ video }) => {
      const element = document.createElement('video')
      element.muted = true
      element.autoplay = true
      element.playsInline = true
      element.preload = 'auto'
      element.disablePictureInPicture = true
      element.src = getAssetPath(video)
      element.load()
      return element
    })

    let animationFrame = 0
    let lastProgress = -1
    let lastWidth = 0
    let lastHeight = 0
    let isDisposed = false
    const visibleSequences = sequences.map(() => false)

    const invalidate = () => {
      lastProgress = -1
    }

    posters.forEach((poster) => poster.addEventListener('load', invalidate))
    videos.forEach((video) => {
      video.addEventListener('loadeddata', invalidate)
    })

    const render = () => {
      if (isDisposed) return

      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.round(bounds.width * dpr))
      const height = Math.max(1, Math.round(bounds.height * dpr))
      const progress = clamp(progressRef.current)
      const dimensionsChanged = width !== lastWidth || height !== lastHeight
      const stage = Math.min(sequences.length - 1, Math.floor(progress * sequences.length))

      sequences.forEach((sequence, index) => {
        const video = videos[index]
        const isVisible = getStageOpacity(progress, index) > 0.002

        if (isVisible && !visibleSequences[index] && video.readyState >= 1) {
          video.currentTime = sequence.startTime
        }

        if (isVisible && video.readyState >= 2) {
          if (video.currentTime >= sequence.endTime) video.currentTime = sequence.startTime
          if (video.paused && !video.seeking) void video.play().catch(() => undefined)
        } else if (!isVisible && !video.paused) {
          video.pause()
        }

        visibleSequences[index] = isVisible
      })

      if (dimensionsChanged || Math.abs(progress - lastProgress) > 0.0001 || videos.some((video, index) => visibleSequences[index] && !video.paused)) {
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }

        context.fillStyle = '#f4f0e8'
        context.fillRect(0, 0, width, height)

        sequences.forEach((_, index) => {
          const opacity = getStageOpacity(progress, index)
          if (opacity <= 0.002) return
          if (!drawVideo(context, videos[index], width, height, opacity)) {
            drawPoster(context, posters[index], width, height, opacity)
          }
        })

        drawFrameLabel(context, width, height, progress)
        const activeSequence = sequences[stage]
        const activeVideo = videos[stage]
        const motionTime = Math.max(0, activeVideo.currentTime - activeSequence.startTime)
        canvas.dataset.frame = String(Math.round(motionTime * 30) % FRAME_COUNT)
        canvas.dataset.stage = String(stage + 1)
        canvas.dataset.motionTime = motionTime.toFixed(3)
        canvas.dataset.playing = String(!activeVideo.paused)
        lastProgress = progress
        lastWidth = width
        lastHeight = height
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    animationFrame = window.requestAnimationFrame(render)

    return () => {
      isDisposed = true
      window.cancelAnimationFrame(animationFrame)
      posters.forEach((poster) => poster.removeEventListener('load', invalidate))
      videos.forEach((video) => {
        video.removeEventListener('loadeddata', invalidate)
        video.pause()
        video.removeAttribute('src')
        video.load()
      })
    }
  }, [progressRef])

  return (
    <canvas
      ref={canvasRef}
      className="vector-story__canvas"
      aria-hidden="true"
      data-frame="0"
      data-stage="1"
      data-motion-time="0"
      data-playing="false"
    />
  )
}
