/** One cell of the grid drawn on a card, in px. */
const CELL = 32

interface PointerGridProps {
  /** Unique per instance: SVG patterns are addressed by id. */
  readonly id: string
}

/**
 * The engineering grid on a card's surface, visible only in a radius around
 * the pointer (the `.lean-grid` mask reads `--mx` and `--my`). Purely
 * decorative; the pointer logic lives in pointer-lean.ts.
 */
export function PointerGrid({ id }: PointerGridProps) {
  return (
    <svg className="lean-grid" aria-hidden="true">
      <defs>
        <pattern id={id} width={CELL} height={CELL} patternUnits="userSpaceOnUse">
          <path d={`M${CELL} 0H0V${CELL}`} fill="none" stroke="currentColor" strokeWidth={1} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
