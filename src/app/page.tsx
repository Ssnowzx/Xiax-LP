import type { Metadata } from 'next'

import { ContactSection } from '@/components/sections/contact-section'
import { Engine } from '@/components/sections/engine'
import { Fronts } from '@/components/sections/fronts'
import { Hero } from '@/components/sections/hero'
import { Method } from '@/components/sections/method'
import { PortfolioFeature } from '@/components/sections/portfolio-feature'
import { Service } from '@/components/sections/service'
import { COMPANY } from '@/content/company'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: `${COMPANY.name} — ${COMPANY.lines.sales}`,
  description: COMPANY.description,
  path: '/',
})

export default function HomePage() {
  return (
    <>
      <Hero />
      <Service />
      <Method />
      <Fronts />
      <PortfolioFeature />
      <Engine />
      <ContactSection />
    </>
  )
}
