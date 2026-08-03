'use client'

import React from 'react'

interface ScrollProgressProps {
  currentStateIndex: number
  progressFillRef: React.RefObject<HTMLDivElement>
}

const steps = ['Descubrir', 'Compatibilidad', 'Distribución']

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  currentStateIndex,
  progressFillRef,
}) => (
  <nav className="story-progress" aria-label="Progreso de la presentación">
    <div className="story-progress__track" aria-hidden="true">
      <div ref={progressFillRef} className="story-progress__fill" />
    </div>
    <ol>
      {steps.map((label, index) => (
        <li key={label} className={index === currentStateIndex ? 'is-active' : ''}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{label}</strong>
          <i aria-hidden="true" />
        </li>
      ))}
    </ol>
  </nav>
)
