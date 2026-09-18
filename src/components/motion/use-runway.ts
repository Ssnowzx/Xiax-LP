'use client'

import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

/** A stop counts as reached once its top has passed this share of the viewport. */
const STOP_LINE = 0.3
/** Where a pinned stage sits under the header. Mirrors the `top` of the sticky stages. */
const STICKY_TOP_REM = 6
/** Silence longer than this between wheel events means a new gesture. */
const GESTURE_GAP_MS = 250
/** After a move, no new gesture is accepted for this long: the ramp of the same swipe is not a new one. */
const GESTURE_COOLDOWN_MS = 520
/** Momentum only decays; this many consecutive rises in strength mean a new finger on the pad. */
const GESTURE_RISES = 2
/** A rise smaller than this share of the last delta, plus a floor, is jitter, not a finger. */
const GESTURE_RISE_SHARE = 0.25
const GESTURE_RISE_MIN = 2
/** Within this many pixels of a stop the page counts as resting on it. */
const REST_TOLERANCE_PX = 4
/** How far above the stop line the first stop is kept when stepping back to the intro. */
const INTRO_CLEARANCE_PX = 2

/**
 * Every runway on the page shares the one snap switch of the document: the
 * page snaps hard while any stage has a step open, and not otherwise. Each
 * hook instance registers its wish here instead of writing the style itself.
 */
const wantingSnap = new Set<symbol>()

function applySnap(): void {
  document.documentElement.style.scrollSnapType = wantingSnap.size > 0 ? 'y mandatory' : ''
}

function rootFontSize(): number {
  return Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
}

function documentTop(element: Element): number {
  return element.getBoundingClientRect().top + window.scrollY
}

/** -1 before the first stop, the stop's index on it, the count past the outro. */
function stepFromStops(stops: readonly HTMLElement[], outro: HTMLElement, count: number): number {
  const line = window.innerHeight * STOP_LINE
  if (outro.getBoundingClientRect().top <= line) return count
  let step = -1
  stops.forEach((stop, index) => {
    if (stop.getBoundingClientRect().top <= line) step = index
  })
  return step
}

interface RunwayOptions {
  /**
   * Let the page go free from the last stop instead of holding one more
   * gesture for the outro. The gesture that brings the last step still ends
   * on it, so the step lands with the stage still; the next fresh gesture
   * scrolls on natively, and an upward gesture from past the stop returns
   * to it first. For a stage whose last step completes the picture.
   */
  readonly releaseAtLast?: boolean
}

/** How a gesture is treated on the last stop of a releasing runway; null means the usual lock. */
type ReleaseMode = 'free' | 'hold' | 'return' | null

/**
 * A runway of scroll stops under a pinned stage, one stop per step. Returns
 * the current step. While a step is open the page snaps hard to the stops
 * and a wheel or key gesture moves exactly one stop, the next or the
 * previous, with the rest of the same gesture swallowed: the founder's lock.
 * Momentum the browser will not let us cancel is caught by the mandatory
 * snap. Before the first stop, past the outro and when inactive, the page
 * scrolls freely; the step back from the outro is locked only while the
 * outro is still on screen.
 */
export function useRunway(
  wrapRef: RefObject<HTMLElement | null>,
  runwayRef: RefObject<HTMLElement | null>,
  count: number,
  active: boolean,
  { releaseAtLast = false }: RunwayOptions = {},
): number {
  const [step, setStep] = useState(count)
  const stepRef = useRef(count)

  useEffect(() => {
    const wrap = wrapRef.current
    const runway = runwayRef.current
    if (!active || !wrap || !runway) {
      stepRef.current = count
      setStep(count)
      return undefined
    }
    const stops = Array.from(runway.querySelectorAll<HTMLElement>('[data-stop]'))
    const intro = runway.querySelector<HTMLElement>('.runway-intro')
    const outro = runway.querySelector<HTMLElement>('.runway-outro')
    if (!intro || !outro) return undefined
    const last = count - 1
    const lastStop = releaseAtLast ? stops[last] : undefined
    const token = Symbol('runway')
    /* True once a fresh gesture has left the last stop of a releasing
       runway: the page is free until it comes back to that stop. */
    let released = false

    const syncSnap = () => {
      const current = stepRef.current
      if (current >= 0 && current < count && !(released && current === last)) wantingSnap.add(token)
      else wantingSnap.delete(token)
      applySnap()
    }
    let frame = 0
    const pick = () => {
      frame = 0
      const next = stepFromStops(stops, outro, count)
      if (next !== last) released = false
      stepRef.current = next
      setStep(next)
      syncSnap()
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(pick)
    }

    const topPx = () => STICKY_TOP_REM * rootFontSize()
    const locked = (direction: 1 | -1) => {
      if (wrap.getBoundingClientRect().top > topPx()) return false
      const current = stepRef.current
      if (current >= count) {
        const rect = outro.getBoundingClientRect()
        return direction === -1 && rect.bottom > 0 && rect.top < window.innerHeight
      }
      return current >= 0 || direction === 1
    }
    /* On the last stop of a releasing runway: downward, the gesture that
       brought the step is held and the next fresh one is free; upward from
       past the stop, the page returns to the stop before stepping back. */
    const releaseMode = (direction: 1 | -1): ReleaseMode => {
      if (!lastStop || stepRef.current !== last) return null
      if (direction === 1) return released ? 'free' : 'hold'
      return window.scrollY > documentTop(lastStop) + REST_TOLERANCE_PX ? 'return' : null
    }
    /* The way back from the first stop must land where no stop is past the
       line, whatever the intro's height, or the reader is held there. */
    const introTop = () => {
      const first = stops[0]
      const clear = first ? documentTop(first) - window.innerHeight * STOP_LINE - INTRO_CLEARANCE_PX : Number.POSITIVE_INFINITY
      return Math.min(documentTop(intro), clear)
    }
    const targetFor = (direction: 1 | -1): number | null => {
      const next = stepRef.current + direction
      if (next < -1) return null
      if (next === -1) return introTop()
      if (next >= count) return documentTop(outro)
      const stop = stops[next]
      return stop ? documentTop(stop) : null
    }
    let lastWheel = 0
    let lastDelta = 0
    let lastDirection = 0
    let lastGo = 0
    let rises = 0
    const travel = (target: number) => {
      lastGo = performance.now()
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
    const go = (direction: 1 | -1) => {
      const target = targetFor(direction)
      if (target !== null) travel(target)
    }
    const release = () => {
      released = true
      syncSnap()
    }
    const returnToLast = () => {
      released = false
      syncSnap()
      if (lastStop) travel(documentTop(lastStop))
    }
    /* On a trackpad the momentum of one swipe keeps sending events for a
       second or more, and only ever weaker; a new swipe is a jump in
       strength or a silence. The ramp of the same swipe is covered by the
       cooldown after a move. */
    const freshGesture = (strength: number, direction: 1 | -1): boolean => {
      const now = performance.now()
      const silent = now - lastWheel > GESTURE_GAP_MS
      const turned = direction !== lastDirection
      rises = strength > lastDelta + Math.max(GESTURE_RISE_MIN, lastDelta * GESTURE_RISE_SHARE) ? rises + 1 : 0
      const fresh = silent || turned || rises >= GESTURE_RISES
      lastWheel = now
      lastDelta = strength
      lastDirection = direction
      if (!fresh || now - lastGo <= GESTURE_COOLDOWN_MS) return false
      rises = 0
      return true
    }
    const onWheel = (event: WheelEvent) => {
      const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0
      if (!direction || !locked(direction)) return
      const mode = releaseMode(direction)
      if (mode === 'free') return
      const fresh = freshGesture(Math.abs(event.deltaY) * (event.deltaMode === 0 ? 1 : 16), direction)
      // A fresh gesture on the held last stop goes on natively from its first event.
      if (mode === 'hold' && fresh) {
        release()
        return
      }
      event.preventDefault()
      if (!fresh) return
      if (mode === 'return') returnToLast()
      else go(direction)
    }
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      const direction =
        event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ' ? 1 : event.key === 'ArrowUp' || event.key === 'PageUp' ? -1 : 0
      if (!direction || !locked(direction)) return
      const mode = releaseMode(direction)
      if (mode === 'free') return
      // A key press is a whole gesture: from the held last stop it simply goes on.
      if (mode === 'hold') {
        release()
        return
      }
      event.preventDefault()
      if (mode === 'return') returnToLast()
      else go(direction)
    }

    /* A jump to an anchor (header, compass, index, call to action) must not
       be caught by the mandatory snap and land on the nearest stop instead:
       the snap is dropped before the jump happens and the next scroll frame
       picks the step afresh where the page really is. */
    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!target || !target.getAttribute('href')?.includes('#')) return
      wantingSnap.delete(token)
      applySnap()
    }
    const onHashChange = () => {
      wantingSnap.delete(token)
      applySnap()
      schedule()
    }

    pick()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onAnchorClick, true)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onAnchorClick, true)
      window.removeEventListener('hashchange', onHashChange)
      wantingSnap.delete(token)
      applySnap()
    }
  }, [active, count, releaseAtLast, wrapRef, runwayRef])

  return step
}
