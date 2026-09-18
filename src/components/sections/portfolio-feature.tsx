import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { SectionHead } from '@/components/layout/section-head'
import { PortfolioEntry } from '@/components/sections/portfolio-entry'
import { CtaRail } from '@/components/ui/cta-rail'
import { PORTFOLIO } from '@/content/portfolio'
import { CTAS } from '@/content/ctas'

/** The systems on the home page, on paper, where their screens read as screens. All of them, while the list is short. */
export function PortfolioFeature() {
  return (
    <section id="no-ar" className="band-ink py-satellite lg:py-core" aria-labelledby="no-ar-titulo">
      <Container>
        <SectionHead id="no-ar" />
        <span aria-hidden="true" data-core-slot="portfolio" className="core-slot mb-clearance block size-[30px]" />
        <div className="flex flex-wrap items-end justify-between gap-margin">
          <h2 id="no-ar-titulo" className="reveal text-3xl lg:text-4xl">
            <span className="sweep inline-block">
              <span className="sweep-line">O que está no ar</span>
            </span>
          </h2>
          <Link href="/portfolio" className="link-accent inline-block py-1 text-sm">
            Todos os sistemas
          </Link>
        </div>
        <div className="mt-satellite">
          {PORTFOLIO.map((item, index) => (
            <PortfolioEntry key={item.slug} item={item} headingLevel="h3" position={index + 1} count={PORTFOLIO.length} />
          ))}
        </div>
        <CtaRail cta={CTAS.portfolio} slot="portfolio-cta" />
      </Container>
    </section>
  )
}
