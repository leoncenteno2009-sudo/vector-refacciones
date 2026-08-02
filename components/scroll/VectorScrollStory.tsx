'use client'

import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VectorCanvas } from '@/components/three/VectorCanvas'
import { ScrollStageCopy } from './ScrollStageCopy'
import { ScrollProgress } from './ScrollProgress'

export const VectorScrollStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  // Use mutable refs for smooth 60fps render loop without triggering React re-renders on every scroll pixel
  const progressRef = useRef(0)
  const [currentStateIndex, setCurrentStateIndex] = useState(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!containerRef.current || !stickyRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyRef.current,
        scrub: 0.7,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress
          progressRef.current = p

          // Calculate discrete state index for HTML copy transitions only
          let nextIndex = 0
          if (p < 0.24) {
            nextIndex = 0
          } else if (p < 0.5) {
            nextIndex = 1
          } else if (p < 0.76) {
            nextIndex = 2
          } else {
            nextIndex = 3
          }

          setCurrentStateIndex((prev) => (prev !== nextIndex ? nextIndex : prev))
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[480vh] bg-ivory-100 transition-colors duration-700"
      aria-label="Secuencia de presentación del Núcleo Mecánico VECTOR"
    >
      {/* 100svh Sticky Viewport */}
      <div
        ref={stickyRef}
        className={`w-full h-screen sticky top-0 left-0 overflow-hidden flex items-center transition-colors duration-700 ${
          currentStateIndex === 3 ? 'bg-graphite text-white' : 'bg-ivory-100 text-carbon'
        }`}
      >
        <div className="max-w-site w-full mx-auto px-5 md:px-8 lg:px-12 h-full flex flex-col justify-center pt-[80px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-[calc(100vh-100px)]">
            {/* Column Left (1-5): Accessible HTML Text Content */}
            <div className="lg:col-span-5 z-20 flex items-center">
              <ScrollStageCopy progress={progressRef.current} currentStateIndex={currentStateIndex} />
            </div>

            {/* Column Right (6-12): 3D Canvas / Visual Scene */}
            <div className="lg:col-span-7 h-full w-full relative z-10 min-h-[350px] lg:min-h-[500px]">
              <VectorCanvas progressRef={progressRef} currentStateIndex={currentStateIndex} />
            </div>
          </div>
        </div>

        {/* Progress Sidebar */}
        <ScrollProgress progressRef={progressRef} currentStateIndex={currentStateIndex} />
      </div>
    </section>
  )
}
