'use client'

import React, { useEffect, useRef } from 'react'
import { getAssetPath } from '@/lib/utils'

interface CinematicScrollCanvasProps {
  progressRef: React.MutableRefObject<number>
}

const FRAME_COUNT = 240
const imageSources = [
  '/images/scroll/vector-stage-01.jpg',
  '/images/scroll/vector-stage-02.jpg',
  '/images/scroll/vector-stage-03.jpg',
  '/images/scroll/vector-stage-04.jpg',
  '/images/scroll/mechanical-assembly-layer.png',
  '/images/scroll/distribution-parts-layer.png',
]

interface SpriteDefinition {
  source: [number, number, number, number]
  offset: [number, number]
  rotation: number
  delay: number
}

const mechanicalSprites: SpriteDefinition[] = [
  { source: [82, 230, 210, 470], offset: [-0.2, 0.02], rotation: -0.26, delay: 0.04 },
  { source: [278, 102, 220, 175], offset: [-0.12, -0.18], rotation: -0.42, delay: 0.18 },
  { source: [278, 354, 195, 240], offset: [-0.15, 0.12], rotation: -0.5, delay: 0.09 },
  { source: [445, 300, 230, 315], offset: [-0.09, 0.02], rotation: -0.36, delay: 0.13 },
  { source: [650, 195, 390, 525], offset: [0, 0.2], rotation: 0.2, delay: 0 },
  { source: [1028, 300, 230, 315], offset: [0.1, 0.02], rotation: 0.38, delay: 0.13 },
  { source: [1230, 354, 195, 240], offset: [0.16, 0.12], rotation: 0.52, delay: 0.09 },
  { source: [1420, 230, 205, 470], offset: [0.2, 0.02], rotation: 0.27, delay: 0.04 },
  { source: [330, 650, 200, 155], offset: [-0.12, 0.17], rotation: -0.42, delay: 0.2 },
  { source: [1190, 650, 200, 155], offset: [0.12, 0.17], rotation: 0.42, delay: 0.2 },
]

const distributionSprites: Array<[number, number, number, number]> = [
  [20, 320, 315, 330],
  [365, 300, 165, 355],
  [560, 330, 290, 320],
  [875, 325, 295, 330],
  [1180, 345, 275, 300],
  [1450, 370, 205, 250],
]

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smoothstep = (value: number) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

function stageOpacity(progress: number, index: number) {
  const transition = 0.065
  const start = index * 0.25
  const end = (index + 1) * 0.25

  if (index === 0) return 1 - smoothstep((progress - (end - transition)) / (transition * 2))
  if (index === 3) return smoothstep((progress - (start - transition)) / (transition * 2))

  const fadeIn = smoothstep((progress - (start - transition)) / (transition * 2))
  const fadeOut = 1 - smoothstep((progress - (end - transition)) / (transition * 2))
  return Math.min(fadeIn, fadeOut)
}

function getCoverRect(image: HTMLImageElement, width: number, height: number, scale = 1) {
  const imageRatio = image.naturalWidth / image.naturalHeight
  const canvasRatio = width / height
  let drawWidth = width
  let drawHeight = height

  if (imageRatio > canvasRatio) drawWidth = height * imageRatio
  else drawHeight = width / imageRatio

  drawWidth *= scale
  drawHeight *= scale

  return {
    x: (width - drawWidth) / 2,
    y: (height - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  }
}

function drawImageLayer(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  opacity: number,
  localProgress: number,
  index: number,
) {
  const drift = (localProgress - 0.5) * (index % 2 === 0 ? -1 : 1)
  const rect = getCoverRect(image, width, height, 1.1 - localProgress * 0.065)

  context.save()
  context.globalAlpha = opacity
  context.filter = `saturate(${1.02 + opacity * 0.05}) contrast(${1.015 + opacity * 0.025})`
  context.drawImage(image, rect.x + drift * width * 0.038, rect.y - drift * height * 0.014, rect.width, rect.height)
  context.restore()
}

function drawTechnicalBackdrop(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number,
) {
  context.save()
  context.globalAlpha = opacity
  const gradient = context.createRadialGradient(width * 0.7, height * 0.47, 0, width * 0.7, height * 0.47, width * 0.74)
  gradient.addColorStop(0, '#fffdf8')
  gradient.addColorStop(0.58, '#f5f1e9')
  gradient.addColorStop(1, '#e9e3d8')
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)

  context.strokeStyle = 'rgba(67,58,48,.075)'
  context.lineWidth = Math.max(1, height * 0.0008)
  const spacing = Math.max(110, width * 0.14)
  for (let x = width * 0.34; x < width + spacing; x += spacing) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }
  for (let y = height * 0.12; y < height + spacing; y += spacing) {
    context.beginPath()
    context.moveTo(width * 0.3, y)
    context.lineTo(width, y)
    context.stroke()
  }
  context.restore()
}

function drawMechanicalAssembly(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  progress: number,
  opacity: number,
) {
  const sourceWidth = image.naturalWidth
  const sourceHeight = image.naturalHeight
  const isCompact = width < 700
  const destinationHeight = isCompact ? height * 0.7 : height * 0.66
  const destinationWidth = destinationHeight * (sourceWidth / sourceHeight)
  const destinationX = isCompact ? width * -0.58 : width * 0.39
  const destinationY = isCompact ? height * 0.03 : height * 0.12

  mechanicalSprites.forEach((sprite) => {
    const [sourceX, sourceY, sourcePartWidth, sourcePartHeight] = sprite.source
    const travel = smoothstep((progress - sprite.delay) / Math.max(0.001, 0.72 - sprite.delay))
    const destinationPartX = destinationX + (sourceX / sourceWidth) * destinationWidth
    const destinationPartY = destinationY + (sourceY / sourceHeight) * destinationHeight
    const destinationPartWidth = (sourcePartWidth / sourceWidth) * destinationWidth
    const destinationPartHeight = (sourcePartHeight / sourceHeight) * destinationHeight
    const offsetX = sprite.offset[0] * width * (1 - travel)
    const offsetY = sprite.offset[1] * height * (1 - travel)
    const centerX = destinationPartX + destinationPartWidth / 2 + offsetX
    const centerY = destinationPartY + destinationPartHeight / 2 + offsetY

    context.save()
    context.globalAlpha = opacity * (0.55 + travel * 0.45)
    context.translate(centerX, centerY)
    context.rotate(sprite.rotation * (1 - travel))
    context.scale(0.72 + travel * 0.28, 0.72 + travel * 0.28)
    context.shadowColor = 'rgba(38,30,23,.24)'
    context.shadowBlur = height * 0.018 * travel
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourcePartWidth,
      sourcePartHeight,
      -destinationPartWidth / 2,
      -destinationPartHeight / 2,
      destinationPartWidth,
      destinationPartHeight,
    )
    context.restore()
  })

  const cx = isCompact ? width * 0.64 : width * 0.695
  const cy = isCompact ? height * 0.42 : height * 0.5
  const unit = Math.min(width, height)
  context.save()
  context.translate(cx, cy)
  context.rotate(progress * Math.PI * 1.45)
  strokeGlow(context, '#c8252b', Math.max(1.5, unit * 0.0026), unit * 0.022, opacity * 0.82)
  context.setLineDash([unit * 0.042, unit * 0.022])
  context.lineDashOffset = -progress * unit * 0.52
  context.beginPath()
  context.arc(0, 0, unit * (isCompact ? 0.31 : 0.205), -0.2, Math.PI * 1.62)
  context.stroke()
  context.restore()
}

function strokeGlow(
  context: CanvasRenderingContext2D,
  color: string,
  width: number,
  blur: number,
  opacity: number,
) {
  context.strokeStyle = color
  context.lineWidth = width
  context.shadowColor = color
  context.shadowBlur = blur
  context.globalAlpha = opacity
}

function drawDiscoveryMotion(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  opacity: number,
) {
  const unit = Math.min(width, height)
  const cx = width * 0.705
  const cy = height * 0.5
  const rotation = progress * Math.PI * 1.35

  context.save()
  context.translate(cx, cy)
  context.rotate(rotation * -0.42)
  strokeGlow(context, '#c8252b', Math.max(1, unit * 0.0017), unit * 0.018, opacity * 0.78)
  context.setLineDash([unit * 0.038, unit * 0.02])
  context.lineDashOffset = -progress * unit * 0.45
  context.beginPath()
  context.arc(0, 0, unit * 0.205, -0.2, Math.PI * 1.62)
  context.stroke()
  context.restore()

  context.save()
  context.globalCompositeOperation = 'screen'
  for (let index = 0; index < 12; index += 1) {
    const angle = index * 0.9 + progress * Math.PI * 2
    const radius = unit * (0.17 + (index % 4) * 0.035)
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius * 0.64
    context.fillStyle = index % 3 === 0 ? '#ffffff' : '#d42a30'
    context.globalAlpha = opacity * (0.25 + (index % 4) * 0.12)
    context.beginPath()
    context.arc(x, y, 1.2 + (index % 3), 0, Math.PI * 2)
    context.fill()
  }
  context.restore()
}

function drawCompatibilityMotion(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  opacity: number,
) {
  const unit = Math.min(width, height)
  const cx = width * 0.7
  const cy = height * 0.505
  const radii = [0.13, 0.21, 0.29]

  radii.forEach((radiusScale, index) => {
    context.save()
    context.translate(cx, cy)
    context.rotate(progress * Math.PI * (index % 2 === 0 ? 1.7 : -1.25))
    strokeGlow(context, index === 0 ? '#e04448' : '#8dd7ff', Math.max(1, unit * 0.0022), unit * 0.018, opacity * (0.58 - index * 0.08))
    context.setLineDash([unit * (0.055 - index * 0.008), unit * 0.022])
    context.lineDashOffset = -progress * unit * (0.8 + index * 0.35)
    context.beginPath()
    context.arc(0, 0, unit * radiusScale, 0, Math.PI * 2)
    context.stroke()
    context.restore()
  })

  const scannerAngle = -0.8 + progress * Math.PI * 2.2
  context.save()
  context.translate(cx, cy)
  context.rotate(scannerAngle)
  const beam = context.createLinearGradient(0, 0, unit * 0.34, 0)
  beam.addColorStop(0, 'rgba(255,255,255,0)')
  beam.addColorStop(0.8, 'rgba(118,202,247,.3)')
  beam.addColorStop(1, 'rgba(255,255,255,.95)')
  context.strokeStyle = beam
  context.lineWidth = Math.max(1, unit * 0.002)
  context.globalAlpha = opacity
  context.beginPath()
  context.moveTo(unit * 0.08, 0)
  context.lineTo(unit * 0.34, 0)
  context.stroke()
  context.restore()
}

function distributionPath(context: CanvasRenderingContext2D, width: number, height: number) {
  context.beginPath()
  context.moveTo(width * 0.54, height * 0.18)
  context.bezierCurveTo(width * 0.88, height * 0.1, width * 0.92, height * 0.38, width * 0.72, height * 0.42)
  context.bezierCurveTo(width * 0.54, height * 0.46, width * 0.52, height * 0.7, width * 0.88, height * 0.82)
}

function cubicPoint(
  start: [number, number],
  controlA: [number, number],
  controlB: [number, number],
  end: [number, number],
  t: number,
) {
  const inverse = 1 - t
  return {
    x: inverse ** 3 * start[0] + 3 * inverse ** 2 * t * controlA[0] + 3 * inverse * t ** 2 * controlB[0] + t ** 3 * end[0],
    y: inverse ** 3 * start[1] + 3 * inverse ** 2 * t * controlA[1] + 3 * inverse * t ** 2 * controlB[1] + t ** 3 * end[1],
  }
}

function conveyorPoint(width: number, height: number, progress: number) {
  if (progress < 0.5) {
    const t = progress * 2
    return cubicPoint(
      [width * 0.54, height * 0.18],
      [width * 0.88, height * 0.1],
      [width * 0.92, height * 0.38],
      [width * 0.72, height * 0.42],
      t,
    )
  }
  const t = (progress - 0.5) * 2
  return cubicPoint(
    [width * 0.72, height * 0.42],
    [width * 0.54, height * 0.46],
    [width * 0.52, height * 0.7],
    [width * 0.88, height * 0.82],
    t,
  )
}

function drawDistributionParts(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  progress: number,
  opacity: number,
) {
  const sourceWidth = image.naturalWidth
  const sourceHeight = image.naturalHeight
  const unit = Math.min(width, height)

  distributionSprites.forEach(([sourceX, sourceY, sourcePartWidth, sourcePartHeight], index) => {
    const pathProgress = (progress * 1.18 + index * 0.164) % 1
    const point = conveyorPoint(width, height, pathProgress)
    const nextPoint = conveyorPoint(width, height, (pathProgress + 0.008) % 1)
    const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x)
    const naturalRatio = sourcePartWidth / sourcePartHeight
    const destinationHeight = unit * (index === 0 ? 0.12 : 0.085)
    const destinationWidth = destinationHeight * naturalRatio
    const pulse = 0.9 + Math.sin((pathProgress + index) * Math.PI * 2) * 0.06

    context.save()
    context.globalAlpha = opacity * (0.72 + (index % 3) * 0.08)
    context.translate(point.x, point.y)
    context.rotate(angle * 0.24 + progress * (index % 2 === 0 ? 0.16 : -0.13))
    context.scale(pulse, pulse)
    context.shadowColor = 'rgba(255,39,48,.62)'
    context.shadowBlur = unit * 0.025
    context.drawImage(
      image,
      sourceX,
      sourceY,
      Math.min(sourcePartWidth, sourceWidth - sourceX),
      Math.min(sourcePartHeight, sourceHeight - sourceY),
      -destinationWidth / 2,
      -destinationHeight / 2,
      destinationWidth,
      destinationHeight,
    )
    context.restore()
  })
}

function drawDistributionMotion(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  opacity: number,
) {
  const unit = Math.min(width, height)
  context.save()
  context.globalCompositeOperation = 'screen'
  strokeGlow(context, '#ff3038', Math.max(2, unit * 0.004), unit * 0.026, opacity * 0.68)
  context.setLineDash([unit * 0.08, unit * 0.035])
  context.lineDashOffset = -progress * unit * 1.8
  distributionPath(context, width, height)
  context.stroke()

  strokeGlow(context, '#fff3ec', Math.max(1, unit * 0.0015), unit * 0.012, opacity * 0.86)
  context.setLineDash([unit * 0.018, unit * 0.055])
  context.lineDashOffset = -progress * unit * 2.8
  distributionPath(context, width, height)
  context.stroke()
  context.restore()

  for (let gate = 0; gate < 3; gate += 1) {
    const x = width * (0.62 + gate * 0.12)
    const scan = ((progress * 3 + gate * 0.35) % 1) * height * 0.28
    const gradient = context.createLinearGradient(0, height * 0.22 + scan, 0, height * 0.31 + scan)
    gradient.addColorStop(0, 'rgba(255,48,56,0)')
    gradient.addColorStop(0.5, `rgba(255,48,56,${opacity * 0.28})`)
    gradient.addColorStop(1, 'rgba(255,48,56,0)')
    context.fillStyle = gradient
    context.fillRect(x, height * 0.2 + scan, unit * 0.035, height * 0.12)
  }
}

function drawFinalMotion(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  opacity: number,
) {
  const unit = Math.min(width, height)
  const originX = width * 0.69
  const originY = height * 0.53
  context.save()
  context.globalCompositeOperation = 'screen'
  for (let index = 0; index < 8; index += 1) {
    const targetAngle = -2.7 + index * 0.58
    const targetX = originX + Math.cos(targetAngle) * unit * (0.2 + (index % 3) * 0.035)
    const targetY = originY + Math.sin(targetAngle) * unit * 0.22
    strokeGlow(context, index % 3 === 0 ? '#ffffff' : '#79cbff', Math.max(1, unit * 0.0016), unit * 0.02, opacity * (0.28 + (index % 3) * 0.11))
    context.setLineDash([unit * 0.018, unit * 0.022])
    context.lineDashOffset = -progress * unit * (1.4 + index * 0.09)
    context.beginPath()
    context.moveTo(originX, originY)
    context.quadraticCurveTo((originX + targetX) / 2 + Math.sin(index) * unit * 0.04, (originY + targetY) / 2, targetX, targetY)
    context.stroke()
  }

  const sweep = context.createLinearGradient(width * 0.5, 0, width * 0.95, 0)
  sweep.addColorStop(0, 'rgba(94,194,255,0)')
  sweep.addColorStop(0.52, `rgba(172,225,255,${opacity * 0.72})`)
  sweep.addColorStop(1, 'rgba(94,194,255,0)')
  context.strokeStyle = sweep
  context.lineWidth = Math.max(1, unit * 0.002)
  context.shadowColor = '#7bcaff'
  context.shadowBlur = unit * 0.026
  context.beginPath()
  context.moveTo(width * (0.48 + progress * 0.08), height * 0.79)
  context.bezierCurveTo(width * 0.62, height * 0.72, width * 0.82, height * 0.72, width * 0.96, height * 0.82)
  context.stroke()
  context.restore()
}

function drawFrame(
  context: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  width: number,
  height: number,
  progress: number,
) {
  context.clearRect(0, 0, width, height)
  context.fillStyle = progress > 0.72 ? '#080b10' : '#f4f0e8'
  context.fillRect(0, 0, width, height)

  images.slice(0, 4).forEach((image, index) => {
    const opacity = stageOpacity(progress, index)
    if (opacity <= 0.002) return
    const localProgress = clamp((progress - index * 0.25) / 0.25)
    if (index === 0) {
      drawTechnicalBackdrop(context, width, height, opacity)
      drawMechanicalAssembly(context, images[4], width, height, localProgress, opacity)
    } else {
      drawImageLayer(context, image, width, height, opacity, localProgress, index)
    }

    if (index === 0) drawDiscoveryMotion(context, width, height, localProgress, opacity)
    if (index === 1) drawCompatibilityMotion(context, width, height, localProgress, opacity)
    if (index === 2) {
      drawDistributionMotion(context, width, height, localProgress, opacity)
      drawDistributionParts(context, images[5], width, height, localProgress, opacity)
    }
    if (index === 3) drawFinalMotion(context, width, height, localProgress, opacity)
  })

  const frameNumber = Math.round(progress * (FRAME_COUNT - 1))
  context.save()
  context.globalAlpha = 0.28
  context.fillStyle = progress > 0.72 ? '#ffffff' : '#171717'
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

    const images = imageSources.map((source) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = getAssetPath(source)
      return image
    })

    let animationFrame = 0
    let lastProgress = -1
    let lastWidth = 0
    let lastHeight = 0
    let isDisposed = false

    const render = () => {
      if (isDisposed) return
      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.round(bounds.width * dpr))
      const height = Math.max(1, Math.round(bounds.height * dpr))
      const allReady = images.every((image) => image.complete && image.naturalWidth > 0)
      const progress = clamp(progressRef.current)

      if (allReady && (Math.abs(progress - lastProgress) > 0.0001 || width !== lastWidth || height !== lastHeight)) {
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }
        drawFrame(context, images, width, height, progress)
        canvas.dataset.frame = String(Math.round(progress * (FRAME_COUNT - 1)))
        lastProgress = progress
        lastWidth = width
        lastHeight = height
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    images.forEach((image) => image.addEventListener('load', () => { lastProgress = -1 }, { once: true }))
    animationFrame = window.requestAnimationFrame(render)

    return () => {
      isDisposed = true
      window.cancelAnimationFrame(animationFrame)
    }
  }, [progressRef])

  return (
    <canvas
      ref={canvasRef}
      className="vector-story__canvas"
      aria-hidden="true"
      data-frame="0"
    />
  )
}
