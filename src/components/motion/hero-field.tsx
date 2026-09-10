'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

function clamp(value: number): number {
  return Math.max(-1, Math.min(1, value))
}

/**
 * The hero's stage. The mark's construction lines show while the pointer is
 * over it, and the satellites lean toward the pointer once the load-in is
 * over. The page grid itself lives in `PageGrid`, under everything.
 */
export function HeroField({ children }: { readonly children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const field = ref.current
    if (!field) return undefined

    const mark = document.getElementById('hero-mark')
    const lastSatellite = mark?.querySelector('[data-piece="satellite"]:nth-of-type(4)')
    const finishEmergence = () => mark?.classList.remove('mark-emerge')
    lastSatellite?.addEventListener('animationend', finishEmergence, { once: true })

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) {
      return () => lastSatellite?.removeEventListener('animationend', finishEmergence)
    }

    const onMove = (event: PointerEvent) => {
      if (!mark) return
      const box = field.getBoundingClientRect()
      const m = mark.getBoundingClientRect()
      const px = clamp((event.clientX - (m.left + m.width / 2)) / (box.width / 2))
      const py = clamp((event.clientY - (m.top + m.height / 2)) / (box.height / 2))
      mark.style.setProperty('--px', px.toFixed(3))
      mark.style.setProperty('--py', py.toFixed(3))
    }
    const onEnter = () => field.classList.add('is-hot')
    const onLeave = () => {
      field.classList.remove('is-hot')
      mark?.style.setProperty('--px', '0')
      mark?.style.setProperty('--py', '0')
    }

    field.addEventListener('pointermove', onMove)
    field.addEventListener('pointerenter', onEnter)
    field.addEventListener('pointerleave', onLeave)

    return () => {
      lastSatellite?.removeEventListener('animationend', finishEmergence)
      field.removeEventListener('pointermove', onMove)
      field.removeEventListener('pointerenter', onEnter)
      field.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section ref={ref} className="hero-field">
      {children}
    </section>
  )
}
