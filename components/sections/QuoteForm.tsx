'use client'

import React, { useState } from 'react'
import { z } from 'zod'
import { siteConfig } from '@/config/site.config'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, MessageSquare, Mail, Copy, Check } from 'lucide-react'
import { trackEvent } from '@/lib/analytics/events'

const quoteSchema = z.object({
  name: z.string().min(2, 'Por favor ingresa tu nombre completo'),
  contact: z.string().min(5, 'Ingresa un teléfono o correo válido'),
  clientType: z.enum(['Particular', 'Taller mecánico', 'Refaccionaria / Negocio']),
  make: z.string().min(1, 'Selecciona la marca de tu vehículo'),
  model: z.string().min(1, 'Ingresa el modelo de tu vehículo'),
  year: z.string().min(1, 'Ingresa el año de tu vehículo'),
  part: z.string().min(3, 'Especifica la refacción o falla que requieres'),
  message: z.string().optional(),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar el aviso de privacidad' }),
  }),
  honeypot: z.string().max(0), // Anti-spam bot trap
})

export type QuoteFormData = z.infer<typeof quoteSchema>

export const QuoteForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    clientType: 'Particular',
    make: '',
    model: '',
    year: '',
    part: '',
    message: '',
    privacyConsent: false,
    honeypot: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [copied, setCopied] = useState(false)
  const [summaryText, setSummaryText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    trackEvent('quote_start')

    const result = quoteSchema.safeParse(formData)

    if (!result.success) {
      const formattedErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message
        }
      })
      setErrors(formattedErrors)
      trackEvent('quote_submit_error', { errorMessage: 'Validation failed' })
      return
    }

    // Process valid data safely without server API
    const data = result.data
    const formattedMessage =
      `Hola VECTOR, solicito cotización de refacciones:\n\n` +
      `• *Tipo de cliente:* ${data.clientType}\n` +
      `• *Nombre:* ${data.name}\n` +
      `• *Contacto:* ${data.contact}\n` +
      `• *Vehículo:* ${data.make} ${data.model} (${data.year})\n` +
      `• *Refacción:* ${data.part}\n` +
      (data.message ? `• *Notas:* ${data.message}\n` : '')

    setSummaryText(formattedMessage)
    setStatus('success')
    trackEvent('quote_submit_success')

    // Direct channel redirect
    if (siteConfig.contact.whatsapp) {
      const waUrl = `${siteConfig.contact.whatsapp}?text=${encodeURIComponent(formattedMessage)}`
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank')
      }
    } else if (siteConfig.contact.email) {
      const mailtoUrl = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
        `Cotización VECTOR - ${data.make} ${data.model}`
      )}&body=${encodeURIComponent(formattedMessage)}`
      if (typeof window !== 'undefined') {
        window.location.href = mailtoUrl
      }
    }
  }

  const handleCopySummary = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <section id="cotizacion" className="ambient-section ambient-orbits py-24 bg-[#303030] text-white border-t border-white/10" aria-labelledby="quote-heading">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto bg-[#242424] p-8 md:p-12 rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.4)] border border-white/10">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
              Cotización Sin Compromiso
            </span>
            <h2 id="quote-heading" className="section-h2 text-white mt-2">
              Solicitar cotización técnica
            </h2>
            <p className="body-intro mt-3 text-gray-300">
              Completa los datos de tu unidad y te enviaremos opciones disponibles en inventario con su confirmación de compatibilidad.
            </p>
          </div>

          {status === 'success' ? (
            <div className="p-8 rounded-2xl bg-vector-red/10 border-2 border-vector-red text-center animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-vector-red mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud de cotización preparada!</h3>
              <p className="text-sm text-gray-300 max-w-md mx-auto mb-6">
                Tu información se ha validado correctamente. Puedes compartir el resumen directamente con un asesor de VECTOR o copiarlo a tu portapapeles.
              </p>

              {/* Action Channels */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                {siteConfig.contact.whatsapp && (
                  <a
                    href={`${siteConfig.contact.whatsapp}?text=${encodeURIComponent(summaryText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg bg-[#25D366] text-white font-bold hover:brightness-105 transition-all shadow-md"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Enviar por WhatsApp
                  </a>
                )}

                {siteConfig.contact.email && (
                  <a
                    href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
                      'Cotización VECTOR'
                    )}&body=${encodeURIComponent(summaryText)}`}
                    className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg bg-carbon text-white font-bold hover:bg-black transition-all shadow-md"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar por Correo
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg bg-[#1A1A1A] text-white font-semibold hover:bg-[#2A2A2A] transition-all border border-white/10"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-vector-red" />
                      Copiado al portapapeles
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar resumen
                    </>
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Button onClick={() => setStatus('idle')} variant="secondary" className="text-sm">
                  Solicitar otra cotización
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Anti-spam Honeypot */}
              <input
                type="text"
                name="website_url"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="name-input" className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                    Nombre completo *
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className="w-full h-12 px-4 rounded-lg border border-white/20 bg-[#1A1A1A] text-white font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none placeholder:text-gray-500"
                    placeholder="Ej. Roberto Gómez"
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs font-semibold text-vector-red mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Contacto */}
                <div>
                  <label htmlFor="contact-input" className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                    Teléfono o Correo *
                  </label>
                  <input
                    id="contact-input"
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    aria-describedby={errors.contact ? 'contact-error' : undefined}
                    className="w-full h-12 px-4 rounded-lg border border-white/20 bg-[#1A1A1A] text-white font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none placeholder:text-gray-500"
                    placeholder="55 1234 5678 o correo@ejemplo.com"
                  />
                  {errors.contact && (
                    <p id="contact-error" className="text-xs font-semibold text-vector-red mt-1">
                      {errors.contact}
                    </p>
                  )}
                </div>
              </div>

              {/* Tipo de Cliente */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Tipo de cliente *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Particular', 'Taller mecánico', 'Refaccionaria / Negocio'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, clientType: type })}
                      className={`h-12 px-4 rounded-lg border text-xs font-bold transition-all duration-300 ${
                        formData.clientType === type
                          ? 'border-vector-red bg-vector-red/20 text-vector-red ring-2 ring-vector-red/40 shadow-sm'
                          : 'border-white/20 bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] hover:border-white/40'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="form-make" className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                    Marca *
                  </label>
                  <input
                    id="form-make"
                    type="text"
                    required
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="Ej. Nissan"
                    className="w-full h-11 px-3 rounded-lg border border-white/20 bg-[#1A1A1A] text-white text-sm font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none placeholder:text-gray-500"
                  />
                  {errors.make && <p className="text-xs text-vector-red mt-0.5">{errors.make}</p>}
                </div>

                <div>
                  <label htmlFor="form-model" className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                    Modelo *
                  </label>
                  <input
                    id="form-model"
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Ej. Versa"
                    className="w-full h-11 px-3 rounded-lg border border-white/20 bg-[#1A1A1A] text-white text-sm font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none placeholder:text-gray-500"
                  />
                  {errors.model && <p className="text-xs text-vector-red mt-0.5">{errors.model}</p>}
                </div>

                <div>
                  <label htmlFor="form-year" className="block text-xs font-bold uppercase tracking-wider text-white mb-1">
                    Año *
                  </label>
                  <input
                    id="form-year"
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="Ej. 2021"
                    className="w-full h-11 px-3 rounded-lg border border-white/20 bg-[#1A1A1A] text-white text-sm font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none placeholder:text-gray-500"
                  />
                  {errors.year && <p className="text-xs text-vector-red mt-0.5">{errors.year}</p>}
                </div>
              </div>

              {/* Refacción Solicitada */}
              <div>
                <label htmlFor="part-request" className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Refacción o síntoma que requieres *
                </label>
                <input
                  id="part-request"
                  type="text"
                  required
                  value={formData.part}
                  onChange={(e) => setFormData({ ...formData, part: e.target.value })}
                  placeholder="Ej. Amortiguadores delanteros, Kit de embrague, etc."
                  className="w-full h-12 px-4 rounded-lg border border-white/20 bg-[#1A1A1A] text-white font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none placeholder:text-gray-500"
                />
                {errors.part && <p className="text-xs text-vector-red mt-1">{errors.part}</p>}
              </div>

              {/* Mensaje Opcional */}
              <div>
                <label htmlFor="form-message" className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Detalles adicionales (Opcional)
                </label>
                <textarea
                  id="form-message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Número de serie (VIN), versión específica o comentarios extra."
                  className="w-full p-4 rounded-lg border border-white/20 bg-[#1A1A1A] text-white font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none placeholder:text-gray-500"
                />
              </div>

              {/* Privacy Consent */}
              <div className="flex items-start gap-3">
                <input
                  id="privacy-consent"
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                  className="w-5 h-5 mt-0.5 accent-vector-red rounded focus:ring-2 focus:ring-vector-red cursor-pointer"
                />
                <label htmlFor="privacy-consent" className="text-xs text-gray-300 leading-relaxed cursor-pointer">
                  Acepto el aviso de privacidad y autorizo el contacto para dar seguimiento a la cotización de mis refacciones automotrices.
                </label>
              </div>
              {errors.privacyConsent && (
                <p className="text-xs text-vector-red font-semibold">{errors.privacyConsent}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="vectorRed"
                className="w-full text-center py-4 text-lg"
              >
                Enviar solicitud de cotización
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
