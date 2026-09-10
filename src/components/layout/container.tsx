/**
 * Two widths, both from the brand grid: `page` is the full field, `reading` is the
 * text column at the centre. Nothing else gets a custom max-width.
 */
interface ContainerProps {
  readonly width?: 'page' | 'reading'
  readonly className?: string
  readonly children: React.ReactNode
}

export function Container({ width = 'page', className = '', children }: ContainerProps) {
  const max = width === 'reading' ? 'max-w-reading' : 'max-w-page'
  return <div className={`mx-auto w-full px-margin ${max} ${className}`}>{children}</div>
}
