'use client'

import React from 'react'
import { scrollSequenceStates } from '@/content/siteContent'
import { siteConfig } from '@/config/site.config'
import { Button } from '@/components/ui/Button'
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, Wrench } from 'lucide-react'

interface ScrollStageCopyProps {
  progress: number
  currentStateIndex: number
}

export const ScrollStageCopy: React.FC<ScrollStageCopyProps> = ({ currentStateIndex }) => {
  return (
    <div className="w-full max-w-xl flex flex-col justify-center min-h-[420px] transition-all duration-500">
      {scrollSequenceStates.map((state, idx) => {
        const isActive = idx === currentStateIndex
        if (!isActive) return null

        return (
          <div
            key={state.id}
            className="flex flex-col gap-6 animate-fadeIn transition-opacity duration-300"
          >
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-vector-red"></span>
              <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
                {state.tag}
              </span>
            </div>

            {/* Title H1 / H2 */}
            {idx === 0 ? (
              <h1 className="hero-h1 text-carbon leading-[1.08]">
                {state.title}
              </h1>
            ) : (
              <h2 className="section-h2 text-carbon leading-[1.1]">
                {state.title}
              </h2>
            )}

            {/* Description */}
            <p className="body-intro max-w-lg">
              {state.description}
            </p>

            {/* State 02: Ring HTML Indicators */}
            {idx === 1 && (
              <div className="flex flex-wrap gap-2.5 my-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-vector-blueDiag/15 border border-vector-blueDiag/40 text-xs font-semibold text-carbon">
                  <span className="w-2 h-2 rounded-full bg-vector-blueDiag mr-2"></span>
                  Marca: <strong className="ml-1 font-bold">Selección</strong>
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-vector-blueDiag/15 border border-vector-blueDiag/40 text-xs font-semibold text-carbon">
                  <span className="w-2 h-2 rounded-full bg-vector-blueDiag mr-2"></span>
                  Modelo: <strong className="ml-1 font-bold">Selección</strong>
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-vector-red/15 border border-vector-red/40 text-xs font-semibold text-carbon">
                  <span className="w-2 h-2 rounded-full bg-vector-red mr-2"></span>
                  Año: <strong className="ml-1 font-bold">Coincidencia</strong>
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-carbon/5 border border-carbon/10 text-xs font-medium text-text-secondary">
                  Versión: Filtro Avanzado
                </span>
              </div>
            )}

            {/* State 03: Benefits List */}
            {idx === 2 && state.benefits && (
              <ul className="flex flex-col gap-2.5 my-1">
                {state.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm font-semibold text-carbon">
                    <CheckCircle2 className="w-4 h-4 text-vector-red shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* State 04: Trust Badges */}
            {idx === 3 && state.trustBadges && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 pt-2 border-t border-carbon/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-carbon">
                  <ShieldCheck className="w-4 h-4 text-vector-red shrink-0" />
                  <span>Compatibilidad verificada</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-carbon">
                  <Truck className="w-4 h-4 text-vector-red shrink-0" />
                  <span>Envíos nacionales</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-carbon">
                  <Wrench className="w-4 h-4 text-vector-red shrink-0" />
                  <span>Soporte para talleres</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button href={state.primaryCTA.href} variant={idx === 3 ? 'vectorRed' : 'primary'}>
                {state.primaryCTA.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {state.secondaryCTA && (
                <Button
                  href={state.secondaryCTA.href}
                  variant="secondary"
                >
                  {state.secondaryCTA.label}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
