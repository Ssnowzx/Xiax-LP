import { Container } from '@/components/layout/container'
import { SectionHead } from '@/components/layout/section-head'
import { MethodSteps } from '@/components/sections/method-steps'
import { CtaRail } from '@/components/ui/cta-rail'
import { METHOD } from '@/content/method'
import { CTAS } from '@/content/ctas'

/** Four steps in order, on paper. Because it is a sequence, it is numbered. */
export function Method() {
  return (
    <section id="metodo" className="band-ink py-satellite lg:py-core" aria-labelledby="metodo-titulo">
      <Container>
        <SectionHead id="metodo" />
        <MethodSteps
          steps={METHOD}
          heading={
            <h2 id="metodo-titulo" className="reveal text-3xl lg:text-4xl">
              <span className="sweep inline-block">
                <span className="sweep-line">Como entramos</span>
              </span>
            </h2>
          }
        />
        <CtaRail cta={CTAS.method} slot="method-cta" />
      </Container>
    </section>
  )
}
