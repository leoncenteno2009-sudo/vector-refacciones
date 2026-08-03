'use client'

import React from 'react'
import { siteConfig } from '@/config/site.config'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-graphite text-white pt-16 pb-12 border-t border-white/10" aria-label="Pie de página">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8L20 34L34 8H26L20 20L14 8H6Z" fill="#FFFFFF" />
                <path d="M20 25L24 16H29L20 32L11 16H16L20 25Z" fill="#D92B2B" />
              </svg>
              <span className="font-bold text-2xl tracking-tight text-white">VECTOR</span>
            </div>
            <p className="text-steel text-sm leading-relaxed">
              Refacciones y distribución automotriz para clientes particulares, talleres mecánicos y negocios.
              Compatibilidad garantizada e inventario confiable.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-vector-red mb-4">
              Navegación
            </h3>
            <ul className="space-y-2.5 text-sm text-steel">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (Conditional render if not null) */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-vector-red mb-4">
              Atención y Soporte
            </h3>
            <ul className="space-y-3 text-sm text-steel">
              {siteConfig.contact.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-vector-red" />
                  <span>{siteConfig.contact.phone}</span>
                </li>
              )}
              {siteConfig.contact.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-vector-red" />
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </li>
              )}
              {siteConfig.contact.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-vector-red shrink-0 mt-0.5" />
                  <span>{siteConfig.contact.address}</span>
                </li>
              )}
              {siteConfig.contact.workingHours && (
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-vector-red" />
                  <span>{siteConfig.contact.workingHours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Logistics & Security */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-vector-red mb-4">
              Garantía VECTOR
            </h3>
            <p className="text-sm text-steel leading-relaxed mb-4">
              Verificamos la compatibilidad exacta de cada número de parte antes del despacho para asegurar un ajuste perfecto.
            </p>
            <div className="inline-flex items-center px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-vector-red mr-2"></span>
              Distribución Nacional Activa
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-steel gap-4">
          <p>© {new Date().getFullYear()} VECTOR Refacciones. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#contacto" className="hover:text-white transition-colors">
              Aviso de privacidad
            </a>
            <a href="#contacto" className="hover:text-white transition-colors">
              Términos de servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
