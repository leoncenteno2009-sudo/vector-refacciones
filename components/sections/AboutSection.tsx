'use client'

import React from 'react'
import CountUp from '@/components/ui/CountUp'

export const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="ambient-section ambient-blueprint py-24 bg-[#303030] text-white border-t border-white/10" aria-labelledby="about-heading">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
              Nuestra Identidad
            </span>
            <h2 id="about-heading" className="section-h2 text-white mt-2">
              Ingeniería y precisión en distribución automotriz
            </h2>
            <p className="body-intro mt-4 text-gray-300">
              En VECTOR combinamos la precisión técnica de la ingeniería de autopartes con una infraestructura logística orientada a mantener vehículos, talleres y flotillas en constante movimiento.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-graphite border border-white/10">
              <span className="text-3xl sm:text-4xl font-bold text-vector-red block">
                <CountUp to={100} duration={2.5} />%
              </span>
              <span className="text-xs uppercase font-semibold tracking-wider text-steel mt-1 block">Inspección de Calidad</span>
            </div>

            <div className="p-6 rounded-2xl bg-graphite border border-white/10">
              <span className="text-3xl sm:text-4xl font-bold text-white block">
                +<CountUp to={5000} separator="," duration={2.5} />
              </span>
              <span className="text-xs uppercase font-semibold tracking-wider text-steel mt-1 block">Refacciones en Stock</span>
            </div>

            <div className="p-6 rounded-2xl bg-graphite border border-white/10">
              <span className="text-3xl sm:text-4xl font-bold text-white block">
                <CountUp to={24} duration={1.5} />h
              </span>
              <span className="text-xs uppercase font-semibold tracking-wider text-steel mt-1 block">Despacho Logístico</span>
            </div>

            <div className="p-6 rounded-2xl bg-graphite border border-white/10">
              <span className="text-3xl sm:text-4xl font-bold text-vector-red block">
                <CountUp to={99.8} duration={2} />%
              </span>
              <span className="text-xs uppercase font-semibold tracking-wider text-steel mt-1 block">Ajuste de Compatibilidad</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
