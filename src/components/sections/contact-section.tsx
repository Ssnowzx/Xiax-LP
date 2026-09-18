import { Mark } from '@/components/brand/mark'
import { Container } from '@/components/layout/container'
import { SectionHead } from '@/components/layout/section-head'
import { SweepDriver } from '@/components/motion/sweep-driver'
import { ContactForm } from '@/components/sections/contact-form'
import { sendContact } from '@/app/(site)/contato/actions'
import { env } from '@/lib/env'

interface ContactSectionProps {
  readonly headingLevel?: 'h1' | 'h2'
  /** On the sales page the section is the sixth sector and opens with its head. */
  readonly indexed?: boolean
}

/**
 * The last thing on the sales page and the whole of the contact page. The
 * card is paper on the dark page, so the form reads as a form.
 */
export function ContactSection({ headingLevel = 'h2', indexed = false }: ContactSectionProps) {
  const Heading = headingLevel

  return (
    <section id="contato" className="py-satellite lg:py-core" aria-labelledby="contato-titulo">
      <SweepDriver />
      <Container>
        {indexed ? <SectionHead id="contato" /> : null}
        <div className="grid gap-satellite lg:grid-cols-[1fr_2fr] lg:gap-x-core">
          <div>
            <Heading id="contato-titulo" className="sweep text-3xl lg:text-4xl">
              <span className="highlight">Conte a operação.</span>
            </Heading>
            <p className="sweep measure mt-clearance text-lede">
              <span className="highlight">Descreva o que trava hoje, do seu jeito. Se fizer sentido, marcamos uma visita.</span>
            </p>
          </div>
          <div className="contact-card band-ink">
            <p className="contact-card-head sweep">
              <Mark size={22} />
              <span className="data">
                <span className="highlight">mensagem para a Xiax</span>
              </span>
            </p>
            <ContactForm action={sendContact} {...(env.NEXT_PUBLIC_CONTACT_EMAIL ? { fallbackEmail: env.NEXT_PUBLIC_CONTACT_EMAIL } : {})} />
          </div>
        </div>
      </Container>
    </section>
  )
}
