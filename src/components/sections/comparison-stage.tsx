'use client'

import type { ReactNode } from 'react'
import { useEffect, useId, useRef, useState } from 'react'

import type { ComparisonRow } from '@/types'
import { PointerGrid } from '@/components/motion/pointer-grid'
import { hasFinePointer, leanToward, resetLean } from '@/components/motion/pointer-lean'
import { Runway } from '@/components/motion/runway'
import { useRunway } from '@/components/motion/use-runway'

type Mode = 'static' | 'list' | 'stage'
type RowState = 'ahead' | 'open' | 'read'
type CardPosition = 'ahead' | 'front' | 'behind-1' | 'behind-2' | 'gone'

interface ComparisonStageProps {
  readonly rows: readonly ComparisonRow[]
  readonly columns: { readonly market: string; readonly xiax: string }
  /** The title and the line that open the whole table, so the sheet never arrives unannounced. */
  readonly table: { readonly title: string; readonly lede: string }
  /** The section's opening screen: what the stage pins while the deck plays over it. */
  readonly children: ReactNode
}

/** On a phone the pair nearest the middle of the screen is the one in focus. */
function stepFromList(rows: readonly HTMLElement[], count: number): number {
  const middle = window.innerHeight / 2
  let best = -1
  let bestDistance = Number.POSITIVE_INFINITY
  let above = 0
  rows.forEach((row, index) => {
    const rect = row.getBoundingClientRect()
    if (rect.bottom < 0) {
      above += 1
      return
    }
    if (rect.top > window.innerHeight) return
    const distance = Math.abs((rect.top + rect.bottom) / 2 - middle)
    if (distance < bestDistance) {
      bestDistance = distance
      best = index
    }
  })
  if (best >= 0) return best
  return above === count ? count : -1
}

function stateOf(index: number, step: number): RowState {
  if (index < step) return 'read'
  return index === step ? 'open' : 'ahead'
}

/** The card in front is the current pair; the ones already read stack behind it. */
function positionOf(index: number, step: number): CardPosition {
  if (index === step) return 'front'
  if (index > step) return 'ahead'
  const depth = step - index
  if (depth === 1) return 'behind-1'
  return depth === 2 ? 'behind-2' : 'gone'
}

/**
 * The comparison, one pair at a time. On a wide screen the section's opening
 * screen pins, the whole viewport is veiled and blurred, and a deck of paper
 * cards opens in the centre: the card in front is the current pair, the
 * market line struck as the Xiax line is swept in violet, the pairs already
 * read stacked behind it. The deck leans toward the pointer and shows the
 * engineering grid under it, like the satellites of the hero. Each card is a
 * stop on the runway: one gesture, one card, and the page never runs ahead
 * of the card. After the runway the whole table rises as a sheet of paper.
 * On a phone there is no stage: the pair nearest the middle of the screen is
 * the one in focus. With reduced motion the table is simply shown, complete.
 */
export function ComparisonStage({ rows, columns, table, children }: ComparisonStageProps) {
  const id = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const runwayRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const count = rows.length
  const [mode, setMode] = useState<Mode>('static')
  const [listStep, setListStep] = useState(count)
  const runwayStep = useRunway(wrapRef, runwayRef, count, mode === 'stage')
  const step = mode === 'stage' ? runwayStep : mode === 'list' ? listStep : count
  const open = mode === 'stage' && step >= 0 && step < count

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const wide = window.matchMedia('(min-width: 64rem)')
    const apply = () => setMode(reduce.matches ? 'static' : wide.matches ? 'stage' : 'list')
    apply()
    reduce.addEventListener('change', apply)
    wide.addEventListener('change', apply)
    return () => {
      reduce.removeEventListener('change', apply)
      wide.removeEventListener('change', apply)
    }
  }, [])

  /* On a phone the focus follows the middle of the screen. */
  useEffect(() => {
    const table = tableRef.current
    if (mode !== 'list' || !table) return undefined
    const rowNodes = Array.from(table.querySelectorAll<HTMLElement>('[data-row]'))
    let frame = 0
    const pick = () => {
      frame = 0
      setListStep(stepFromList(rowNodes, count))
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
  }, [mode, count])

  /* While the deck is open it leans toward the pointer anywhere on the screen. */
  useEffect(() => {
    const deck = deckRef.current
    if (!open || !deck || !hasFinePointer()) return undefined
    const target = () => {
      const front = deck.querySelector<HTMLElement>('[data-position="front"]')
      return front ? { lean: deck, surface: front } : null
    }
    const onMove = (event: globalThis.PointerEvent) => {
      const found = target()
      if (found) leanToward(found, event.clientX, event.clientY)
    }
    const onLeave = () => {
      const found = target()
      if (found) resetLean(found)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  }, [open, step])

  return (
    <div ref={wrapRef} className="compare" data-mode={mode} data-open={open}>
      <div className="compare-stage">{children}</div>
      {/* Veil and deck live beside the stage, not inside it: a sticky element
          is a stacking context, and the sheet of paper must stay under them. */}
      {mode === 'stage' ? (
        <>
          <div className="compare-veil" aria-hidden="true" />
          <div ref={deckRef} className="compare-deck lean" aria-hidden="true">
            {rows.map((row, index) => (
              <div key={row.businessHouse} className="compare-card" data-position={positionOf(index, step)}>
                <PointerGrid id={`${id}-grid-${index}`} />
                <div className="compare-card-body">
                  <p className="compare-card-head">
                    <span className="data">
                      {String(index + 1).padStart(2, '0')} de {String(count).padStart(2, '0')}
                    </span>
                    <span className="data">{columns.market}</span>
                  </p>
                  <p className="compare-card-market">
                    <span>{row.softwareHouse}</span>
                  </p>
                  <p className="compare-card-xiax">
                    <i />
                    <span className="highlight">{row.businessHouse}</span>
                  </p>
                  <div className="compare-foot">
                    <span className="compare-dots">
                      {rows.map((dot, position) => (
                        <i key={dot.businessHouse} data-filled={position <= index} />
                      ))}
                    </span>
                    <span className="data">{index + 1 < count ? 'role para o próximo' : 'role para ver a tabela inteira'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
      <Runway ref={runwayRef} count={count} active={mode === 'stage'} className="compare-runway" />
      <div ref={tableRef} className="compare-table">
        <div className="compare-table-head">
          <h3 className="compare-table-title sweep">
            <span className="sweep-line">{table.title}</span>
          </h3>
          <p className="compare-table-lede">{table.lede}</p>
        </div>
        <p className="compare-head" aria-hidden="true">
          <span>{columns.market}</span>
          <span>{columns.xiax}</span>
        </p>
        <ol className="compare-list">
          {rows.map((row, index) => (
            <li key={row.businessHouse} data-row className="compare-row" data-state={stateOf(index, step)}>
              <p className="compare-market">
                <span className="compare-label data">{columns.market}</span>
                <span className="compare-text">{row.softwareHouse}</span>
              </p>
              <p className="compare-xiax">
                <span className="compare-label data">{columns.xiax}</span>
                <span className="compare-text">
                  <i aria-hidden="true" />
                  <span className="highlight">{row.businessHouse}</span>
                </span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
