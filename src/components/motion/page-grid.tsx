'use client'

import { useEffect, useRef } from 'react'

/** One satellite (22u) at the desktop mark size of 320px. */
const GRID_CELL = 70.4

/**
 * The mark's engineering grid under the whole page, shown around the
 * pointer from the hero to the footer. Fixed to the viewport, behind the
 * content. Touch screens and reduced motion never see it.
 */
export function PageGrid() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const layer = ref.current
    if (!layer) return undefined
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return undefined

    const onMove = (event: PointerEvent) => {
      layer.style.setProperty('--mx', `${event.clientX}px`)
      layer.style.setProperty('--my', `${event.clientY}px`)
      layer.classList.add('is-hot')
    }
    const onLeave = () => layer.classList.remove('is-hot')
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <svg ref={ref} aria-hidden="true" className="page-grid">
      <defs>
        <pattern id="page-grid-unit" width={GRID_CELL} height={GRID_CELL} patternUnits="userSpaceOnUse">
          <path d={`M${GRID_CELL} 0H0V${GRID_CELL}`} fill="none" stroke="var(--on-muted)" strokeWidth={1} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#page-grid-unit)" />
    </svg>
  )
}
