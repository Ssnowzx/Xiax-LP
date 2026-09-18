'use client'

import { useEffect, useRef, useState } from 'react'

import { Loader } from '@/components/brand/loader'
import { Runway } from '@/components/motion/runway'
import { useRunway } from '@/components/motion/use-runway'
import { COMPANY } from '@/content/company'
import { FRONTS } from '@/content/fronts'

type Mode = 'static' | 'stage'

const CELLS = ['tl', 'tr', 'br', 'bl'] as const

/**
 * The core as a 10×10 mosaic, ordered like the grid it sits on: the outer
 * ring is violet (transparent, so the travelling core paints it when it
 * docks), the next ring alternates violet and white in mirror symmetry, and
 * the centre is white, with the plate that carries the words always white.
 */
const MOSAIC = 10
const MOSAIC_CELLS = Array.from({ length: MOSAIC * MOSAIC }, (_, index) => index)
const PLATE_ROWS = [3, 4, 5, 6] as const
const PLATE_COLS = [1, 8] as const

function isPlate(row: number, col: number): boolean {
  return PLATE_ROWS.includes(row as 3) && col >= PLATE_COLS[0] && col <= PLATE_COLS[1]
}

/** Distance of a cell from the nearest edge: 0 is the outer ring. */
function ringOf(row: number, col: number): number {
  return Math.min(row, col, MOSAIC - 1 - row, MOSAIC - 1 - col)
}

function isViolet(index: number): boolean {
  const row = Math.floor(index / MOSAIC)
  const col = index % MOSAIC
  if (isPlate(row, col)) return false
  const ring = ringOf(row, col)
  if (ring === 0) return true
  if (ring > 1) return false
  // The transition ring alternates from each corner inward, the same on every side.
  return (Math.min(row, MOSAIC - 1 - row) + Math.min(col, MOSAIC - 1 - col)) % 2 === 0
}

/** The manual's reason for each loader, shown to people who use a screen reader. */
const LOADER_MEANING = {
  grow: 'sistema sendo montado',
  sequence: 'progresso',
  trail: 'órbita com rastro',
  orbit: 'trabalho contínuo',
  'orbit-step': 'processo com fases',
  dots: 'espera curta',
  pulse: 'núcleo em espera',
} as const

/**
 * The four fronts laid out as the mark, on the mark's own construction
 * lines, around the core. On a wide screen the composition pins, sized to
 * fit the screen whole, and the fronts are born from the centre one at a
 * time, one per gesture, the way the manual's loader grows outward. Below
 * that width, and with reduced motion, all four simply stand in place.
 */
export function FrontsStage() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const runwayRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('static')
  const [rail, setRail] = useState(false)
  const step = useRunway(wrapRef, runwayRef, FRONTS.length, mode === 'stage', { releaseAtLast: true })

  /* Below 48rem the fronts are a rail that scrolls sideways: a region the
     keyboard must be able to reach and scroll. */
  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 47.99rem)')
    const apply = () => setRail(narrow.matches)
    apply()
    narrow.addEventListener('change', apply)
    return () => narrow.removeEventListener('change', apply)
  }, [])

  /* The runway ends where the stage lets go, one stage past the last stop
     (see `.fronts-runway`); the stage's height is the one measure CSS
     cannot take on its own. */
  useEffect(() => {
    const stage = stageRef.current
    const runway = runwayRef.current
    if (!stage || !runway || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => {
      runway.style.setProperty('--stage-height', `${Math.ceil(stage.getBoundingClientRect().height)}px`)
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const wide = window.matchMedia('(min-width: 64rem)')
    const apply = () => setMode(reduce.matches || !wide.matches ? 'static' : 'stage')
    apply()
    reduce.addEventListener('change', apply)
    wide.addEventListener('change', apply)
    return () => {
      reduce.removeEventListener('change', apply)
      wide.removeEventListener('change', apply)
    }
  }, [])

  const arrived = (index: number) => mode !== 'stage' || index <= step

  return (
    <div ref={wrapRef} className="fronts" data-mode={mode}>
      <div ref={stageRef} className="fronts-stage">
        <div className="orbit-grid blueprint">
          <span aria-hidden="true" className="blueprint-line" style={{ left: '25%' }} />
          <span aria-hidden="true" className="blueprint-line" style={{ left: 'calc(100% * 29 / 88)' }} />
          <span aria-hidden="true" className="blueprint-line" style={{ left: 'calc(100% * 59 / 88)' }} />
          <span aria-hidden="true" className="blueprint-line" style={{ left: '75%' }} />

          <div data-cell="core" className="order-first lg:order-none">
            <div data-core-slot="fronts" className="core-slot slot-core mosaic">
              {MOSAIC_CELLS.map((index) => (
                <i key={index} aria-hidden="true" className={isViolet(index) ? 'mosaic-cell' : 'mosaic-cell is-white'} />
              ))}
              <div className="slot-text">
                <p className="slot-caption">{COMPANY.signature}</p>
                <p className="slot-note">Quatro frentes. Um jeito de construir.</p>
              </div>
            </div>
          </div>

          <div className="front-rail" role={rail ? 'region' : undefined} aria-label={rail ? 'As quatro frentes, role para o lado' : undefined} tabIndex={rail ? 0 : undefined}>
            {FRONTS.map((front, index) => (
              <div key={front.slug} data-cell={CELLS[index] ?? 'tl'} className="front-cell" data-state={arrived(index) ? 'arrived' : 'waiting'}>
                <Loader variant={front.loader} size={48} title={`Loader ${LOADER_MEANING[front.loader]}`} />
                <h3 className="front-title">{front.name}</h3>
                <p className="front-promise text-on-muted">{front.promise}</p>
                <p className="data front-examples">{front.examples.join(', ')}</p>
              </div>
            ))}
          </div>
          <p className="data front-hint lg:hidden">deslize para ver as quatro frentes</p>
        </div>
      </div>
      <Runway ref={runwayRef} count={FRONTS.length} active={mode === 'stage'} className="fronts-runway" />
    </div>
  )
}
