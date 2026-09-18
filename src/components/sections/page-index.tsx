'use client'

import type { PointerEvent } from 'react'
import { useId, useRef } from 'react'

import { PointerGrid } from '@/components/motion/pointer-grid'
import { hasFinePointer, leanToward, resetLean } from '@/components/motion/pointer-lean'
import { PAGE_SECTIONS, sectionNumber } from '@/content/sections'

/**
 * The six sectors at the foot of the hero, each a cell of a ruled grid with
 * its number in violet, its name and one sentence on what is there: the map
 * before the walk. A cell leans toward the pointer and shows the grid under
 * it, like the satellites of the hero.
 */
export function PageIndex() {
  const id = useId()
  const fineRef = useRef<boolean | null>(null)

  const fine = () => {
    if (fineRef.current === null) fineRef.current = hasFinePointer()
    return fineRef.current
  }

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!fine()) return
    const cell = event.currentTarget
    leanToward({ lean: cell, surface: cell }, event.clientX, event.clientY)
  }

  const onPointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    const cell = event.currentTarget
    resetLean({ lean: cell, surface: cell })
  }

  return (
    <nav aria-label="Nesta página" className="page-index">
      <p className="data">nesta página</p>
      <ol className="page-index-list">
        {PAGE_SECTIONS.map((section, position) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className="page-index-item lean" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
              <PointerGrid id={`${id}-grid-${position}`} />
              <span className="page-index-number">{sectionNumber(position)}</span>
              <span className="page-index-name">{section.name}</span>
              <span className="page-index-brief">{section.brief}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
