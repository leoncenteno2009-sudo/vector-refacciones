'use client'

import React from 'react'
import { SkipToContent } from '@/components/ui/SkipToContent'
import { Header } from '@/components/layout/Header'
import { VectorScrollStory } from '@/components/scroll/VectorScrollStory'
import { Categories } from '@/components/sections/Categories'
import { CompatibilityFinder } from '@/components/sections/CompatibilityFinder'
import { Distribution } from '@/components/sections/Distribution'
import { Workshops } from '@/components/sections/Workshops'
import { AboutSection } from '@/components/sections/AboutSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { QuoteProcess } from '@/components/sections/QuoteProcess'
import { QuoteForm } from '@/components/sections/QuoteForm'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

export default function Home() {
  return (
    <>
      <SkipToContent />
      <Header />
      <main id="main-content" className="w-full">
        {/* Core 3D Scrollsequence Experience */}
        <VectorScrollStory />

        {/* Marketing & Conversion Sections */}
        <Categories />
        <CompatibilityFinder />
        <Distribution />
        <Workshops />
        <AboutSection />
        <ContactSection />
        <QuoteProcess />
        <QuoteForm />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
