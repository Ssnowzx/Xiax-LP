import { Container } from '@/components/layout/container'
import { CtaRail } from '@/components/ui/cta-rail'
import { COMPANY } from '@/content/company'
import { CTAS } from '@/content/ctas'

/** Infrastructure as a position, not a footnote. */
export function Engine() {
  return (
    <section id="motor-secao" className="band-ink py-core lg:py-orbit" aria-labelledby="motor">
      <Container>
        <div className="grid gap-satellite lg:grid-cols-[2fr_3fr] lg:gap-x-core">
          <div>
            <span aria-hidden="true" data-core-slot="engine" className="core-slot mb-clearance block size-[30px]" />
            <h2 id="motor" className="reveal text-3xl lg:text-4xl">
              {COMPANY.lines.authority}
            </h2>
            <p className="measure mt-clearance text-lede text-on-muted">
              O sistema roda em máquina nossa, com dado no Brasil. Ninguém entre a sua operação e o motor dela.
            </p>
          </div>
          <dl className="grid gap-clearance">
            {COMPANY.engine.map((item) => (
              <div key={item.title} className="border-t border-hairline pt-clearance">
                <dt className="text-xl font-extrabold tracking-display">{item.title}</dt>
                <dd className="mt-3 text-on-muted">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <CtaRail cta={CTAS.engine} slot="engine-cta" />
      </Container>
    </section>
  )
}
