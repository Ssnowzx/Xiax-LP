import { ButtonLink } from '@/components/ui/button'
import type { Cta } from '@/content/ctas'

interface CtaRailProps {
  readonly cta: Cta
  /** Docking-slot name; the core paints this button when the reader gets here. */
  readonly slot: string
}

/** A section's last line: one sentence and the action it leads to. */
export function CtaRail({ cta, slot }: CtaRailProps) {
  return (
    <div className="cta-rail">
      <p className="cta-rail-lede">{cta.lede}</p>
      <ButtonLink href="/#contato" variant="primary" coreSlot={slot}>
        {cta.action}
      </ButtonLink>
    </div>
  )
}
