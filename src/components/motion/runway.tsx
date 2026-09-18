import { forwardRef } from 'react'

interface RunwayProps {
  /** One stop per step. */
  readonly count: number
  /** Only a wide screen without reduced motion has a runway at all. */
  readonly active: boolean
  readonly className?: string
}

/**
 * The runway a pinned stage travels along: an intro, one snap stop per step
 * and an outro, all empty. It is a real element rather than padding because
 * a sticky element only moves inside its parent's content box. Sizes live in
 * CSS (`--stop`, `--intro`, `--outro`); `useRunway` reads the stops.
 */
export const Runway = forwardRef<HTMLDivElement, RunwayProps>(function Runway({ count, active, className = '' }, ref) {
  return (
    <div ref={ref} className={`runway ${className}`} data-active={active} aria-hidden="true">
      <div className="runway-stop runway-intro" />
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="runway-stop" data-stop={index} />
      ))}
      <div className="runway-stop runway-outro" />
    </div>
  )
})
