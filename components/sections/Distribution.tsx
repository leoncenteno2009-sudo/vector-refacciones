'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Truck, Store, Users, ArrowRight } from 'lucide-react'

export const Distribution: React.FC = () => {
  return (
    <section id="distribucion" className="ambient-section ambient-route py-24 bg-[#303030] text-white border-t border-white/10" aria-labelledby="distribution-heading">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
              Infraestructura y Logística
            </span>
            <h2 id="distribution-heading" className="section-h2 text-white">
              Inventario que sigue el ritmo de tu negocio
            </h2>
            <p className="body-intro text-gray-300">
              Contamos con un centro de distribución optimizado para preparar, empaquetar y despachar refacciones automotrices con cobertura nacional.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-xl bg-[#242424] border border-white/10 text-white hover:border-vector-red/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <Users className="w-6 h-6 text-vector-red mb-3" />
                <h4 className="font-bold text-white text-base mb-1">Particulares</h4>
                <p className="text-xs text-gray-300">Atención personalizada para mantener tu auto en marcha.</p>
              </div>

              <div className="p-5 rounded-xl bg-[#242424] border border-white/10 text-white hover:border-vector-red/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <Store className="w-6 h-6 text-vector-red mb-3" />
                <h4 className="font-bold text-white text-base mb-1">Talleres</h4>
                <p className="text-xs text-gray-300">Precios de mayoreo y entregas prioritarias en bodega.</p>
              </div>

              <div className="p-5 rounded-xl bg-[#242424] border border-white/10 text-white hover:border-vector-red/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <Truck className="w-6 h-6 text-vector-red mb-3" />
                <h4 className="font-bold text-white text-base mb-1">Refaccionarias</h4>
                <p className="text-xs text-gray-300">Surtido de volumen con empaque de alta resistencia.</p>
              </div>
            </div>

            <div className="pt-4">
              <Button href="#cotizacion" variant="primary">
                Conocer plan de distribución
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Column: Warehouse Graphic/Photographic Holder */}
          <div className="lg:col-span-6">
            <div className="distribution-console relative rounded-2xl overflow-hidden bg-graphite p-8 text-white border border-carbon/20 shadow-2xl min-h-[420px] flex flex-col justify-between">
              {/* Technical Grid Overlay */}
              <div
                className="technical-grid absolute -inset-8 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-vector-red px-3 py-1 bg-white/10 rounded-full">
                  Centro de Distribución VECTOR
                </span>
                <span className="text-xs text-steel font-mono">ESTADO: ACTIVO</span>
              </div>

              <div className="relative z-10 my-auto py-12 text-center">
                <div className="distribution-pulse w-20 h-20 mx-auto mb-4 rounded-full bg-vector-red/20 border border-vector-red flex items-center justify-center text-vector-red">
                  <Truck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Despacho y Control de Calidad</h3>
                <p className="text-sm text-steel max-w-sm mx-auto">
                  Cada componente es inspeccionado visual y dimensionalmente antes del empaque.
                </p>
              </div>

              <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-steel">
                <span>Inspección dimensional: 100%</span>
                <span>Cobertura: México</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
