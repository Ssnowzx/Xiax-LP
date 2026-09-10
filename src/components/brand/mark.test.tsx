import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Mark } from '@/components/brand/mark'

describe('Mark', () => {
  it('should draw four satellites and one core on the manual geometry', () => {
    // ARRANGE
    const { container } = render(<Mark />)

    // ACT
    const satellites = container.querySelectorAll('rect[data-piece="satellite"]')
    const core = container.querySelector('rect[data-piece="core"]')

    // ASSERT
    expect(satellites).toHaveLength(4)
    expect(core?.getAttribute('x')).toBe('35')
    expect(core?.getAttribute('width')).toBe('30')
    expect(satellites[0]?.getAttribute('width')).toBe('22')
  })

  it('should keep colour only in the core', () => {
    // ARRANGE
    const { container } = render(<Mark />)

    // ACT
    const satelliteFill = container.querySelector('rect[data-piece="satellite"]')?.getAttribute('fill')
    const coreFill = container.querySelector('rect[data-piece="core"]')?.getAttribute('fill')

    // ASSERT
    expect(satelliteFill).toBe('var(--on)')
    expect(coreFill).toBe('var(--accent)')
  })

  it('should paint the core in the structure colour for one-ink use', () => {
    // ARRANGE
    const { container } = render(<Mark structure="paper" core="structure" />)

    // ACT
    const coreFill = container.querySelector('rect[data-piece="core"]')?.getAttribute('fill')

    // ASSERT
    expect(coreFill).toBe('#ffffff')
  })

  it('should be decorative unless given a title', () => {
    // ARRANGE
    const decorative = render(<Mark />)
    const labelled = render(<Mark title="Símbolo da Xiax" />)

    // ACT
    const decorativeSvg = decorative.container.querySelector('svg')
    const labelledSvg = labelled.container.querySelector('svg')

    // ASSERT
    expect(decorativeSvg?.getAttribute('aria-hidden')).toBe('true')
    expect(labelledSvg?.getAttribute('role')).toBe('img')
    expect(labelledSvg?.querySelector('title')?.textContent).toBe('Símbolo da Xiax')
  })

  it('should attach the motion class only when asked', () => {
    // ARRANGE
    const still = render(<Mark />)
    const emerging = render(<Mark motion="emerge" />)

    // ACT
    const stillClass = still.container.querySelector('svg')?.getAttribute('class')
    const emergingClass = emerging.container.querySelector('svg')?.getAttribute('class')

    // ASSERT
    expect(stillClass).toBeNull()
    expect(emergingClass).toBe('mark-emerge')
  })
})

describe('Mark extras', () => {
  it('should draw the construction grid only when asked', () => {
    // ARRANGE
    const plain = render(<Mark />)
    const drawn = render(<Mark blueprint />)

    // ACT
    const plainLines = plain.container.querySelectorAll('[data-piece="blueprint"] line')
    const drawnLines = drawn.container.querySelectorAll('[data-piece="blueprint"] line')

    // ASSERT
    expect(plainLines).toHaveLength(0)
    expect(drawnLines).toHaveLength(12)
  })

  it('should name the core as a docking slot when asked', () => {
    // ARRANGE
    const { container } = render(<Mark coreSlot="hero" id="hero-mark" />)

    // ACT
    const core = container.querySelector('rect[data-piece="core"]')

    // ASSERT
    expect(core?.getAttribute('data-core-slot')).toBe('hero')
    expect(container.querySelector('svg')?.id).toBe('hero-mark')
  })
})
