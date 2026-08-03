'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CinematicScrollCanvas } from './CinematicScrollCanvas'
import { ScrollStageCopy } from './ScrollStageCopy'
import { ScrollProgress } from './ScrollProgress'

export const VectorScrollStory: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const [currentStateIndex, setCurrentStateIndex] = useState(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const { progress, direction } = self
          progressRef.current = progress
          const nextIndex = Math.min(3, Math.floor(progress * 4))
          setCurrentStateIndex((previous) => (previous === nextIndex ? previous : nextIndex))

          if (progressFillRef.current) progressFillRef.current.style.transform = `scaleY(${progress})`
          if (stickyRef.current) {
            stickyRef.current.style.setProperty('--scroll-progress', progress.toFixed(4))
            stickyRef.current.style.setProperty('--scroll-direction', String(direction))
            stickyRef.current.style.setProperty('--scroll-velocity', String(Math.min(1, Math.abs(self.getVelocity()) / 2500)))
          }
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="vector-story"
      aria-label="Historia animada de refacciones, compatibilidad, distribución y movimiento VECTOR"
    >
      <div ref={stickyRef} className={`vector-story__sticky ${currentStateIndex === 3 ? 'is-dark' : ''}`}>
        <div className="vector-story__media" aria-hidden="true">
          <CinematicScrollCanvas progressRef={progressRef} />
          <div className="vector-story__vignette" />
          <div className="vector-story__scanner" />
          <div className="vector-story__grain" />
        </div>

        <div className="vector-story__content">
          <ScrollStageCopy currentStateIndex={currentStateIndex} />
        </div>

        <ScrollProgress currentStateIndex={currentStateIndex} progressFillRef={progressFillRef} />

        <div className="vector-story__scroll-hint" aria-hidden="true">
          <span>Desliza para animar</span>
          <i />
        </div>
      </div>
    </section>
  )
}
