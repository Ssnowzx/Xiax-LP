'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { PageSectionId } from '@/types'
import { PAGE_SECTIONS, sectionNumber } from '@/content/sections'

/** A sector is the current one once its top has passed this share of the viewport. */
const FOCUS_LINE = 0.4

function currentSection(): PageSectionId | null {
  const line = window.innerHeight * FOCUS_LINE
  let found: PageSectionId | null = null
  for (const section of PAGE_SECTIONS) {
    const node = document.getElementById(section.id)
    if (node && node.getBoundingClientRect().top <= line) found = section.id
  }
  return found
}

/**
 * Where the reader is. Six cells in the header, one per numbered sector of
 * the sales page: the cell of the sector on screen is filled, the ones
 * already read are dimmed, and the name beside them says it in words. Each
 * cell is a link to its sector. Only the sales page has sectors.
 */
export function SectionCompass() {
  const pathname = usePathname()
  const [current, setCurrent] = useState<PageSectionId | null>(null)

  useEffect(() => {
    if (pathname !== '/') return undefined
    let frame = 0
    const pick = () => {
      frame = 0
      setCurrent(currentSection())
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(pick)
    }
    pick()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [pathname])

  if (pathname !== '/') return null
  const index = PAGE_SECTIONS.findIndex((section) => section.id === current)
  const active = PAGE_SECTIONS[index]

  return (
    <nav aria-label="Partes desta página" className="compass">
      <ol className="compass-track">
        {PAGE_SECTIONS.map((section, position) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="compass-cell"
              aria-current={section.id === current ? 'location' : undefined}
              data-read={position < index}
            >
              <span className="sr-only">
                {sectionNumber(position)} {section.name}
              </span>
            </a>
          </li>
        ))}
      </ol>
      <p className="compass-label" aria-hidden="true">
        {active ? (
          <>
            <span className="data">{sectionNumber(index)}</span>
            <span>{active.name}</span>
          </>
        ) : null}
      </p>
    </nav>
  )
}
