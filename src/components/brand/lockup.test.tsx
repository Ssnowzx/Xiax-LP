import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Lockup } from '@/components/brand/lockup'

describe('Lockup', () => {
  it('should set the wordmark beside the mark, uppercase, in the structure colour', () => {
    // ARRANGE
    const { container } = render(<Lockup size={40} />)

    // ACT
    const wordmark = screen.getByText('Xiax')
    const mark = container.querySelector('svg')

    // ASSERT
    expect(mark).not.toBeNull()
    expect(wordmark.className).toContain('uppercase')
    expect(wordmark.className).toContain('tracking-wordmark')
    expect(container.firstElementChild?.className).toContain('text-on')
  })

  it('should keep one satellite of gap between mark and name', () => {
    // ARRANGE
    const size = 100

    // ACT
    const { container } = render(<Lockup size={size} />)
    const gap = (container.firstElementChild as HTMLElement | null)?.style.gap

    // ASSERT
    expect(gap).toBe('22px')
  })
})
