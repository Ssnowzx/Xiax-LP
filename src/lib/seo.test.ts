import { describe, expect, it } from 'vitest'

import { organizationJsonLd, pageMetadata } from '@/lib/seo'

describe('pageMetadata', () => {
  it('should build a canonical URL and Open Graph block from the path', () => {
    // ARRANGE
    const input = { title: 'Contato', description: 'Conte a operação.', path: '/contato' }

    // ACT
    const meta = pageMetadata(input)

    // ASSERT
    expect(meta.alternates?.canonical).toBe('https://xiax.com.br/contato')
    expect(meta.openGraph?.locale).toBe('pt_BR')
    expect(meta.title).toBe('Contato')
  })
})

describe('organizationJsonLd', () => {
  it('should serialise a schema.org Organization pointing at the mark', () => {
    // ARRANGE
    const raw = organizationJsonLd()

    // ACT
    const parsed = JSON.parse(raw) as Record<string, unknown>

    // ASSERT
    expect(parsed['@type']).toBe('Organization')
    expect(parsed['logo']).toBe('https://xiax.com.br/brand/xiax-simbolo-principal.svg')
    expect(parsed['areaServed']).toBe('BR')
  })
})
