/**
 * The Xiax mark: four satellites, one core.
 *
 * Geometry is fixed by the brand manual on a 100-unit grid — satellites 22u at
 * 6u from the edges, core 30u centred. Do not adjust it.
 *
 * Colour rule: the core carries the accent, the satellites never do. In
 * one-ink contexts the core takes the structure colour instead.
 */

export interface MarkProps {
  /** Intrinsic size in px. Below 16 the mark stops being legible. */
  readonly size?: number
  /** `auto` follows the theme: ink on paper, paper on ink. */
  readonly structure?: 'auto' | 'ink' | 'paper'
  /** `accent` is the brand default. `structure` is the one-ink version. */
  readonly core?: 'accent' | 'structure'
  /** `emerge` plays the load-in once. `think` loops the waiting animation. */
  readonly motion?: 'none' | 'emerge' | 'think'
  /** Draws the construction lines of the grid under the pieces. */
  readonly blueprint?: boolean
  /** Names the core as a docking slot for the travelling core. */
  readonly coreSlot?: string
  /** Give it a label only when the mark is the sole carrier of meaning. */
  readonly title?: string
  readonly id?: string
  readonly className?: string
}

/** Clockwise from top-left, the order the animations follow. */
const SATELLITES = [
  { x: 6, y: 6 },
  { x: 72, y: 6 },
  { x: 72, y: 72 },
  { x: 6, y: 72 },
] as const

/** Every edge of every piece, on the 100-unit grid. */
const GRID_LINES = [6, 28, 35, 65, 72, 94] as const

const STRUCTURE_COLOR = {
  auto: 'var(--on)',
  ink: '#0b0b0c',
  paper: '#ffffff',
} as const

const MOTION_CLASS = {
  none: '',
  emerge: 'mark-emerge',
  think: 'mark-think',
} as const

export function Mark({
  size = 24,
  structure = 'auto',
  core = 'accent',
  motion = 'none',
  blueprint = false,
  coreSlot,
  title,
  id,
  className = '',
}: MarkProps) {
  const structureColor = STRUCTURE_COLOR[structure]
  const coreColor = core === 'accent' ? 'var(--accent)' : structureColor
  const classes = [MOTION_CLASS[motion], className].filter(Boolean).join(' ')

  return (
    <svg
      id={id}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={classes || undefined}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {blueprint ? (
        <g data-piece="blueprint" fill="none" stroke="var(--on-muted)" strokeWidth={0.4}>
          <rect x={0.2} y={0.2} width={99.6} height={99.6} />
          {GRID_LINES.map((unit) => (
            <g key={unit}>
              <line x1={unit} y1={0} x2={unit} y2={100} />
              <line x1={0} y1={unit} x2={100} y2={unit} />
            </g>
          ))}
        </g>
      ) : null}
      {SATELLITES.map((satellite) => (
        <rect
          key={`${satellite.x}-${satellite.y}`}
          data-piece="satellite"
          x={satellite.x}
          y={satellite.y}
          width={22}
          height={22}
          fill={structureColor}
        />
      ))}
      <rect
        data-piece="core"
        data-core-slot={coreSlot}
        x={35}
        y={35}
        width={30}
        height={30}
        fill={coreColor}
      />
    </svg>
  )
}
