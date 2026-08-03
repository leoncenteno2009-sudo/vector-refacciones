'use client'

import React from 'react'
import { categoriesContent } from '@/content/siteContent'
import { Cpu, Disc, Sliders, Cog, Zap, Thermometer, ArrowUpRight } from 'lucide-react'

const iconMap = {
  Cpu,
  Disc,
  Sliders,
  Cog,
  Zap,
  Thermometer,
}

export const Categories: React.FC = () => {
  return (
    <section id="categorias" className="ambient-section ambient-grid py-24 bg-[#303030] text-white border-t border-white/10" aria-labelledby="categories-heading">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
              Catálogo Especializado
            </span>
            <h2 id="categories-heading" className="section-h2 text-white mt-2">
              Categorías de refacciones
            </h2>
          </div>
          <p className="body-intro max-w-md text-gray-300">
            Componentes automotrices originales y de equipo original (OEM) probados bajo rigurosos estándares de durabilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesContent.map((cat) => {
            const IconComponent = iconMap[cat.icon as keyof typeof iconMap] || Cpu

            return (
              <a
                key={cat.id}
                href="#compatibilidad"
                className="group p-8 rounded-2xl bg-[#242424] border border-white/10 hover:border-vector-red/60 hover:bg-[#2A2A2A] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-[#1A1A1A] border border-white/10 text-white flex items-center justify-center group-hover:bg-vector-red group-hover:border-vector-red group-hover:shadow-[0_6px_20px_rgba(217,43,43,0.35)] transition-all duration-300">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-gray-300">
                      {cat.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-vector-red transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center text-sm font-semibold text-white group-hover:text-vector-red pt-4 border-t border-white/10 transition-colors duration-300">
                  <span>Explorar refacciones</span>
                  <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
