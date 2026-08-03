'use client'

import React from 'react'
import { ArrowRight, Check, ShieldCheck, Truck, Wrench } from 'lucide-react'
import { scrollSequenceStates } from '@/content/siteContent'

interface ScrollStageCopyProps {
  currentStateIndex: number
}

export const ScrollStageCopy: React.FC<ScrollStageCopyProps> = ({ currentStateIndex }) => {
  const state = scrollSequenceStates[currentStateIndex]
  const isFinal = currentStateIndex === 3

  return (
    <div key={state.id} className={`stage-copy stage-copy--${currentStateIndex + 1}`}>
      <div className="stage-copy__eyebrow">
        <span>{String(currentStateIndex + 1).padStart(2, '0')}</span>
        <i />
        <span>{state.tag.replace(/^\d+\s*\/\s*/, '')}</span>
      </div>

      {currentStateIndex === 0 ? (
        <h1 className="stage-copy__title">{state.title}</h1>
      ) : (
        <h2 className="stage-copy__title">{state.title}</h2>
      )}

      <p className="stage-copy__description">{state.description}</p>

      {currentStateIndex === 1 && (
        <div className="compatibility-specs" aria-label="Ejemplo de filtros de compatibilidad">
          <span><small>Marca</small>Mazda</span>
          <span><small>Modelo</small>Mazda 3</span>
          <span className="is-match"><small>Año</small>2022 <Check aria-hidden="true" /></span>
        </div>
      )}

      {currentStateIndex === 2 && state.benefits && (
        <ul className="stage-copy__benefits">
          {state.benefits.map((benefit) => (
            <li key={benefit}><Check aria-hidden="true" />{benefit}</li>
          ))}
        </ul>
      )}

      <div className="stage-copy__actions">
        <a className={`vector-button ${isFinal ? 'vector-button--red' : ''}`} href={state.primaryCTA.href}>
          <span>{state.primaryCTA.label}</span>
          <ArrowRight aria-hidden="true" />
        </a>
        {state.secondaryCTA && (
          <a className="vector-button vector-button--ghost" href={state.secondaryCTA.href}>
            {state.secondaryCTA.label}
          </a>
        )}
      </div>

      {isFinal && (
        <div className="stage-copy__trust" aria-label="Garantías de servicio">
          <span><ShieldCheck aria-hidden="true" />Compatibilidad verificada</span>
          <span><Truck aria-hidden="true" />Envíos nacionales</span>
          <span><Wrench aria-hidden="true" />Soporte especializado</span>
        </div>
      )}
    </div>
  )
}
