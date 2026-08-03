'use client'

import React from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { scrollSequenceStates } from '@/content/siteContent'
import { siteConfig } from '@/config/site.config'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

interface ScrollStageCopyProps {
  currentStateIndex: number
}

export const ScrollStageCopy: React.FC<ScrollStageCopyProps> = ({ currentStateIndex }) => {
  const state = scrollSequenceStates[currentStateIndex]
  const isDistribution = currentStateIndex === 2

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
        <a className={`vector-button ${isDistribution ? 'vector-button--red' : ''}`} href={state.primaryCTA.href}>
          <span>{state.primaryCTA.label}</span>
          <ArrowRight aria-hidden="true" />
        </a>
        {state.secondaryCTA && (
          <a className="vector-button vector-button--ghost" href={state.secondaryCTA.href}>
            {state.secondaryCTA.label}
          </a>
        )}
        {currentStateIndex === 0 && siteConfig.contact.whatsapp && (
          <a
            className="vector-button bg-[#25D366] hover:bg-[#20bd5a] border-transparent text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:shadow-[0_8px_24px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            href={`${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
              'Hola VECTOR, me gustaría cotizar una refacción automotriz.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
            <span>Cotizar por WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  )
}
