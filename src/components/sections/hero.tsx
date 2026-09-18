import { Mark } from '@/components/brand/mark'
import { Container } from '@/components/layout/container'
import { HeroField } from '@/components/motion/hero-field'
import { PageIndex } from '@/components/sections/page-index'
import { ButtonLink } from '@/components/ui/button'
import { COMPANY } from '@/content/company'

/**
 * The page's one orchestrated moment: the mark is born from the centre
 * outwards. Then its core leaves and travels the page. After that, motion
 * only answers the pointer. The index at the foot is the map of what follows.
 */
export function Hero() {
  const { headline, lede, primaryCta, secondaryCta } = COMPANY.hero

  return (
    <HeroField>
      <Container className="hero-stage grid gap-satellite py-satellite lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-y-clearance lg:py-clearance">
        <div className="order-2 lg:order-1">
          <h1 className="text-display">
            {headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="measure mt-clearance text-lede text-on-muted">{lede}</p>
          <div className="mt-satellite flex flex-wrap gap-margin">
            <ButtonLink href="/#contato" variant="primary">
              {primaryCta}
            </ButtonLink>
            <ButtonLink href="/portfolio">{secondaryCta}</ButtonLink>
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:justify-self-end">
          <Mark
            id="hero-mark"
            size={320}
            motion="emerge"
            blueprint
            coreSlot="hero"
            title="Símbolo da Xiax: quatro satélites em volta de um núcleo"
            className="h-auto w-40 md:w-56 lg:w-96"
          />
        </div>
        <div className="order-3 lg:col-span-2">
          <PageIndex />
        </div>
      </Container>
    </HeroField>
  )
}
