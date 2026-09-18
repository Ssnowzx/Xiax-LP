import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ComparisonStage } from '@/components/sections/comparison-stage'
import { COMPARISON } from '@/content/comparison'

const COLUMNS = { market: 'Software sob encomenda', xiax: 'Xiax' }
const TABLE = { title: 'O que muda, lado a lado', lede: 'Os cinco pares juntos.' }

beforeEach(() => {
  // Reduced motion: the table is simply shown, complete.
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ComparisonStage', () => {
  it('should list every pair with both sentences', () => {
    // ARRANGE
    render(
      <ComparisonStage rows={COMPARISON} columns={COLUMNS} table={TABLE}>
        <h2>O que fazemos</h2>
      </ComparisonStage>,
    )

    // ACT
    const items = screen.getAllByRole('listitem')

    // ASSERT
    expect(items).toHaveLength(COMPARISON.length)
    for (const row of COMPARISON) {
      expect(screen.getByText(row.softwareHouse)).toBeInTheDocument()
      expect(screen.getByText(row.businessHouse)).toBeInTheDocument()
    }
  })

  it('should show the whole table read, with no card, when motion is reduced', () => {
    // ARRANGE
    const { container } = render(
      <ComparisonStage rows={COMPARISON} columns={COLUMNS} table={TABLE}>
        <h2>O que fazemos</h2>
      </ComparisonStage>,
    )

    // ACT
    const states = Array.from(container.querySelectorAll('[data-row]')).map((row) => row.getAttribute('data-state'))
    const wrap = container.querySelector('.compare')

    // ASSERT
    expect(states.every((state) => state === 'read')).toBe(true)
    expect(wrap).toHaveAttribute('data-open', 'false')
    expect(container.querySelector('.compare-card-body')).toBeNull()
  })
})
