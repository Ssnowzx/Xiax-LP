'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import type { MethodStep } from '@/types'
import { Mark } from '@/components/brand/mark'

/**
 * The manual's "loading in sequence" loader, used as it was meant: the mark
 * fills one satellite per step the reader reaches. Four steps, four
 * satellites. The core arrives with the travelling core.
 */
export function MethodSteps({ steps, heading }: { readonly steps: readonly MethodStep[]; readonly heading: ReactNode }) {
  const listRef = useRef<HTMLOListElement>(null)
  const [reached, setReached] = useState(0)

  useEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll('li') ?? [])
    if (items.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = items.indexOf(entry.target as HTMLLIElement)
          setReached((current) => Math.max(current, index + 1))
        })
      },
      { rootMargin: '0px 0px -25% 0px', threshold: 0.4 },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="grid gap-satellite lg:grid-cols-[2fr_3fr] lg:gap-x-core">
      <div className="lg:sticky lg:top-core lg:self-start">
        {heading}
        <div className="mark-progress mt-satellite" data-step={reached}>
          <Mark size={96} coreSlot="method" title={`${reached} de ${steps.length} passos lidos`} />
        </div>
      </div>
      <ol ref={listRef} className="grid gap-satellite md:grid-cols-2 lg:gap-x-core">
        {steps.map((step, index) => (
          <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-clearance">
            <span aria-hidden="true" className="text-3xl leading-none font-extrabold tracking-display">
              {index + 1}
            </span>
            <div>
              <h3 className="text-xl">{step.title}</h3>
              <p className="measure mt-3 text-on-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
