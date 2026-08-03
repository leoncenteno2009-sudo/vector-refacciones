'use client'

import React, { useState } from 'react'
import { PrivacyModal } from '@/components/ui/PrivacyModal'

export const ContactSection: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)

  return (
    <section id="contacto" className="ambient-section ambient-route py-24 bg-[#303030] text-white border-t border-white/10" aria-labelledby="contact-heading">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
              Atención y Asistencia
            </span>
            <h2 id="contact-heading" className="section-h2 text-white mt-2">
              Contacto y atención especializada
            </h2>
            <p className="body-intro mt-4 text-gray-300">
              Si tienes preguntas sobre la compatibilidad de una pieza o requieres información sobre pedidos de distribución, nuestro equipo está disponible para asistirte.
            </p>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6 text-sm font-semibold text-white">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="text-vector-red hover:underline focus-visible:outline-none"
              >
                Ver Aviso de Privacidad
              </button>
              <a href="#cotizacion" className="hover:text-vector-red transition-colors text-gray-200">
                Ir al formulario de cotización
              </a>
            </div>
          </div>

          <div className="bg-[#242424] p-8 md:p-10 rounded-2xl border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.4)] hover:border-vector-red/40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <h3 className="text-xl font-bold text-white mb-4">Garantía de servicio VECTOR</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-vector-red"></span>
                <span>Asistencia técnica previa a la compra.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-vector-red"></span>
                <span>Verificación de catálogo de equipo original (OEM).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-vector-red"></span>
                <span>Despacho seguro para clientes particulares y talleres.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </section>
  )
}
