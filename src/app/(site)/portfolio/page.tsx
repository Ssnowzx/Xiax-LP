import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { PortfolioEntry } from '@/components/sections/portfolio-entry'
import { ButtonLink } from '@/components/ui/button'
import { PORTFOLIO } from '@/content/portfolio'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'O que está no ar',
  description: 'Sistemas que a Xiax construiu e mantém em produção, com o que está dentro de cada um.',
  path: '/portfolio',
})

export default function PortfolioPage() {
  return (
    <Container className="py-satellite lg:py-core">
      <h1 className="text-3xl lg:text-display">O que está no ar</h1>
      <p className="measure mt-clearance text-lede text-on-muted">
        Um sistema entra nesta lista quando existe, com o estado real dele. Piloto e protótipo
        não entram.
      </p>
      <div className="mt-satellite">
        {PORTFOLIO.map((item) => (
          <PortfolioEntry key={item.slug} item={item} headingLevel="h2" />
        ))}
      </div>
      <div className="mt-satellite border-t border-hairline pt-satellite">
        <p className="measure text-lede">Tem uma operação que precisa de um sistema desses?</p>
        <ButtonLink href="/contato" variant="primary" className="mt-clearance">
          Contar a minha operação
        </ButtonLink>
      </div>
    </Container>
  )
}
