'use client'

import type { PointerEvent, ReactNode } from 'react'
import { useEffect, useId, useRef, useState } from 'react'

import type { MethodStep } from '@/types'
import { Mark } from '@/components/brand/mark'
import { PointerGrid } from '@/components/motion/pointer-grid'
import { hasFinePointer, leanToward, resetLean } from '@/components/motion/pointer-lean'

type StepState = 'ahead' | 'open' | 'read'

/** A step counts as reached once its top passes this share of the viewport. */
const REACH_LINE = 0.75

function stateOf(index: number, current: number): StepState {
  if (current < 0 || index < current) return 'read'
  return index === current ? 'open' : 'ahead'
}

/**
 * The manual's "loading in sequence" loader, used as it was meant: the mark
 * fills one satellite per step the reader reaches. The step nearest the
 * middle of the screen is the one in focus: it turns to paper, its number
 * goes violet, and it leans toward the pointer with the grid under it, like
 * the satellites of the hero. Reduced motion keeps every step lit.
 */
export function MethodSteps({ steps, heading }: { readonly steps: readonly MethodStep[]; readonly heading: ReactNode }) {
  const id = useId()
  const listRef = useRef<HTMLOListElement>(null)
  const currentRef = useRef(-1)
  const fineRef = useRef(false)
  const [reached, setReached] = useState(0)
  const [current, setCurrent] = useState(-1)

  useEffect(() => {
    const list = listRef.current
    if (!list) return undefined
    const items = Array.from(list.querySelectorAll<HTMLLIElement>('li'))
    if (items.length === 0) return undefined
    const spotlight = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    fineRef.current = hasFinePointer()

    let frame = 0
    const pick = () => {
      frame = 0
      const middle = window.innerHeight / 2
      let best = -1
      let bestDistance = Number.POSITIVE_INFINITY
      let passed = 0
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect()
        if (rect.top < window.innerHeight * REACH_LINE) passed = index + 1
        if (rect.bottom < 0 || rect.top > window.innerHeight) return
        const distance = Math.abs((rect.top + rect.bottom) / 2 - middle)
        if (distance < bestDistance) {
          bestDistance = distance
          best = index
        }
      })
      setReached((value) => Math.max(value, passed))
      const next = spotlight ? best : -1
      currentRef.current = next
      setCurrent(next)
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
  }, [])

  const openItem = () => {
    const items = listRef.current?.querySelectorAll<HTMLLIElement>('li')
    const item = items?.[currentRef.current]
    return item ? { lean: item, surface: item } : null
  }

  const onPointerMove = (event: PointerEvent<HTMLOListElement>) => {
    if (!fineRef.current) return
    const target = openItem()
    if (target) leanToward(target, event.clientX, event.clientY)
  }

  const onPointerLeave = () => {
    const target = openItem()
    if (target) resetLean(target)
  }

  return (
    <div className="grid gap-satellite lg:grid-cols-[2fr_3fr] lg:gap-x-core">
      <div className="lg:sticky lg:top-core lg:self-start">
        {heading}
        <div className="mark-progress mt-satellite" data-step={reached}>
          <Mark size={96} coreSlot="method" title={`${reached} de ${steps.length} passos lidos`} />
        </div>
      </div>
      <ol ref={listRef} className="method-list" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        {steps.map((step, index) => (
          <li key={step.title} className="method-step lean" data-state={stateOf(index, current)}>
            <PointerGrid id={`${id}-grid-${index}`} />
            <span aria-hidden="true" className="method-number">
              {index + 1}
            </span>
            <div className="method-text">
              <h3 className="text-xl">{step.title}</h3>
              <p className="measure mt-3 text-on-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
