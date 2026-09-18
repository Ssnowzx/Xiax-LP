import { describe, expect, it } from 'vitest'

import type { ContactPayload, SpamVerdict } from '@/types'
import { composeContactMail } from '@/lib/mail'

const PAYLOAD: ContactPayload = {
  name: 'Ana',
  email: 'ana@empresa.com.br',
  company: 'Empresa',
  front: 'gestao',
  message: 'Nossa operação roda em planilha e ninguém sabe o saldo do dia.',
}

const HAM: SpamVerdict = { verdict: 'ham', score: 0, reasons: [] }

const OPTIONS = {
  to: 'xiaxdesenvolvimento@gmail.com',
  fromAddress: 'xiaxdesenvolvimento@gmail.com',
  address: '203.0.113.7',
  receivedAt: new Date('2026-09-18T15:00:00Z'),
}

describe('composeContactMail', () => {
  it('should address the mailbox and reply to the person who wrote', () => {
    // ARRANGE
    const options = { ...OPTIONS, spam: HAM }

    // ACT
    const mail = composeContactMail(PAYLOAD, options)

    // ASSERT
    expect(mail.to).toBe('xiaxdesenvolvimento@gmail.com')
    expect(mail.from.address).toBe('xiaxdesenvolvimento@gmail.com')
    expect(mail.replyTo).toEqual({ name: 'Ana', address: 'ana@empresa.com.br' })
    expect(mail.subject).toBe('Mensagem do site: Ana (Empresa)')
  })

  it('should carry every field, the front by its label and the message as typed', () => {
    // ARRANGE
    const options = { ...OPTIONS, spam: HAM }

    // ACT
    const { text } = composeContactMail(PAYLOAD, options)

    // ASSERT
    expect(text).toContain('Nome: Ana')
    expect(text).toContain('Empresa: Empresa')
    expect(text).toContain('E-mail: ana@empresa.com.br')
    expect(text).toMatch(/Frente: (?!gestao)/)
    expect(text).toContain('Origem: 203.0.113.7 · filtro: ham (0)')
    expect(text).toContain(PAYLOAD.message)
  })

  it('should flag a suspect message in the subject and list the reasons', () => {
    // ARRANGE
    const suspect: SpamVerdict = { verdict: 'suspect', score: 4, reasons: ['link', 'too-fast'] }

    // ACT
    const mail = composeContactMail(PAYLOAD, { ...OPTIONS, spam: suspect })

    // ASSERT
    expect(mail.subject).toMatch(/^\[suspeito\] /)
    expect(mail.text).toContain('filtro: suspect (4) · link, too-fast')
  })
})
