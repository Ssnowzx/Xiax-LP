import { describe, expect, it, vi } from 'vitest'

import { deliverContact, parseContact } from '@/lib/contact'

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

  it('should report unconfigured when there is no webhook', async () => {
    // ARRANGE
    const webhookUrl = undefined

    // ACT
    const result = await deliverContact(payload, { webhookUrl })

    // ASSERT
    expect(result).toEqual({ status: 'failed', reason: 'unconfigured' })
  })

  it('should post JSON to the webhook and report sent on 2xx', async () => {
    // ARRANGE
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(null, { status: 200 }))

    // ACT
    const result = await deliverContact(payload, { webhookUrl: 'https://hooks.xiax.com.br/contato', fetchImpl })

    // ASSERT
    expect(result).toEqual({ status: 'sent' })
    const [url, init] = fetchImpl.mock.calls[0] ?? []
    expect(url).toBe('https://hooks.xiax.com.br/contato')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toMatchObject({ name: 'Ana', source: 'xiax-site' })
  })

  it('should report upstream failure on non-2xx or network error', async () => {
    // ARRANGE
    const failing = vi.fn<typeof fetch>(async () => new Response(null, { status: 500 }))
    const throwing = vi.fn<typeof fetch>(async () => {
      throw new Error('offline')
    })

    // ACT
    const onStatus = await deliverContact(payload, { webhookUrl: 'https://x.test', fetchImpl: failing })
    const onThrow = await deliverContact(payload, { webhookUrl: 'https://x.test', fetchImpl: throwing })

    // ASSERT
    expect(onStatus).toEqual({ status: 'failed', reason: 'upstream' })
    expect(onThrow).toEqual({ status: 'failed', reason: 'upstream' })
  })
})
