import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Header } from '@/components/layout/Header'
import { QuoteForm } from '@/components/sections/QuoteForm'
import { siteConfig } from '@/config/site.config'

describe('VECTOR Landing Page Component Suite', () => {
  it('renders Header brand name and spanish navigation links', () => {
    render(<Header />)

    expect(screen.getByText('VECTOR')).toBeInTheDocument()
    expect(screen.getByText('Refacciones y Distribución')).toBeInTheDocument()

    siteConfig.navigation.forEach((item) => {
      expect(screen.getAllByText(item.label)[0]).toBeInTheDocument()
    })
  })

  it('validates quote form inputs and displays spanish validation messages', async () => {
    render(<QuoteForm />)

    const submitBtn = screen.getByRole('button', { name: /Enviar solicitud de cotización/i })
    fireEvent.click(submitBtn)

    expect(await screen.findByText('Por favor ingresa tu nombre completo')).toBeInTheDocument()
    expect(await screen.findByText('Ingresa un teléfono o correo válido')).toBeInTheDocument()
    expect(await screen.findByText('Debes aceptar el aviso de privacidad')).toBeInTheDocument()
  })
})
