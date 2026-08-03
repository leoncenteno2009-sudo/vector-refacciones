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
  focalX: number
  zoom: number
  background: string
}

const FRAME_COUNT = 180
const sequences: SequenceSource[] = [
  {
    video: '/videos/scroll/vector-core-rotation.mp4',
    startTime: 0.08,
    endTime: 7.86,
    focalX: 0.5,
    zoom: 1.18,
    background: '#f1ede5',
  },
  {
    video: '/videos/scroll/vector-alignment.mp4',
    startTime: 0.08,
    endTime: 7.86,
    focalX: 0.5,
    zoom: 1.16,
    background: '#ffffff',
  },
  {
    video: '/videos/scroll/vector-network-core.mp4',
    startTime: 0.08,
    endTime: 7.86,
    focalX: 0.5,
    zoom: 1.13,
    background: '#f1f1ef',
  },
  {
    video: '/videos/scroll/vector-car-assembly.mp4',
    startTime: 0.08,
    endTime: 7.86,
    focalX: 0.5,
    zoom: 1,
    background: '#080b10',
  },
]

const clamp = (value: number) => Math.min(1, Math.max(0, value))

const smoothstep = (value: number) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

function getStageOpacity(progress: number, index: number) {
  const stageLength = 1 / sequences.length
  const transition = 0.045
  const start = index * stageLength
  const end = start + stageLength

  const fadeIn = index === 0
    ? 1
    : smoothstep((progress - (start - transition)) / (transition * 2))
  const fadeOut = index === sequences.length - 1
    ? 1
    : 1 - smoothstep((progress - (end - transition)) / (transition * 2))
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
  const visualX = wideLayout ? width * 0.28 : 0
  const visualWidth = wideLayout ? width * 0.72 : width
  const rect = getCoverRect(
    visualX,
    0,
    visualWidth,
    height,
    video.videoWidth / video.videoHeight,
    sequence.focalX,
  )

  const zoomScale = wideLayout ? sequence.zoom : Math.max(1, sequence.zoom - 0.04)
  const drawWidth = rect.width * zoomScale
  const drawHeight = rect.height * zoomScale
  const drawX = rect.x - (drawWidth - rect.width) * sequence.focalX
  const drawY = rect.y - (drawHeight - rect.height) * 0.5

  context.save()
  context.beginPath()
  context.rect(visualX, 0, visualWidth, height)
  context.clip()
  context.globalAlpha = opacity
  context.filter = 'saturate(0.98) contrast(1.02)'
  context.drawImage(
    video,
    0,
    0,
    video.videoWidth,
    video.videoHeight,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
  )

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

        context.fillStyle = sequences[stage].background
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
