import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { PortfolioScreens } from '@/types'
import { ScreenViewer } from '@/components/sections/screen-viewer'

const SCREENS: PortfolioScreens = {
  screens: [
    {
      src: '/portfolio/exemplo-guias.jpg',
      width: 1600,
      height: 1000,
      alt: 'Primeira tela do sistema, com a lista de guias e os filtros.',
      label: 'Guias',
    },
    {
      src: '/portfolio/exemplo-automacoes.jpg',
      width: 1600,
      height: 1000,
      alt: 'Segunda tela do sistema, com as execuções das automações.',
      label: 'Automações',
    },
  ],
  source: 'exemplo.xiax.com.br',
  capturedAt: '2026-09-17',
  redacted: 'Nomes substituídos.',
}

class ObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', ObserverStub)
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ScreenViewer', () => {
  it('should open on the first screen and say where the screens come from', () => {
    // ARRANGE
    render(<ScreenViewer name="Sistema" screens={SCREENS} />)

    // ACT
    const first = screen.getByRole('tab', { name: 'Guias' })

    // ASSERT
    expect(first).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/exemplo\.xiax\.com\.br, 2026-09-17\. Nomes substituídos\./)).toBeInTheDocument()
  })

  it('should switch to the screen whose tab is clicked', () => {
    // ARRANGE
    render(<ScreenViewer name="Sistema" screens={SCREENS} />)

    // ACT
    fireEvent.click(screen.getByRole('tab', { name: 'Automações' }))

    // ASSERT
    expect(screen.getByRole('tab', { name: 'Automações' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Guias' })).toHaveAttribute('aria-selected', 'false')
  })

  it('should move between screens with the arrow keys and wrap around', () => {
    // ARRANGE
    render(<ScreenViewer name="Sistema" screens={SCREENS} />)
    const tablist = screen.getByRole('tablist')

    // ACT
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' })

    // ASSERT
    expect(screen.getByRole('tab', { name: 'Automações' })).toHaveAttribute('aria-selected', 'true')
  })
})
