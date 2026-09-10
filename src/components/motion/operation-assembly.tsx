'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ASSEMBLY, ASSEMBLY_AFTER_LABELS } from '@/content/assembly'

type Mode = 'before' | 'after'

const SATELLITE = { tl: { x: 6, y: 6 }, tr: { x: 72, y: 6 }, br: { x: 72, y: 72 }, bl: { x: 6, y: 72 } } as const
const CORE = { x: 35, y: 35, size: 30 } as const
const GONE = { x: 45, y: 45, size: 10 } as const
const STAGGER_MS = 70

interface Geometry {
  readonly x: number
  readonly y: number
  readonly size: number
}

function afterGeometry(after: (typeof ASSEMBLY)[number]['after']): Geometry {
  if (after === 'core') return CORE
  if (after === 'gone') return GONE
  return { ...SATELLITE[after], size: 22 }
}

/** Transform that moves a rect drawn at its final place back to where it started. */
function beforeTransform(before: Geometry, after: Geometry, gone: boolean): string {
  if (gone) {
    const dx = before.x + before.size / 2 - (after.x + after.size / 2)
    const dy = before.y + before.size / 2 - (after.y + after.size / 2)
    return `translate(${dx}px, ${dy}px) scale(${before.size / after.size})`
  }
  return `translate(${before.x - after.x}px, ${before.y - after.y}px) scale(${before.size / after.size})`
}

/**
 * The operation before and after: scattered pieces become the mark. Plays
 * once when it comes into view; the two buttons let the reader replay it.
 */
export function OperationAssembly() {
  const [mode, setMode] = useState<Mode>('before')
  const ref = useRef<HTMLElement>(null)
  const played = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || played.current) return
        played.current = true
        window.setTimeout(() => setMode('after'), 500)
        observer.disconnect()
      },
      { threshold: 0.5 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const showBefore = useCallback(() => setMode('before'), [])
  const showAfter = useCallback(() => setMode('after'), [])

  return (
    <figure ref={ref} className="assembly" data-mode={mode}>
      <div className="flex gap-px" role="group" aria-label="Estado da operação">
        <button type="button" onClick={showBefore} aria-pressed={mode === 'before'} className="assembly-toggle">
          Hoje
        </button>
        <button type="button" onClick={showAfter} aria-pressed={mode === 'after'} className="assembly-toggle">
          Com a Xiax
        </button>
      </div>

      <svg viewBox="0 0 100 100" className="assembly-stage" role="img" aria-labelledby="assembly-caption">
        {ASSEMBLY.map((piece, index) => {
          const after = afterGeometry(piece.after)
          const gone = piece.after === 'gone'
          const isCore = piece.after === 'core'
          const transform = mode === 'before' ? beforeTransform(piece.before, after, gone) : gone ? 'scale(0)' : 'none'
          return (
            <rect
              key={piece.before.label}
              data-piece={gone ? 'gone' : isCore ? 'core' : 'satellite'}
              x={after.x}
              y={after.y}
              width={after.size}
              height={after.size}
              style={{
                transform,
                transformOrigin: gone ? 'center' : '0 0',
                transitionDelay: `${index * STAGGER_MS}ms`,
              }}
            />
          )
        })}
        {ASSEMBLY.map((piece, index) => (
          <text
            key={`before-${piece.before.label}`}
            data-label="before"
            x={piece.before.x > 55 ? piece.before.x + piece.before.size : piece.before.x}
            y={piece.before.y - 1.6}
            textAnchor={piece.before.x > 55 ? 'end' : 'start'}
            style={{ transitionDelay: `${index * STAGGER_MS}ms` }}
          >
            {piece.before.label}
          </text>
        ))}
        {(['tl', 'tr', 'br', 'bl'] as const).map((corner, index) => (
          <text
            key={corner}
            data-label="after"
            x={SATELLITE[corner].x + (corner === 'tr' || corner === 'br' ? 22 : 0)}
            y={corner === 'tl' || corner === 'tr' ? 2.6 : 99}
            textAnchor={corner === 'tr' || corner === 'br' ? 'end' : 'start'}
            style={{ transitionDelay: `${600 + index * STAGGER_MS}ms` }}
          >
            {ASSEMBLY_AFTER_LABELS[corner]}
          </text>
        ))}
        <text data-label="after" data-label-core="" x={50.8} y={51.9} textAnchor="middle" style={{ transitionDelay: '900ms' }}>
          {ASSEMBLY_AFTER_LABELS.core}
        </text>
      </svg>

      <figcaption id="assembly-caption" className="text-sm text-on-muted">
        {mode === 'before'
          ? 'Hoje: nove lugares diferentes guardam a operação, e nenhum fala com o outro.'
          : 'Com a Xiax: um sistema, quatro partes que se falam, IA no núcleo. O que era duplicado some.'}
      </figcaption>
    </figure>
  )
}
