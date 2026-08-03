export interface SiteConfig {
  name: string
  descriptor: string
  url: string
  ogImage: string
  metaDescription: string
  contact: {
    phone: string | null
    whatsapp: string | null
    email: string | null
    address: string | null
    workingHours: string | null
  }
  socials: {
    facebook: string | null
    instagram: string | null
    linkedin: string | null
    twitter: string | null
  }
  navigation: Array<{
    label: string
    href: string
  }>
  mainCTA: {
    label: string
    href: string
  }
}

export const siteConfig: SiteConfig = {
  name: 'VECTOR',
  descriptor: 'Refacciones y distribución automotriz',
  url: 'https://vector-refacciones.com',
  ogImage: '/images/og-vector.jpg',
  metaDescription:
    'Encuentra componentes automotrices compatibles para tu vehículo, taller o negocio. Inventario, distribución nacional y cotización ágil con VECTOR.',
  contact: {
    phone: '+52 1 55 2526 8475',
    whatsapp: 'https://wa.me/5215525268475',
    email: 'contacto@vector-refacciones.com',
    address: null,
    workingHours: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
  },
  socials: {
    facebook: null,
    instagram: null,
    linkedin: null,
    twitter: null,
  },
  navigation: [
    { label: 'Compatibilidad', href: '#compatibilidad' },
    { label: 'Categorías', href: '#categorias' },
    { label: 'Distribución', href: '#distribucion' },
    { label: 'Talleres', href: '#talleres' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ],
  mainCTA: {
    label: 'Solicitar cotización',
    href: '#cotizacion',
  },
}
