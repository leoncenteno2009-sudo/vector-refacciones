'use client'

import React, { useState, useEffect } from 'react'
import { siteConfig } from '@/config/site.config'
import { Button } from '@/components/ui/Button'
import { Menu, X, ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Manage mobile drawer focus & scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] h-[80px] flex items-center ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-carbon/10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
          : 'bg-white/30 backdrop-blur-xs border-b border-transparent'
      }`}
    >
      <div className="max-w-site w-full mx-auto px-5 md:px-8 lg:px-12 flex items-center justify-between">
        {/* Logo VECTOR */}
        <a
          href="#"
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-vector-red rounded-sm p-1 transition-transform duration-300 hover:scale-[1.01]"
          aria-label="VECTOR - Refacciones y distribución automotriz"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-carbon group-hover:text-vector-red transition-colors duration-300"
          >
            <path
              d="M6 8L20 34L34 8H26L20 20L14 8H6Z"
              fill="currentColor"
            />
            <path
              d="M20 25L24 16H29L20 32L11 16H16L20 25Z"
              fill="#D92B2B"
            />
          </svg>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-carbon leading-none">
              VECTOR
            </span>
            <span className="text-[10px] uppercase font-semibold text-text-secondary tracking-widest mt-0.5">
              Refacciones y Distribución
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navegación principal">
          {siteConfig.navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-carbon/90 hover:text-vector-red transition-all duration-300 py-2 focus-visible:ring-2 focus-visible:ring-vector-red rounded relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-vector-red transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {siteConfig.contact.whatsapp && (
            <a
              href={`${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                'Hola VECTOR, me gustaría consultar la disponibilidad y cotizar una refacción automotriz.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-[0_4px_14px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
              <span>WhatsApp</span>
            </a>
          )}

          <Button href={siteConfig.mainCTA.href} variant="primary">
            {siteConfig.mainCTA.label}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-carbon hover:bg-carbon/5 focus-visible:ring-2 focus-visible:ring-vector-red"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[80px] bg-white/95 backdrop-blur-xl z-40 lg:hidden flex flex-col px-6 py-8 border-t border-carbon/10 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Menú móvil"
        >
          <nav className="flex flex-col gap-6" aria-label="Navegación móvil">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold text-carbon hover:text-vector-red transition-colors py-2 border-b border-carbon/5"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 pt-6 border-t border-carbon/10 flex flex-col gap-4">
            {siteConfig.contact.whatsapp && (
              <a
                href={`${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                  'Hola VECTOR, me gustaría consultar la disponibilidad y cotizar una refacción automotriz.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#25D366] text-white font-bold text-base shadow-md"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                <span>Contactar por WhatsApp</span>
              </a>
            )}
            <Button
              href={siteConfig.mainCTA.href}
              variant="vectorRed"
              className="w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              {siteConfig.mainCTA.label}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
