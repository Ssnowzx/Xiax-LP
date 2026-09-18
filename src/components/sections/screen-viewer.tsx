'use client'

import Image from 'next/image'
import type { KeyboardEvent, MouseEvent } from 'react'
import { useEffect, useId, useRef, useState } from 'react'

import type { PortfolioScreens } from '@/types'

/** Three loader cycles (1.6 s each) on one screen before the next comes up. */
const ADVANCE_MS = 4800

interface ScreenViewerProps {
  readonly name: string
  readonly screens: PortfolioScreens
}

/**
 * Real screens of a system in a Xiax window, one tab per module. While the
 * viewer is on screen and nobody has touched the tabs, the screens advance on
 * the loader's clock and the active tab's underline fills as the clock runs.
 * A click or an arrow key hands the tabs to the person. Reduced motion never
 * advances by itself.
 */
export function ScreenViewer({ name, screens }: ScreenViewerProps) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const [playing, setPlaying] = useState(false)
  const count = screens.screens.length

  useEffect(() => {
    const node = rootRef.current
    if (!node) return undefined
    node.style.setProperty('--advance', `${ADVANCE_MS}ms`)
    if (held || count < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let timer = 0
    const stop = () => {
      window.clearInterval(timer)
      timer = 0
      setPlaying(false)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          stop()
          return
        }
        if (timer) return
        timer = window.setInterval(() => setActive((current) => (current + 1) % count), ADVANCE_MS)
        setPlaying(true)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      stop()
    }
  }, [held, count])

  const first = screens.screens[0]
  if (!first) return null

  const select = (index: number) => {
    setHeld(true)
    setActive(index)
  }

  const onTabClick = (event: MouseEvent<HTMLButtonElement>) => {
    select(Number(event.currentTarget.dataset['index']))
  }

  const onTabsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (active + step + count) % count
    select(next)
    const tabs = tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    tabs?.[next]?.focus()
  }

  return (
    <div ref={rootRef} className="viewer" data-playing={playing && !held}>
      <div className="viewer-window">
        <div className="viewer-bar" aria-hidden="true">
          <span className="viewer-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="data viewer-url">{screens.source}</span>
          <span className="data viewer-tag">telas reais</span>
        </div>
        <div ref={tabsRef} role="tablist" aria-label={`Telas de ${name}`} className="viewer-tabs" onKeyDown={onTabsKeyDown}>
          {screens.screens.map((screen, index) => (
            <button
              key={screen.src}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={index === active}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={index === active ? 0 : -1}
              data-index={index}
              className="viewer-tab"
              onClick={onTabClick}
            >
              {screen.label}
            </button>
          ))}
        </div>
        <div className="viewer-stage" style={{ aspectRatio: `${first.width} / ${first.height}` }}>
          {screens.screens.map((screen, index) => (
            <div
              key={screen.src}
              role="tabpanel"
              id={`${id}-panel-${index}`}
              aria-labelledby={`${id}-tab-${index}`}
              className="viewer-panel"
              data-active={index === active}
              tabIndex={index === active ? 0 : -1}
              inert={index !== active}
            >
              <Image
                src={screen.src}
                width={screen.width}
                height={screen.height}
                alt={screen.alt}
                sizes="(min-width: 76rem) 76rem, (min-width: 48rem) 100vw, 250vw"
              />
            </div>
          ))}
        </div>
      </div>
      <p className="data viewer-hint mt-margin md:hidden" aria-hidden="true">
        arraste a tela para o lado
      </p>
      <p className="data mt-margin">
        Telas reais de {screens.source}, {screens.capturedAt}.{screens.redacted ? ` ${screens.redacted}` : ''}
      </p>
    </div>
  )
}
