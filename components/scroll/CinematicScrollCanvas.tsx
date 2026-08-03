'use client'

import React, { useEffect, useRef } from 'react'
import { getAssetPath } from '@/lib/utils'

interface CinematicScrollCanvasProps {
  progressRef: React.MutableRefObject<number>
}

interface SequenceSource {
  video: string
  startTime: number
  endTime: number
  cropLeft: number
  cropRight: number
  cropBottom: number
  focalX: number
  maskRecordedFrame?: boolean
}

const FRAME_COUNT = 180
const HEADER_CROP = 0
const SOURCE_WIDTH = 1280
const SOURCE_HEIGHT = 720
const sequences: SequenceSource[] = [
  {
    video: '/videos/scroll/hero.mp4',
    startTime: 0.12,
    endTime: 5.65,
    cropLeft: 200,
    cropRight: 120,
    cropBottom: 100,
    focalX: 0.5,
    maskRecordedFrame: true,
  },
  {
    video: '/videos/scroll/compatibility.mp4',
    startTime: 0.12,
    endTime: 6.75,
    cropLeft: 180,
    cropRight: 120,
    cropBottom: 100,
    focalX: 0.5,
  },
  {
    video: '/videos/scroll/distribution.mp4',
    startTime: 0.12,
    endTime: 5.55,
    cropLeft: 160,
    cropRight: 120,
    cropBottom: 100,
    focalX: 0.5,
  },
]

const clamp = (value: number) => Math.min(1, Math.max(0, value))

const smoothstep = (value: number) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

function getStageOpacity(progress: number, index: number) {
  const stageLength = 1 / sequences.length
  const transition = 0.052
  const neutralGap = 0.007
  const start = index * stageLength
  const end = start + stageLength

  const fadeIn = index === 0
    ? 1
    : smoothstep((progress - (start + neutralGap)) / transition)
  const fadeOut = index === sequences.length - 1
    ? 1
    : 1 - smoothstep((progress - (end - transition - neutralGap)) / transition)
  return Math.min(fadeIn, fadeOut)
}

function getCoverRect(
  areaX: number,
  areaY: number,
  areaWidth: number,
  areaHeight: number,
  sourceRatio: number,
  focalX = 0.5,
) {
  const destinationRatio = areaWidth / areaHeight
  let drawWidth = areaWidth
  let drawHeight = areaHeight

  if (sourceRatio > destinationRatio) drawWidth = areaHeight * sourceRatio
  else drawHeight = areaWidth / sourceRatio

  return {
    x: areaX + (areaWidth - drawWidth) * focalX,
    y: areaY + (areaHeight - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  }
}

function drawVideo(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  width: number,
  height: number,
  opacity: number,
  sequence: SequenceSource,
  wideLayout: boolean,
) {
  if (video.readyState < 2 || !video.videoWidth) return false
  const sourceWidth = SOURCE_WIDTH - sequence.cropLeft - sequence.cropRight
  const sourceHeight = SOURCE_HEIGHT - HEADER_CROP - sequence.cropBottom
  const visualX = 0
  const visualWidth = width
  const rect = getCoverRect(
    visualX,
    0,
    visualWidth,
    height,
    sourceWidth / sourceHeight,
    sequence.focalX,
  )

  context.save()
  context.beginPath()
  context.rect(visualX, 0, visualWidth, height)
  context.clip()
  context.globalAlpha = opacity
  context.filter = 'saturate(0.98) contrast(1.02)'
  context.drawImage(
    video,
    sequence.cropLeft,
    HEADER_CROP,
    sourceWidth,
    sourceHeight,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
  )

  if (sequence.maskRecordedFrame) {
    context.filter = 'none'

    const leftFade = context.createLinearGradient(0, 0, width * 0.38, 0)
    leftFade.addColorStop(0, 'rgba(255, 255, 255, 0.96)')
    leftFade.addColorStop(0.35, 'rgba(255, 255, 255, 0.72)')
    leftFade.addColorStop(0.75, 'rgba(255, 255, 255, 0.22)')
    leftFade.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.fillStyle = leftFade
    context.fillRect(0, 0, width * 0.38, height)

    const rightFade = context.createLinearGradient(width * 0.92, 0, width, 0)
    rightFade.addColorStop(0, 'rgba(255, 255, 255, 0)')
    rightFade.addColorStop(0.6, 'rgba(255, 255, 255, 0.5)')
    rightFade.addColorStop(1, 'rgba(255, 255, 255, 1)')
    context.fillStyle = rightFade
    context.fillRect(width * 0.92, 0, width * 0.08, height)

    const bottomFade = context.createLinearGradient(0, height * 0.65, 0, height)
    bottomFade.addColorStop(0, 'rgba(255, 255, 255, 0)')
    bottomFade.addColorStop(0.4, 'rgba(255, 255, 255, 0.45)')
    bottomFade.addColorStop(0.8, 'rgba(255, 255, 255, 0.92)')
    bottomFade.addColorStop(1, 'rgba(255, 255, 255, 1)')
    context.fillStyle = bottomFade
    context.fillRect(0, height * 0.65, width, height * 0.35)
  }

  context.restore()
  return true
}

export const CinematicScrollCanvas: React.FC<CinematicScrollCanvasProps> = ({ progressRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return

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
    const initializedSequences = sequences.map(() => false)

    const invalidate = () => {
      lastProgress = -1
    }

    videos.forEach((video) => {
      video.addEventListener('loadeddata', invalidate)
    })

    const render = () => {
      if (isDisposed) return

      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.round(bounds.width * dpr))
      const height = Math.max(1, Math.round(bounds.height * dpr))
      const wideLayout = bounds.width >= 1024
      const progress = clamp(progressRef.current)
      const dimensionsChanged = width !== lastWidth || height !== lastHeight
      const stage = Math.min(sequences.length - 1, Math.floor(progress * sequences.length))

      sequences.forEach((sequence, index) => {
        const video = videos[index]
        const isVisible = getStageOpacity(progress, index) > 0.002

        if (!initializedSequences[index] && video.readyState >= 1) {
          video.currentTime = sequence.startTime
          initializedSequences[index] = true
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

        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, width, height)

        sequences.forEach((sequence, index) => {
          const opacity = getStageOpacity(progress, index)
          if (opacity <= 0.002) return
          drawVideo(context, videos[index], width, height, opacity, sequence, wideLayout)
        })

        const activeSequence = sequences[stage]
        const activeVideo = videos[stage]
        const motionTime = Math.max(0, activeVideo.currentTime - activeSequence.startTime)
        canvas.dataset.frame = String(Math.round(motionTime * 30) % FRAME_COUNT)
        canvas.dataset.stage = String(stage + 1)
        canvas.dataset.motionTime = motionTime.toFixed(3)
        canvas.dataset.playing = String(!activeVideo.paused)
        canvas.dataset.visibleCount = String(visibleSequences.filter(Boolean).length)
        canvas.dataset.sourceSizes = videos.map((video) => `${video.videoWidth}x${video.videoHeight}`).join(',')
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
      data-visible-count="0"
      data-source-sizes=""
    />
  )
}
