'use client'

import React, { useState } from 'react'
import { sampleVehicleData } from '@/content/siteContent'
import { Button } from '@/components/ui/Button'
import { Search, CheckCircle, ShieldCheck } from 'lucide-react'

export const CompatibilityFinder: React.FC = () => {
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [partName, setPartName] = useState('')
  const [searched, setSearched] = useState(false)

  const availableModels = make
    ? sampleVehicleData.models[make as keyof typeof sampleVehicleData.models] || []
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearched(true)
  }

  return (
    <section id="compatibilidad" className="ambient-section ambient-orbits py-24 bg-[#303030] text-white border-t border-white/10" aria-labelledby="finder-heading">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
            Verificación de Ajuste Preciso
          </span>
          <h2 id="finder-heading" className="section-h2 text-white mt-2">
            Buscador de compatibilidad automotriz
          </h2>
          <p className="body-intro mt-4 text-gray-300">
            Ingresa las especificaciones de tu vehículo para verificar disponibilidad e iniciar tu cotización con respaldo técnico.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-[#242424] p-8 md:p-10 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.4)] border border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Make Select */}
          <div className="flex flex-col gap-2">
            <label htmlFor="make-select" className="text-xs font-bold uppercase tracking-wider text-white">
              1. Marca del vehículo *
            </label>
            <select
              id="make-select"
              value={make}
              onChange={(e) => {
                setMake(e.target.value)
                setModel('')
              }}
              required
              className="w-full h-12 px-4 rounded-lg border border-white/20 bg-[#1A1A1A] text-white font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none"
            >
              <option value="" className="bg-[#1A1A1A] text-white">Selecciona marca</option>
              {sampleVehicleData.makes.map((m) => (
                <option key={m} value={m} className="bg-[#1A1A1A] text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Model Select */}
          <div className="flex flex-col gap-2">
            <label htmlFor="model-select" className="text-xs font-bold uppercase tracking-wider text-white">
              2. Modelo *
            </label>
            <select
              id="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!make}
              required
              className="w-full h-12 px-4 rounded-lg border border-white/20 bg-[#1A1A1A] text-white font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none disabled:opacity-50"
            >
              <option value="" className="bg-[#1A1A1A] text-white">
                {make ? 'Selecciona modelo' : 'Primero elige marca'}
              </option>
              {availableModels.map((m) => (
                <option key={m} value={m} className="bg-[#1A1A1A] text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year Select */}
          <div className="flex flex-col gap-2">
            <label htmlFor="year-select" className="text-xs font-bold uppercase tracking-wider text-white">
              3. Año *
            </label>
            <select
              id="year-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-lg border border-white/20 bg-[#1A1A1A] text-white font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none"
            >
              <option value="" className="bg-[#1A1A1A] text-white">Selecciona año</option>
              {sampleVehicleData.years.map((y) => (
                <option key={y} value={y} className="bg-[#1A1A1A] text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Part Name / Search */}
          <div className="flex flex-col gap-2">
            <label htmlFor="part-input" className="text-xs font-bold uppercase tracking-wider text-white">
              4. Refacción o componente
            </label>
            <input
              id="part-input"
              type="text"
              placeholder="Ej. Balatas delanteras, Amortiguador"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-white/20 bg-[#1A1A1A] text-white font-medium focus:border-vector-red focus:ring-2 focus:ring-vector-red/30 transition-all duration-300 outline-none placeholder:text-gray-500"
            />
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <ShieldCheck className="w-5 h-5 text-vector-red shrink-0" />
              <span>Validación directa con catálogo de equipo original (OEM).</span>
            </div>

            <Button type="submit" variant="vectorRed" className="w-full sm:w-auto px-8">
              <Search className="w-4 h-4 mr-2" />
              Consultar compatibilidad
            </Button>
          </div>
        </form>

        {/* Real search result feedback banner */}
        {searched && (
          <div className="mt-8 p-6 rounded-xl bg-[#242424] border-2 border-vector-red/50 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fadeIn">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-vector-red shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-white">
                  Solicitud lista para validación: {make} {model} ({year})
                </h4>
                <p className="text-sm text-gray-300 mt-1">
                  Revisaremos la compatibilidad técnica antes de confirmar la pieza exacta en inventario.
                </p>
              </div>
            </div>
            <Button href="#cotizacion" variant="primary" className="whitespace-nowrap">
              Continuar a cotización
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
