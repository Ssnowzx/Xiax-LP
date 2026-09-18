import type { PortfolioItem } from '@/types'
import { SystemShowcase } from '@/components/sections/system-showcase'

interface PortfolioEntryProps {
  readonly item: PortfolioItem
  readonly headingLevel?: 'h2' | 'h3'
  /** Position in the list and how many there are, when the list is shown whole. */
  readonly position?: number | undefined
  readonly count?: number | undefined
}

/** One system in the ledger. The showcase does the work. */
export function PortfolioEntry({ item, headingLevel = 'h3', position, count }: PortfolioEntryProps) {
  return <SystemShowcase item={item} headingLevel={headingLevel} position={position} count={count} />
}
