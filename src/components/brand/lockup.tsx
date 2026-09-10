import { Loader } from '@/components/brand/loader'
import { Mark } from '@/components/brand/mark'

/**
 * Symbol left, wordmark right, separated by exactly one satellite (22u).
 * Wordmark is Archivo 700, uppercase, tracking 0.30em, always ink or paper.
 * Below 24px of symbol height the lockup breaks: use the bare Mark instead.
 */
interface LockupProps {
  readonly size?: number
  /** The manual's continuous orbit in place of the still mark. */
  readonly animated?: boolean
  readonly className?: string
}

export function Lockup({ size = 24, animated = false, className = '' }: LockupProps) {
  return (
    <span
      className={`inline-flex items-center text-on ${className}`}
      style={{ gap: size * 0.22 }}
    >
      {animated ? <Loader variant="orbit" size={size} /> : <Mark size={size} />}
      <span
        className="font-bold uppercase tracking-wordmark"
        style={{ fontSize: size * 0.72, lineHeight: 1 }}
      >
        Xiax
      </span>
    </span>
  )
}
