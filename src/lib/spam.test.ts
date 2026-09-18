import { beforeEach, describe, expect, it } from 'vitest'

import type { ContactPayload } from '@/types'
import { assessSpam, resetSpamMemory } from '@/lib/spam'

const LEAD: ContactPayload = {
  name: 'Ana Souza',
  email: 'ana@empresa.com.br',
  company: 'Empresa',
  front: 'gestao',
  message: 'Nossa operação roda em planilha e ninguém sabe o saldo do dia. Queremos conversar.',
}
const TYPED = { elapsedMs: 45_000 }

describe('assessSpam', () => {
  beforeEach(() => {
    resetSpamMemory()
  })

  it('should deliver a normal lead untouched', () => {
    // ARRANGE
    const payload = LEAD

    // ACT
    const result = assessSpam(payload, TYPED)

    // ASSERT
    expect(result).toEqual({ verdict: 'ham', score: 0, reasons: [] })
  })

  it('should not drop a message on one weak signal alone', () => {
    // ARRANGE
    const payload = { ...LEAD, message: `${LEAD.message} O sistema atual é o painel.com.br.` }

    // ACT
    const result = assessSpam(payload, { elapsedMs: undefined })

    // ASSERT
    expect(result.verdict).toBe('suspect')
    expect(result.reasons).toEqual(['no-timer', 'link'])
  })

  it('should drop a submit that arrives seconds after the form appeared', () => {
    // ARRANGE
    const payload = { ...LEAD, message: `${LEAD.message} Veja www.exemplo.com` }

    // ACT
    const result = assessSpam(payload, { elapsedMs: 800 })

    // ASSERT
    expect(result.verdict).toBe('spam')
    expect(result.reasons).toContain('too-fast')
  })

  it('should drop a message full of links or markup', () => {
    // ARRANGE
    const links = { ...LEAD, message: 'Check https://a.example and https://b.example for the best offer today.' }
    const markup = { ...LEAD, message: 'Great deal here <a href="https://x.example">click</a> and enjoy it now.' }

    // ACT
    const onLinks = assessSpam(links, TYPED)
    const onMarkup = assessSpam(markup, TYPED)

    // ASSERT
    expect(onLinks.verdict).toBe('spam')
    expect(onMarkup.verdict).toBe('spam')
    expect(onMarkup.reasons).toEqual(expect.arrayContaining(['link', 'markup']))
  })

  it('should drop a message written mostly outside the Latin alphabet', () => {
    // ARRANGE
    const payload = { ...LEAD, message: 'Предлагаем услуги продвижения сайтов и рекламы для вашего бизнеса.' }

    // ACT
    const result = assessSpam(payload, TYPED)

    // ASSERT
    expect(result.verdict).toBe('spam')
    expect(result.reasons).toContain('foreign-script')
  })

  it('should drop the classic sales pitch', () => {
    // ARRANGE
    const payload = {
      ...LEAD,
      name: 'Robert4',
      message: 'Dear sir, we offer SEO and backlinks to put your website on the first page of Google.',
    }

    // ACT
    const result = assessSpam(payload, TYPED)

    // ASSERT
    expect(result.verdict).toBe('spam')
    expect(result.reasons).toEqual(expect.arrayContaining(['sales-pitch', 'heavy-pitch', 'odd-name']))
  })

  it('should flag a disposable sender address', () => {
    // ARRANGE
    const payload = { ...LEAD, email: 'x@mailinator.com' }

    // ACT
    const result = assessSpam(payload, TYPED)

    // ASSERT
    expect(result.verdict).toBe('suspect')
    expect(result.reasons).toEqual(['disposable-email'])
  })

  it('should remember a message body and count it again inside a day, whoever sends it', () => {
    // ARRANGE
    const now = 1_000
    assessSpam(LEAD, TYPED, now)

    // ACT
    const again = assessSpam({ ...LEAD, email: 'outro@empresa.com.br' }, { elapsedMs: 1000 }, now + 60_000)
    const nextDay = assessSpam(LEAD, TYPED, now + 25 * 60 * 60 * 1000)

    // ASSERT
    expect(again.verdict).toBe('spam')
    expect(again.reasons).toEqual(['too-fast', 'repeated'])
    expect(nextDay.reasons).not.toContain('repeated')
  })
})
