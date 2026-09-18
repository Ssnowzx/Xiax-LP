import { Container } from '@/components/layout/container'
import { SectionHead } from '@/components/layout/section-head'
import { ComparisonStage } from '@/components/sections/comparison-stage'
import { CtaRail } from '@/components/ui/cta-rail'
import { OperationAssembly } from '@/components/motion/operation-assembly'
import { COMPANY } from '@/content/company'
import { COMPARISON } from '@/content/comparison'
import { CTAS } from '@/content/ctas'

/**
 * What the service is, in plain words: the title and the operation before
 * and after are the section's opening screen; the comparison of what changes
 * in the way of working plays over it, one pair at a time, and then stands
 * whole as a table.
 */
export function Service() {
  const { title, lede, columns, table } = COMPANY.service

  return (
    <section id="servico" className="py-satellite lg:py-core" aria-labelledby="servico-titulo">
      <Container>
        <SectionHead id="servico" />
        <ComparisonStage rows={COMPARISON} columns={columns} table={table}>
          <div className="grid gap-satellite lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-x-core">
            <div>
              <h2 id="servico-titulo" className="reveal text-3xl lg:text-4xl">
                {title}
              </h2>
              <p className="measure mt-clearance text-lede text-on-muted">{lede}</p>
            </div>
            <div className="lg:justify-self-end">
              <OperationAssembly />
            </div>
          </div>
        </ComparisonStage>
        <CtaRail cta={CTAS.service} slot="service-cta" />
      </Container>
    </section>
  )
}
