'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

/** One full cycle of the orbit loader, then the page. */
const CYCLE_MS = 1600
const LEAVE_MS = 640
const STORAGE_KEY = 'xiax-seen'

/**
 * First visit in a session: the brand's orbit loader on black, one cycle,
 * then the page slides in from under it. `html.has-splash` is set before
 * paint by the theme script, so nothing flashes; it also delays the hero
 * mark's birth until the splash is gone.
 */
export function Splash() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const node = ref.current
    if (!node || !root.classList.contains('has-splash')) return undefined

    const finish = () => {
      root.classList.remove('has-splash')
      window.dispatchEvent(new Event('xiax:splash-done'))
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // Storage may be unavailable; the splash simply plays again next time.
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return undefined
    }

    // Timed from navigation start, so the page's own load-in stays in step.
    const elapsed = performance.now()
    const leave = window.setTimeout(() => node.classList.add('is-leaving'), Math.max(0, CYCLE_MS - elapsed))
    const done = window.setTimeout(finish, Math.max(0, CYCLE_MS + LEAVE_MS - elapsed))
    return () => {
      window.clearTimeout(leave)
      window.clearTimeout(done)
    }
  }, [])

  return (
    <div ref={ref} className="splash" aria-hidden="true">
      <Image src="/brand/xiax-loader-fundo-preto.gif" alt="" width={120} height={120} unoptimized priority />
    </div>
  )
}
