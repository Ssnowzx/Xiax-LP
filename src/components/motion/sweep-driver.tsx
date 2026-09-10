'use client'

import { useEffect } from 'react'

/** Where in the viewport the sweep starts and how far it runs, as fractions of its height. */
const START = 0.9
const RUN = 0.45

/**
 * Drives `--sweep` on every `.sweep` block from the scroll position, for
 * browsers without scroll-driven animations. Where CSS can do it, this does
 * nothing. Reduced motion leaves the words fully covered.
 */
export function SweepDriver() {
  useEffect(() => {
    if (CSS.supports('animation-timeline: view()')) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('.sweep'))
    if (blocks.length === 0) return undefined
    let frame = 0

    const update = () => {
      frame = 0
      const height = window.innerHeight
      for (const block of blocks) {
        const top = block.getBoundingClientRect().top
        const progress = Math.min(1, Math.max(0, (height * START - top) / (height * RUN)))
        block.style.setProperty('--sweep', `${(progress * 100).toFixed(1)}%`)
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return null
}
