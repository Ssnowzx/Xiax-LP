import type { PageSectionId } from '@/types'
import { findSection, sectionNumber } from '@/content/sections'

interface SectionHeadProps {
  readonly id: PageSectionId
}

/**
 * The opening line of a sector: a rule, the number, the name and one
 * sentence on what is inside. Every sector opens the same way, so the page
 * reads as parts with a beginning, not as one long scroll.
 */
export function SectionHead({ id }: SectionHeadProps) {
  const found = findSection(id)
  if (!found) return null
  const { section, position } = found

  return (
    <div className="section-head">
      <p className="section-index">
        <span className="data">{sectionNumber(position)}</span>
        <span>{section.name}</span>
      </p>
      <p className="section-brief">{section.brief}</p>
    </div>
  )
}
