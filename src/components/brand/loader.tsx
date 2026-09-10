import type { CSSProperties } from 'react'

import type { LoaderVariant } from '@/types'

/**
 * The brand manual's loaders, in code. Same 100-unit geometry as the mark;
 * the behaviour of each variation is the manual's, keyframe by keyframe:
 *
 *   grow        do centro para fora — a system being assembled
 *   sequence    carregando em sequência — progress
 *   trail       órbita com rastro — legible down to 16px
 *   orbit       órbita contínua — the default, continuous work
 *   orbit-step  órbita em passos — a process with phases
 *   dots        pontilhado — a short wait
 *   pulse       pulso do núcleo — a loader inside content
 *
 * Cycle: 1.6s by default, 1.1s for short actions, 2s for long processes.
 * Reduced motion shows the still mark.
 */
interface LoaderProps {
  readonly variant: LoaderVariant
  readonly size?: number
  readonly cycle?: 'short' | 'base' | 'long'
  readonly title?: string
  readonly className?: string
}

const SATELLITES = [
  { x: 6, y: 6 },
  { x: 72, y: 6 },
  { x: 72, y: 72 },
  { x: 6, y: 72 },
] as const

const CYCLE_VAR = {
  short: 'var(--dur-cycle-short)',
  base: 'var(--dur-cycle)',
  long: 'var(--dur-cycle-long)',
} as const

export function Loader({ variant, size = 48, cycle = 'base', title, className }: LoaderProps) {
  const orbits = variant === 'orbit' || variant === 'orbit-step'

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={['loader', className].filter(Boolean).join(' ')}
      data-variant={variant}
      // A custom property is not in CSSProperties; this is the one place the cast is justified.
      style={{ '--d': CYCLE_VAR[cycle] } as CSSProperties}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {SATELLITES.map((satellite) => (
        <rect key={`${satellite.x}-${satellite.y}`} data-piece="satellite" x={satellite.x} y={satellite.y} width={22} height={22} />
      ))}
      <rect data-piece="core" x={35} y={35} width={30} height={30} />
      {orbits ? <rect data-piece="orbiter" x={6} y={6} width={22} height={22} /> : null}
    </svg>
  )
}
