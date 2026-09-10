import type { PortfolioItem } from '@/types'
import { SystemShowcase } from '@/components/sections/system-showcase'

interface PortfolioEntryProps {
  readonly item: PortfolioItem
  readonly headingLevel?: 'h2' | 'h3'
}

/** One system in the ledger. The showcase does the work. */
export function PortfolioEntry({ item, headingLevel = 'h3' }: PortfolioEntryProps) {
  return <SystemShowcase item={item} headingLevel={headingLevel} />
}
