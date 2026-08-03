'use client'

import React from 'react'

export const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="ambient-section ambient-blueprint py-24 bg-ivory-200 border-t border-carbon/10" aria-labelledby="about-heading">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="max-w-3xl">
          <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
            Nuestra Identidad
          </span>
          <h2 id="about-heading" className="section-h2 text-carbon mt-2">
            Ingeniería y precisión en distribución automotriz
          </h2>
          <p className="body-intro mt-4">
            En VECTOR combinamos la precisión técnica de la ingeniería de autopartes con una infraestructura logística orientada a mantener vehículos, talleres y flotillas en constante movimiento.
          </p>
        </div>
      </div>
    </section>
  )
}
