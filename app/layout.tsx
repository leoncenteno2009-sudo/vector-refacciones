import type { Metadata } from 'next'
import { siteConfig } from '@/config/site.config'
import './globals.css'

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.descriptor}`,
  description: siteConfig.metaDescription,
  keywords: [
    'refacciones automotrices',
    'distribución de autopartes',
    'compatibilidad de autopartes',
    'piezas para talleres mecánicos',
    'frenos',
    'suspensión',
    'motor',
    'VECTOR refacciones',
  ],
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.descriptor}`,
    description: siteConfig.metaDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.descriptor}`,
    description: siteConfig.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-MX" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Schema.org AutoPartsStore */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AutoPartsStore',
              name: siteConfig.name,
              description: siteConfig.descriptor,
              url: siteConfig.url,
              telephone: siteConfig.contact.phone || undefined,
              email: siteConfig.contact.email || undefined,
              address: siteConfig.contact.address || undefined,
              priceRange: '$$',
            }),
          }}
        />
      </head>
      <body className="bg-ivory-100 text-carbon antialiased selection:bg-vector-red selection:text-white">
        {children}
      </body>
    </html>
  )
}
