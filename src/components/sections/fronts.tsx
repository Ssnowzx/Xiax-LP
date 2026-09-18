import { Container } from '@/components/layout/container'
import { SectionHead } from '@/components/layout/section-head'
import { FrontsStage } from '@/components/sections/fronts-stage'

/** The four fronts around the core, born one at a time. */
export function Fronts() {
  return (
    <section id="frentes" className="fronts-section py-satellite lg:py-core" aria-labelledby="frentes-titulo">
      <Container>
        <SectionHead id="frentes" />
        <h2 id="frentes-titulo" className="sr-only">
          Quatro frentes, um núcleo
        </h2>
        <FrontsStage />
      </Container>
    </section>
  )
}
