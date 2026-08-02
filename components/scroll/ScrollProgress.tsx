'use client'

import React from 'react'

interface ScrollProgressProps {
  progress: number
  currentStateIndex: number
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ progress, currentStateIndex }) => {
  const steps = [
    { label: '01 Descubrir', percent: '0%' },
    { label: '02 Compatibilidad', percent: '33%' },
    { label: '03 Distribución', percent: '66%' },
    { label: '04 Cotización', percent: '100%' },
  ]

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-end gap-5">
      {steps.map((step, i) => {
        const isActive = i === currentStateIndex
        return (
          <div key={i} className="flex items-center gap-3 group cursor-pointer">
            <span
              className={`text-[11px] font-semibold tracking-wider transition-colors duration-200 ${
                isActive ? 'text-vector-red font-bold' : 'text-text-secondary/60 group-hover:text-carbon'
              }`}
            >
              {step.label}
            </span>
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-vector-red ring-4 ring-vector-red/20 scale-125'
                  : 'bg-steel/40 group-hover:bg-carbon'
              }`}
            />
          </div>
        )
      })}
      {/* Progress Line */}
      <div className="w-[2px] h-24 bg-steel/20 rounded-full mt-2 overflow-hidden relative">
        <div
          className="w-full bg-vector-red transition-all duration-150"
          style={{ height: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  )
}
