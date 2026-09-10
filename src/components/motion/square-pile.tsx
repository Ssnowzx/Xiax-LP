'use client'

import type { PointerEvent } from 'react'
import { useCallback, useEffect, useRef } from 'react'

/** Column width, in px. One satellite at the header mark's scale. */
const CELL_DESKTOP = 24
const CELL_PHONE = 18
const GAP = 2
const GRAVITY = 2600
const SPAWN_MS = 420
const FLASH_MS = 220
/** One in this many squares is the core. */
const CORE_EVERY = 9

interface Falling {
  readonly col: number
  y: number
  vy: number
  readonly kind: 1 | 2
}

interface Sim {
  cols: number
  rows: number
  cell: number
  grid: number[][]
  heights: number[]
  falling: Falling[]
  flash: { row: number; until: number } | null
  lastSpawn: number
  seed: number
}

function random(sim: Sim): number {
  sim.seed = (sim.seed * 1664525 + 1013904223) % 4294967296
  return sim.seed / 4294967296
}

function freshSim(width: number, height: number, cell: number): Sim {
  const cols = Math.max(4, Math.floor(width / cell))
  const rows = Math.max(3, Math.floor(height / cell))
  return {
    cols,
    rows,
    cell,
    grid: Array.from({ length: rows }, () => new Array<number>(cols).fill(0)),
    heights: new Array<number>(cols).fill(0),
    falling: [],
    flash: null,
    lastSpawn: 0,
    seed: 20260909,
  }
}

/** Drops one square in a column; `kind` 1 is a satellite, 2 the core. */
function spawn(sim: Sim, col: number, kind: 1 | 2): void {
  if (sim.heights[col] === undefined || sim.heights[col]! >= sim.rows) return
  if (sim.falling.some((square) => square.col === col)) return
  sim.falling.push({ col, y: -sim.cell, vy: 0, kind })
}

function land(sim: Sim, square: Falling): void {
  const height = sim.heights[square.col] ?? 0
  const row = sim.rows - 1 - height
  const line = sim.grid[row]
  if (!line) return
  line[square.col] = square.kind
  sim.heights[square.col] = height + 1
}

/** Tetris: a complete bottom row flashes, then disappears; the rest drops. */
function clearIfComplete(sim: Sim, now: number): void {
  const bottom = sim.grid[sim.rows - 1]
  if (!bottom || bottom.some((cell) => cell === 0)) return
  sim.flash = { row: sim.rows - 1, until: now + FLASH_MS }
}

function applyClear(sim: Sim): void {
  sim.grid.splice(sim.rows - 1, 1)
  sim.grid.unshift(new Array<number>(sim.cols).fill(0))
  sim.heights = sim.heights.map((height) => Math.max(0, height - 1))
  sim.flash = null
}

/**
 * Squares fall and stack on the line above the footer. Tetris, squares only:
 * a full row flashes and clears, the rows above drop. Click or tap a column
 * to drop one yourself. Canvas, so it stays sharp on any screen; still
 * with reduced motion.
 */
export function SquarePile() {
  const ref = useRef<HTMLCanvasElement>(null)
  const simRef = useRef<Sim | null>(null)

  const dropAt = useCallback((clientX: number) => {
    const canvas = ref.current
    const sim = simRef.current
    if (!canvas || !sim) return
    const box = canvas.getBoundingClientRect()
    const col = Math.min(sim.cols - 1, Math.max(0, Math.floor((clientX - box.left) / sim.cell)))
    spawn(sim, col, 2)
  }, [])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const context = canvas.getContext('2d')
    if (!context) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let frame = 0
    let last = 0
    let inView = false
    let colors = { on: '#0b0b0c', accent: '#7b57d4' }
    let colorTick = 0

    const readColors = () => {
      const style = getComputedStyle(canvas)
      colors = {
        on: style.getPropertyValue('--on').trim() || colors.on,
        accent: style.getPropertyValue('--accent').trim() || colors.accent,
      }
    }

    const draw = (now: number) => {
      const sim = simRef.current
      if (!sim) return
      context.clearRect(0, 0, width, height)
      const size = sim.cell - GAP
      const offsetX = (width - sim.cols * sim.cell) / 2
      for (let row = 0; row < sim.rows; row += 1) {
        const line = sim.grid[row]
        if (!line) continue
        const flashing = sim.flash?.row === row
        for (let col = 0; col < sim.cols; col += 1) {
          const kind = line[col]
          if (!kind) continue
          context.fillStyle = flashing ? colors.accent : kind === 2 ? colors.accent : colors.on
          context.globalAlpha = flashing ? 0.5 + 0.5 * Math.sin(now / 30) : 1
          context.fillRect(offsetX + col * sim.cell + GAP / 2, row * sim.cell + GAP / 2, size, size)
        }
      }
      context.globalAlpha = 1
      for (const square of sim.falling) {
        context.fillStyle = square.kind === 2 ? colors.accent : colors.on
        context.fillRect(offsetX + square.col * sim.cell + GAP / 2, square.y + GAP / 2, size, size)
      }
    }

    const step = (now: number) => {
      const sim = simRef.current
      if (!sim) return
      const dt = Math.min(0.032, (now - (last || now)) / 1000)
      last = now
      colorTick += 1
      if (colorTick % 60 === 0) readColors()

      if (sim.flash) {
        if (now >= sim.flash.until) applyClear(sim)
      } else {
        if (now - sim.lastSpawn > SPAWN_MS) {
          sim.lastSpawn = now
          const col = Math.floor(random(sim) * sim.cols)
          spawn(sim, col, random(sim) < 1 / CORE_EVERY ? 2 : 1)
        }
        for (const square of sim.falling) {
          square.vy += GRAVITY * dt
          square.y += square.vy * dt
        }
        const landed = sim.falling.filter((square) => {
          const floor = height - ((sim.heights[square.col] ?? 0) + 1) * sim.cell
          return square.y >= floor
        })
        for (const square of landed) land(sim, square)
        if (landed.length > 0) sim.falling = sim.falling.filter((square) => !landed.includes(square))
        clearIfComplete(sim, now)
        if (sim.heights.every((h) => h >= sim.rows)) simRef.current = freshSim(width, height, sim.cell)
      }
      draw(now)
      frame = inView ? requestAnimationFrame(step) : 0
    }

    const resize = () => {
      const box = canvas.getBoundingClientRect()
      width = box.width
      height = box.height
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cell = width < 640 ? CELL_PHONE : CELL_DESKTOP
      const sim = freshSim(width, height, cell)
      simRef.current = sim
      readColors()
      if (reduce) {
        // A still pile: a few columns already stacked, no motion.
        for (let col = 0; col < sim.cols; col += 1) {
          const stack = Math.floor(random(sim) * 3)
          for (let level = 0; level < stack; level += 1) land(sim, { col, y: 0, vy: 0, kind: random(sim) < 1 / CORE_EVERY ? 2 : 1 })
        }
        draw(0)
      }
    }

    resize()
    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting)
        if (inView && !reduce && !frame) {
          last = 0
          frame = requestAnimationFrame(step)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(canvas)
    const onResize = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      resize()
      if (inView && !reduce) frame = requestAnimationFrame(step)
    }
    window.addEventListener('resize', onResize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const onPointerDown = useCallback((event: PointerEvent<HTMLCanvasElement>) => dropAt(event.clientX), [dropAt])

  return <canvas ref={ref} className="pile" aria-hidden="true" onPointerDown={onPointerDown} />
}
