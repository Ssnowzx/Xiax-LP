'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/** The traveller's own size; every slot is expressed as a scale of it. */
const BASE_PX = 30
/** A slot becomes active as soon as it enters the lower fifth of the viewport,
    so the core arrives before the reader does. */
const FOCUS_LINE = 0.8
/** Time for the hero mark to finish being born before the swap. */
const HERO_SWAP_MS = 1400

interface Box {
  readonly x: number
  readonly y: number
  readonly w: number
  readonly h: number
}

function boxOf(element: Element): Box {
  const rect = element.getBoundingClientRect()
  return { x: rect.left + window.scrollX, y: rect.top + window.scrollY, w: rect.width, h: rect.height }
}

/**
 * One violet square for the whole page.
 *
 * It starts as the core of the hero mark, then travels down the page and
 * docks into each section's core slot as the reader reaches it. The brand
 * says the centre commands and the satellites execute; here the centre is
 * literally one element that moves. Without JavaScript, or with reduced
 * motion, every slot paints its own static core instead.
 */
export function TravelingCore() {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const root = document.documentElement
    root.classList.add('core-travels')

    let slots: Element[] = []
    let active = 0
    let visible = false
    let flying = false
    let frame = 0
    let placedAt: Box | null = null

    const collect = () => {
      slots = Array.from(document.querySelectorAll('[data-core-slot]'))
    }

    const pick = () => {
      const line = window.scrollY + window.innerHeight * FOCUS_LINE
      let index = 0
      slots.forEach((slot, position) => {
        if (boxOf(slot).y < line) index = position
      })
      return index
    }

    const place = (index: number, fly: boolean) => {
      const slot = slots[index]
      if (!slot) return
      const box = boxOf(slot)
      placedAt = box
      flying = fly
      node.classList.toggle('is-flying', fly)
      slots.forEach((candidate, position) => {
        if (position === index) candidate.setAttribute('data-core-active', '')
        else candidate.removeAttribute('data-core-active')
      })
      node.style.transform = `translate(${box.x}px, ${box.y}px) scale(${box.w / BASE_PX}, ${box.h / BASE_PX})`
    }

    const dock = () => {
      if (visible) return
      collect()
      if (slots.length === 0) return
      visible = true
      active = pick()
      place(active, false)
      node.classList.add('is-visible')
      document.getElementById('hero-mark')?.classList.add('is-docked')
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        dock()
        if (!visible) return
        const next = pick()
        if (next !== active) {
          active = next
          place(next, true)
          return
        }
        /* A slot inside a pinned stage moves with the page: follow it, in
           the flight it is already in, so the core never slides off it. */
        const slot = slots[active]
        if (!slot || !placedAt) return
        const box = boxOf(slot)
        if (box.x !== placedAt.x || box.y !== placedAt.y) place(active, flying)
      })
    }

    const onLayout = () => {
      collect()
      if (visible) place(Math.min(active, slots.length - 1), flying)
    }

    const onSettle = () => {
      flying = false
      node.classList.remove('is-flying')
    }

    const hasHero = document.getElementById('hero-mark') !== null
    let timer = 0
    const start = () => {
      timer = window.setTimeout(dock, hasHero ? HERO_SWAP_MS : 0)
    }
    // On a first visit the splash plays first; the hero mark waits for it.
    if (root.classList.contains('has-splash')) window.addEventListener('xiax:splash-done', start, { once: true })
    else start()
    const observer = new ResizeObserver(onLayout)
    observer.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onLayout)
    node.addEventListener('transitionend', onSettle)
    document.fonts.ready.then(onLayout).catch(() => undefined)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('xiax:splash-done', start)
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onLayout)
      node.removeEventListener('transitionend', onSettle)
      node.classList.remove('is-visible', 'is-flying')
      slots.forEach((slot) => slot.removeAttribute('data-core-active'))
      root.classList.remove('core-travels')
    }
  }, [pathname])

  return <div ref={ref} aria-hidden="true" className="core-traveler" />
}
