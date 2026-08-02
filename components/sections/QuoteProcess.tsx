'use client'

import React from 'react'
import { quoteStepsContent } from '@/content/siteContent'

export const QuoteProcess: React.FC = () => {
  return (
    <section className="py-24 bg-white border-t border-carbon/10" aria-labelledby="process-heading">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
            Proceso Transparente
          </span>
          <h2 id="process-heading" className="section-h2 text-carbon mt-2">
            Tres pasos para volver al camino
          </h2>
          <p className="body-intro mt-4">
            Un flujo optimizado para evitar errores de pedido y entregarte la refacción correcta a la primera.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {quoteStepsContent.map((step, idx) => (
            <div
              key={step.number}
              className="p-8 rounded-2xl bg-ivory-100/70 border border-carbon/10 relative flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-extrabold text-vector-red font-mono block mb-4">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-carbon mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-carbon/10 text-xs font-semibold text-carbon flex items-center justify-between">
                <span>Paso {idx + 1} de 3</span>
                <span className="w-2 h-2 rounded-full bg-vector-red"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
