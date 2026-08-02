'use client'

import React from 'react'

interface FallbackPosterProps {
  stateIndex: number
}

export const FallbackPoster: React.FC<FallbackPosterProps> = ({ stateIndex }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-ivory-200/50 rounded-2xl border border-carbon/10 overflow-hidden relative">
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 bg-white/80 backdrop-blur-md rounded-xl max-w-md shadow-lg border border-carbon/5">
        <svg
          width="48"
          height="48"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4 text-vector-red"
        >
          <path d="M6 8L20 34L34 8H26L20 20L14 8H6Z" fill="currentColor" />
          <path d="M20 25L24 16H29L20 32L11 16H16L20 25Z" fill="#171717" />
        </svg>
        <span className="text-xs uppercase font-bold tracking-widest text-vector-red mb-1">
          Modo Editorial VECTOR
        </span>
        <h4 className="text-xl font-bold text-carbon mb-2">
          {stateIndex === 0 && 'Refacciones Mecánicas de Alta Calidad'}
          {stateIndex === 1 && 'Verificación Técnica de Compatibilidad'}
          {stateIndex === 2 && 'Almacén y Distribución Nacional'}
          {stateIndex === 3 && 'Solución Integral Automotriz'}
        </h4>
        <p className="text-sm text-text-secondary">
          Visualización optimizada para máxima velocidad y accesibilidad en tu dispositivo.
        </p>
      </div>

      {/* Decorative technical grid background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #171717 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}
