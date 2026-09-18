import { describe, expect, it } from 'vitest'

import { COMPANY } from '@/content/company'
import { COMPARISON } from '@/content/comparison'
import { FRONTS, FRONT_OPTIONS, findFront } from '@/content/fronts'
import { FORBIDDEN_CLAIMS } from '@/content/forbidden-claims'
import { METHOD } from '@/content/method'
import { PORTFOLIO, findPortfolioItem } from '@/content/portfolio'
import { PAGE_SECTIONS, findSection, sectionNumber } from '@/content/sections'

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, out))
  return out
}

describe('fronts', () => {
  it('should describe exactly four fronts with unique slugs', () => {
    // ARRANGE
    const slugs = FRONTS.map((front) => front.slug)

    // ACT
    const unique = new Set(slugs)

    // ASSERT
    expect(FRONTS).toHaveLength(4)
    expect(unique.size).toBe(4)
  })

  it('should find a front by slug and return undefined otherwise', () => {
    // ARRANGE
    const known = 'gestao'

    // ACT
    const found = findFront(known)
    const missing = findFront('inexistente')

    // ASSERT
    expect(found?.name).toBe('Sistemas de gestão')
    expect(missing).toBeUndefined()
  })

  it('should offer "não sei" first in the contact select', () => {
    // ARRANGE
    const first = FRONT_OPTIONS[0]

    // ACT
    const values = FRONT_OPTIONS.map((option) => option.value)

    // ASSERT
    expect(first?.value).toBe('nao-sei')
    expect(values).toHaveLength(5)
  })
})

describe('portfolio', () => {
  it('should only list systems that exist, with a valid front and built items', () => {
    // ARRANGE
    const frontSlugs = new Set(FRONTS.map((front) => front.slug))

    // ACT
    const invalid = PORTFOLIO.filter(
      (item) => !frontSlugs.has(item.front) || item.built.length === 0 || item.stack.length === 0,
    )

    // ASSERT
    expect(PORTFOLIO.length).toBeGreaterThan(0)
    expect(invalid).toEqual([])
  })

  it('should never name a client without authorisation', () => {
    // ARRANGE
    const clientOwned = PORTFOLIO.filter((item) => item.owner === 'client')

    // ACT
    const unauthorised = clientOwned.filter((item) => !item.clientNamed)

    // ASSERT
    expect(unauthorised).toEqual([])
  })

  it('should find a portfolio item by slug', () => {
    // ARRANGE
    const first = PORTFOLIO[0]

    // ACT
    const found = first ? findPortfolioItem(first.slug) : undefined

    // ASSERT
    expect(found).toBe(first)
    expect(findPortfolioItem('nada')).toBeUndefined()
  })
})

describe('voice', () => {
  it('should not use any forbidden claim anywhere in the copy', () => {
    // ARRANGE
    const copy = collectStrings([COMPANY, FRONTS, PORTFOLIO, METHOD, COMPARISON]).join('\n').toLowerCase()

    // ACT
    const used = FORBIDDEN_CLAIMS.filter((claim) => copy.includes(claim.toLowerCase()))

    // ASSERT
    expect(used).toEqual([])
  })

  it('should keep the signature in sentence case and out of uppercase', () => {
    // ARRANGE
    const signature = COMPANY.signature

    // ACT
    const isUppercase = signature === signature.toUpperCase()

    // ASSERT
    expect(isUppercase).toBe(false)
    expect(signature.endsWith('.')).toBe(true)
  })

  it('should keep exclamation marks out of the copy', () => {
    // ARRANGE
    const copy = collectStrings([COMPANY, FRONTS, PORTFOLIO, METHOD, COMPARISON]).join('\n')

    // ACT
    const exclamations = copy.split('!').length - 1

    // ASSERT
    expect(exclamations).toBe(0)
  })
})

describe('portfolio screens', () => {
  it('should describe every screen for people who cannot see it', () => {
    // ARRANGE
    const withImage = PORTFOLIO.filter((item) => item.screens !== undefined)

    // ACT
    const undescribed = withImage.filter((item) => item.screens?.screens.some((screen) => screen.alt.length < 20))

    // ASSERT
    expect(withImage.length).toBeGreaterThan(0)
    expect(undescribed).toEqual([])
  })
})

describe('page sections', () => {
  it('should number six sectors with unique ids and a brief for each', () => {
    // ARRANGE
    const ids = PAGE_SECTIONS.map((section) => section.id)

    // ACT
    const unique = new Set(ids)
    const shortBriefs = PAGE_SECTIONS.filter((section) => section.brief.length < 20)

    // ASSERT
    expect(PAGE_SECTIONS).toHaveLength(6)
    expect(unique.size).toBe(6)
    expect(shortBriefs).toEqual([])
  })

  it('should format positions as two-digit numbers and find a section by id', () => {
    // ARRANGE
    const id = 'no-ar'

    // ACT
    const found = findSection(id)

    // ASSERT
    expect(sectionNumber(0)).toBe('01')
    expect(found?.position).toBe(3)
    expect(found?.section.name).toBe('O que está no ar')
  })
})

describe('portfolio captures', () => {
  it('should say what was replaced whenever a real screen carried personal data', () => {
    // ARRANGE
    const gescon = findPortfolioItem('gestao-de-convenios')

    // ACT
    const note = gescon?.screens?.redacted

    // ASSERT
    expect(gescon?.state).toBe('production')
    expect(note).toMatch(/substituídos\.$/)
  })
})
