import Link from 'next/link'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary'

/**
 * The primary button is the only interface element painted in the accent:
 * on a page, it marks where the action is, the way the core marks where the
 * intelligence is. One per view.
 */
const VARIANT_CLASS: Readonly<Record<Variant, string>> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
}

const BASE_CLASS = 'btn'

interface ButtonLinkProps {
  readonly href: string
  readonly variant?: Variant
  /** Names the link as a docking slot: the travelling core lands on the action. */
  readonly coreSlot?: string
  readonly children: ReactNode
  readonly className?: string
}

export function ButtonLink({ href, variant = 'secondary', coreSlot, children, className = '' }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      data-core-slot={coreSlot}
      className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${coreSlot ? 'core-slot' : ''} ${className}`}
    >
      {children}
    </Link>
  )
}

interface ButtonProps {
  readonly type?: 'submit' | 'button'
  readonly variant?: Variant
  readonly disabled?: boolean
  /** Names the button as a docking slot: the travelling core lands on the action. */
  readonly coreSlot?: string
  readonly children: ReactNode
  readonly className?: string
}

export function Button({
  type = 'button',
  variant = 'primary',
  disabled = false,
  coreSlot,
  children,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      data-core-slot={coreSlot}
      className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${coreSlot ? 'core-slot' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
