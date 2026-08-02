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
    <section id="categorias" className="py-24 bg-white border-t border-carbon/10" aria-labelledby="categories-heading">
      <div className="max-w-site mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-vector-red">
              Catálogo Especializado
            </span>
            <h2 id="categories-heading" className="section-h2 text-carbon mt-2">
              Categorías de refacciones
            </h2>
          </div>
          <p className="body-intro max-w-md">
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
                className="group p-8 rounded-2xl bg-ivory-100/60 border border-carbon/10 hover:border-vector-red hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-carbon text-white flex items-center justify-center group-hover:bg-vector-red transition-colors">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-carbon/5 text-text-secondary">
                      {cat.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-carbon mb-3 group-hover:text-vector-red transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center text-sm font-semibold text-carbon group-hover:text-vector-red pt-4 border-t border-carbon/5">
                  <span>Explorar refacciones</span>
                  <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
