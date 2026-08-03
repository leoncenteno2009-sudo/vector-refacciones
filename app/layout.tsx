import type { Metadata } from 'next'
import { siteConfig } from '@/config/site.config'
import './globals.css'

const baseUrl = 'https://leoncenteno2009-sudo.github.io/vector-refacciones/'
const assetBasePath = process.env.NODE_ENV === 'production' ? '/vector-refacciones' : ''

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
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.descriptor}`,
    description: siteConfig.metaDescription,
    url: baseUrl,
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
        <link
          rel="preload"
          href={`${assetBasePath}/videos/scroll/hero.mp4`}
          as="video"
          type="video/mp4"
        />
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
              url: baseUrl,
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
