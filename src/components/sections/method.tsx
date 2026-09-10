import { Container } from '@/components/layout/container'
import { MethodSteps } from '@/components/sections/method-steps'
import { CtaRail } from '@/components/ui/cta-rail'
import { METHOD } from '@/content/method'
import { CTAS } from '@/content/ctas'

/** Four steps in order. Because it is a sequence, it is numbered. */
export function Method() {
  return (
    <section
      id="metodo"
      className="scroll-mt-satellite py-satellite lg:py-core"
      aria-labelledby="metodo-titulo"
    >
      <Container>
        <MethodSteps
          steps={METHOD}
          heading={
            <h2 id="metodo-titulo" className="reveal text-3xl lg:text-4xl">
              Como entramos
            </h2>
          }
        />
        <CtaRail cta={CTAS.method} slot="method-cta" />
      </Container>
    </section>
  )
}
