import { describe, expect, it, vi } from 'vitest'

import type { SpamVerdict } from '@/types'
import { SIGNATURE_HEADER, deliverContact, parseContact, signBody } from '@/lib/contact'

const VALID = {
  name: 'Ana',
  email: 'ana@empresa.com.br',
  company: 'Empresa',
  front: 'gestao',
  message: 'Nossa operação roda em planilha e ninguém sabe o saldo do dia.',
}

describe('parseContact', () => {
  it('should accept a complete message', () => {
    // ARRANGE
    const input = VALID

    // ACT
    const result = parseContact(input)

    // ASSERT
    expect(result.status).toBe('ok')
  })

  it('should return one message per invalid field, in the reader\'s language', () => {
    // ARRANGE
    const input = { ...VALID, email: 'errado', message: 'curto' }

    // ACT
    const result = parseContact(input)

    // ASSERT
    expect(result.status).toBe('invalid')
    if (result.status === 'invalid') {
      expect(result.errors.email).toBe('Esse e-mail não parece válido.')
      expect(result.errors.message).toContain('Conte um pouco mais')
      expect(result.errors.name).toBeUndefined()
    }
  })

  it('should reject a front outside the four plus "não sei"', () => {
    // ARRANGE
    const input = { ...VALID, front: 'consultoria' }

    // ACT
    const result = parseContact(input)

    // ASSERT
    expect(result.status).toBe('invalid')
  })
})

describe('deliverContact', () => {
  const payload = { ...VALID, front: 'gestao' as const }
  const ham: SpamVerdict = { verdict: 'ham', score: 0, reasons: [] }
  const context = { address: '203.0.113.7', spam: ham }

  it('should report unconfigured when there is no webhook', async () => {
    // ARRANGE
    const webhookUrl = undefined

    // ACT
    const result = await deliverContact(payload, { ...context, webhookUrl })

    // ASSERT
    expect(result).toEqual({ status: 'failed', reason: 'unconfigured' })
  })

  it('should post JSON to the webhook and report sent on 2xx', async () => {
    // ARRANGE
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(null, { status: 200 }))

    // ACT
    const result = await deliverContact(payload, { ...context, webhookUrl: 'https://hooks.xiax.com.br/contato', fetchImpl })

    // ASSERT
    expect(result).toEqual({ status: 'sent' })
    const [url, init] = fetchImpl.mock.calls[0] ?? []
    expect(url).toBe('https://hooks.xiax.com.br/contato')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toMatchObject({
      name: 'Ana',
      source: 'xiax-site',
      address: '203.0.113.7',
      spam: ham,
    })
    expect(init?.headers).not.toHaveProperty(SIGNATURE_HEADER)
  })

  it('should sign the body when a secret is configured', async () => {
    // ARRANGE
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(null, { status: 200 }))
    const secret = 'uma-chave-longa-o-bastante'

    // ACT
    await deliverContact(payload, { ...context, webhookUrl: 'https://x.test', secret, fetchImpl })

    // ASSERT
    const init = fetchImpl.mock.calls[0]?.[1]
    const headers = init?.headers as Record<string, string>
    expect(headers[SIGNATURE_HEADER]).toBe(signBody(String(init?.body), secret))
    expect(headers[SIGNATURE_HEADER]).toMatch(/^sha256=[0-9a-f]{64}$/)
  })

  it('should report upstream failure on non-2xx or network error', async () => {
    // ARRANGE
    const failing = vi.fn<typeof fetch>(async () => new Response(null, { status: 500 }))
    const throwing = vi.fn<typeof fetch>(async () => {
      throw new Error('offline')
    })

    // ACT
    const onStatus = await deliverContact(payload, { ...context, webhookUrl: 'https://x.test', fetchImpl: failing })
    const onThrow = await deliverContact(payload, { ...context, webhookUrl: 'https://x.test', fetchImpl: throwing })

    // ASSERT
    expect(onStatus).toEqual({ status: 'failed', reason: 'upstream' })
    expect(onThrow).toEqual({ status: 'failed', reason: 'upstream' })
  })
})
