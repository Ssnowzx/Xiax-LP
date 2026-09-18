import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FrontsStage } from '@/components/sections/fronts-stage'
import { FRONTS } from '@/content/fronts'

beforeEach(() => {
  // Reduced motion: the four fronts simply stand in place.
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('FrontsStage', () => {
  it('should show all four fronts in place when motion is reduced', () => {
    // ARRANGE
    const { container } = render(<FrontsStage />)

    // ACT
    const states = Array.from(container.querySelectorAll('.front-cell')).map((cell) => cell.getAttribute('data-state'))

    // ASSERT
    expect(states).toHaveLength(FRONTS.length)
    expect(states.every((state) => state === 'arrived')).toBe(true)
    for (const front of FRONTS) expect(screen.getByRole('heading', { name: front.name })).toBeInTheDocument()
  })
})
