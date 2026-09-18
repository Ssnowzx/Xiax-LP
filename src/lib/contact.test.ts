import { describe, expect, it, vi } from 'vitest'

import type { SpamVerdict } from '@/types'
import type { ContactMail, SmtpAccount } from '@/lib/mail'
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

  it('should send back what was typed, so the form is refilled and not emptied', () => {
    // ARRANGE
    const input = { ...VALID, message: 'curto' }

    // ACT
    const result = parseContact(input)

    // ASSERT
    expect(result.status).toBe('invalid')
    if (result.status === 'invalid') {
      expect(result.values).toEqual({
        name: 'Ana',
        email: 'ana@empresa.com.br',
        company: 'Empresa',
        front: 'gestao',
        message: 'curto',
      })
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

  const mail = {
    to: 'xiaxdesenvolvimento@gmail.com',
    from: 'xiaxdesenvolvimento@gmail.com',
    account: { host: 'smtp.gmail.com', port: 465, auth: { user: 'xiaxdesenvolvimento@gmail.com', pass: 'segredo' } },
  }

  it('should report unconfigured when there is neither webhook nor mailbox', async () => {
    // ARRANGE
    const webhookUrl = undefined

    // ACT
    const result = await deliverContact(payload, { ...context, webhookUrl })

    // ASSERT
    expect(result).toEqual({ status: 'failed', reason: 'unconfigured', values: payload })
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
    expect(onStatus).toEqual({ status: 'failed', reason: 'upstream', values: payload })
    expect(onThrow).toEqual({ status: 'failed', reason: 'upstream', values: payload })
  })

  type SendMail = (mail: ContactMail, account: SmtpAccount) => Promise<void>

  it('should send the e-mail through the SMTP account and report sent', async () => {
    // ARRANGE
    const sendMailImpl = vi.fn<SendMail>(async () => undefined)

    // ACT
    const result = await deliverContact(payload, { ...context, webhookUrl: undefined, mail, sendMailImpl })

    // ASSERT
    expect(result).toEqual({ status: 'sent' })
    const [composed, account] = sendMailImpl.mock.calls[0] ?? []
    expect(account).toBe(mail.account)
    expect(composed?.to).toBe('xiaxdesenvolvimento@gmail.com')
    expect(composed?.replyTo.address).toBe('ana@empresa.com.br')
    expect(composed?.text).toContain('Origem: 203.0.113.7')
  })

  it('should report sent when the e-mail goes out even if the webhook fails', async () => {
    // ARRANGE
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(null, { status: 500 }))
    const sendMailImpl = vi.fn<SendMail>(async () => undefined)

    // ACT
    const result = await deliverContact(payload, { ...context, webhookUrl: 'https://x.test', mail, fetchImpl, sendMailImpl })

    // ASSERT
    expect(result).toEqual({ status: 'sent' })
    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(sendMailImpl).toHaveBeenCalledOnce()
  })

  it('should report upstream failure when the SMTP server refuses', async () => {
    // ARRANGE
    const sendMailImpl = vi.fn<SendMail>(async () => {
      throw new Error('535 auth failed')
    })

    // ACT
    const result = await deliverContact(payload, { ...context, webhookUrl: undefined, mail, sendMailImpl })

    // ASSERT
    expect(result).toEqual({ status: 'failed', reason: 'upstream', values: payload })
  })
})
