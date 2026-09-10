import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { PortfolioEntry } from '@/components/sections/portfolio-entry'
import { CtaRail } from '@/components/ui/cta-rail'
import { PORTFOLIO } from '@/content/portfolio'
import { CTAS } from '@/content/ctas'

/** The systems on the home page. All of them, while the list is short. */
export function PortfolioFeature() {
  return (
    <section id="no-ar-secao" className="py-satellite lg:py-core" aria-labelledby="no-ar">
      <Container>
        <span aria-hidden="true" data-core-slot="portfolio" className="core-slot mb-clearance block size-[30px]" />
        <div className="flex flex-wrap items-end justify-between gap-margin">
          <h2 id="no-ar" className="reveal text-3xl lg:text-4xl">
            O que está no ar
          </h2>
          <Link href="/portfolio" className="text-sm underline">
            Todos os sistemas
          </Link>
        </div>
        <div className="mt-satellite">
          {PORTFOLIO.map((item) => (
            <PortfolioEntry key={item.slug} item={item} headingLevel="h3" />
          ))}
        </div>
        <CtaRail cta={CTAS.portfolio} slot="portfolio-cta" />
      </Container>
    </section>
  )
}
