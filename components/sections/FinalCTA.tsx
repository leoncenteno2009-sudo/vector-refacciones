'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import Strands from '@/components/three/Strands'

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative overflow-hidden ambient-section ambient-grid ambient-route ambient-dark py-28 bg-graphite text-white border-t border-white/10" aria-label="Llamado a la acción final">
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <Strands
          colors={["#FF3333", "#F97316", "#38BDF8", "#EAB308"]}
          count={3}
          speed={0.5}
          amplitude={1.1}
          waviness={1.0}
          thickness={0.7}
          glow={2.6}
          taper={3.0}
          spread={1.0}
          intensity={0.6}
          saturation={1.8}
          opacity={0.85}
          scale={1.5}
        />
      </div>
      <div className="relative z-10 max-w-site mx-auto px-5 md:px-8 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <span className="text-xs uppercase font-bold tracking-widest text-vector-red px-3 py-1 bg-vector-red/10 rounded-full border border-vector-red/20">
            Respuesta Ágil y Confiable
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Encuentra la pieza correcta para seguir avanzando.
          </h2>

          <p className="text-steel text-lg max-w-xl">
            Comparte los datos de tu vehículo y recibe atención especializada.
          </p>

          <div className="pt-4">
            <Button href="#cotizacion" variant="vectorRed" className="px-10 py-4 text-lg">
              Solicitar cotización
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
