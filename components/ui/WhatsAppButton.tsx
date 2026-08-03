'use client'

import React from 'react'
import { siteConfig } from '@/config/site.config'
import { WhatsAppIcon } from './WhatsAppIcon'

export const WhatsAppButton: React.FC = () => {
  const whatsappUrl = siteConfig.contact.whatsapp
    ? `${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
        'Hola VECTOR, me gustaría consultar la disponibilidad y cotizar una refacción automotriz.'
      )}`
    : '#'

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp con un asesor técnico de VECTOR"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_14px_40px_rgba(37,211,102,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-4 focus-visible:ring-[#25D366]/40 outline-none"
    >
      {/* Online indicator pulse */}
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
      </span>

      {/* WhatsApp Official Logo */}
      <WhatsAppIcon className="w-6 h-6 text-white shrink-0" />

      {/* Text Label - Always visible on desktop */}
      <div className="hidden sm:flex flex-col text-left pr-1 leading-tight">
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">
          Atención Inmediata
        </span>
        <span className="text-sm font-extrabold tracking-tight">
          Cotizar por WhatsApp
        </span>
      </div>
    </a>
  )
}
