'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getAssetPath } from '@/lib/utils'
import { ScrollStageCopy } from './ScrollStageCopy'
import { ScrollProgress } from './ScrollProgress'

const stageImages = [
  '/images/scroll/vector-stage-01.jpg',
  '/images/scroll/vector-stage-02.jpg',
  '/images/scroll/vector-stage-03.jpg',
  '/images/scroll/vector-stage-04.jpg',
]

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smoothstep = (value: number) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

function getStageOpacity(progress: number, index: number) {
  const transition = 0.055
  const start = index * 0.25
  const end = (index + 1) * 0.25

  if (index === 0) return 1 - smoothstep((progress - (end - transition)) / (transition * 2))
  if (index === 3) return smoothstep((progress - (start - transition)) / (transition * 2))

  const fadeIn = smoothstep((progress - (start - transition)) / (transition * 2))
  const fadeOut = 1 - smoothstep((progress - (end - transition)) / (transition * 2))
  return Math.min(fadeIn, fadeOut)
}

export const VectorScrollStory: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null)
  const imageRefs = useRef<Array<HTMLImageElement | null>>([])
  const progressFillRef = useRef<HTMLDivElement>(null)
  const [currentStateIndex, setCurrentStateIndex] = useState(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!containerRef.current) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const nextIndex = Math.min(3, Math.floor(progress * 4))
          setCurrentStateIndex((previous) => (previous === nextIndex ? previous : nextIndex))

          if (progressFillRef.current) {
            progressFillRef.current.style.transform = `scaleY(${progress})`
          }

          imageRefs.current.forEach((image, index) => {
            if (!image) return
            const opacity = reduceMotion ? (index === nextIndex ? 1 : 0) : getStageOpacity(progress, index)
            const localProgress = clamp((progress - index * 0.25) / 0.25)
            const direction = index % 2 === 0 ? 1 : -1
            image.style.opacity = opacity.toFixed(3)
            image.style.transform = reduceMotion
              ? 'scale(1.015) translate3d(0,0,0)'
              : `scale(${(1.055 - localProgress * 0.045).toFixed(4)}) translate3d(${(
                  direction * (1 - localProgress) * 1.35
                ).toFixed(3)}%, ${(0.7 - localProgress * 0.7).toFixed(3)}%, 0)`
          })
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="vector-story"
      aria-label="Historia de refacciones, compatibilidad, distribución y movimiento VECTOR"
    >
      <div className={`vector-story__sticky ${currentStateIndex === 3 ? 'is-dark' : ''}`}>
        <div className="vector-story__media" aria-hidden="true">
          {stageImages.map((src, index) => (
            <img
              key={src}
              ref={(node) => {
                imageRefs.current[index] = node
              }}
              src={getAssetPath(src)}
              alt=""
              width={1672}
              height={941}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              className="vector-story__image"
              style={{ opacity: index === 0 ? 1 : 0 }}
            />
          ))}
          <div className="vector-story__vignette" />
          <div className="vector-story__scanner" />
          <div className="vector-story__grain" />
        </div>

        <div className="vector-story__content">
          <ScrollStageCopy currentStateIndex={currentStateIndex} />
        </div>

        <ScrollProgress currentStateIndex={currentStateIndex} progressFillRef={progressFillRef} />

        <div className="vector-story__scroll-hint" aria-hidden="true">
          <span>Desliza para explorar</span>
          <i />
        </div>
      </div>
    </section>
  )
}
