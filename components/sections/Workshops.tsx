'use client'

import React from 'react'
import { verifiedClaims } from '@/config/verifiedClaims'
import { Button } from '@/components/ui/Button'
import { Wrench, ShieldCheck, Zap } from 'lucide-react'

export const Workshops: React.FC = () => {
  return (
    <section id="talleres" className="ambient-section ambient-grid py-24 bg-[#303030] text-white border-t border-white/10" aria-labelledby="workshops-heading">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="workshops-panel bg-carbon text-white rounded-3xl p-10 md:p-16 shadow-[0_20px_60px_rgba(13,15,18,0.25)] relative overflow-hidden">
          {/* Ambient Red Accent */}
          <div className="ambient-glow absolute -top-24 -right-24 w-96 h-96 bg-vector-red/25 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
              Programa de Aliados
            </span>
            <h2 id="workshops-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-2 mb-6">
              Atención especializada para talleres automotrices
            </h2>
            <p className="text-steel text-lg leading-relaxed mb-8">
              Entendemos que cada día que un vehículo permanece en la rampa sin piezas representa una pérdida. Ofrecemos asistencia técnica directa para talleres y instalaciones de servicio.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-vector-red/20 text-vector-red flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Atención técnica prioritaria</h3>
                  <p className="text-xs text-steel mt-1">Cotización especializada de refacciones.</p>
                </div>
              </div>

              {verifiedClaims.vinVerification && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-vector-red/20 text-vector-red flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Verificación por VIN</h3>
                    <p className="text-xs text-steel mt-1">Validación exacta de número de chasis o serie.</p>
                  </div>
                </div>
              )}
            </div>

            <Button href="#cotizacion" variant="vectorRed" className="px-8">
              Registrar mi taller como aliado
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
