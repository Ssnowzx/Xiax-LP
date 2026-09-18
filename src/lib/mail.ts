import { createTransport } from 'nodemailer'

import type { ContactPayload, SpamVerdict } from '@/types'
import { FRONT_OPTIONS } from '@/content/fronts'

export interface SmtpAccount {
  readonly host: string
  readonly port: number
  /** Absent for a relay on the private network that takes mail without a login. */
  readonly auth?: { readonly user: string; readonly pass: string } | undefined
}

/** What goes out. Plain text only: the reader is Xiax, in a mail client. */
export interface ContactMail {
  readonly from: { readonly name: string; readonly address: string }
  readonly to: string
  readonly replyTo: { readonly name: string; readonly address: string }
  readonly subject: string
  readonly text: string
}

interface ComposeOptions {
  readonly to: string
  readonly fromAddress: string
  readonly address: string
  readonly spam: SpamVerdict
  readonly receivedAt: Date
}

function frontLabel(value: ContactPayload['front']): string {
  return FRONT_OPTIONS.find((option) => option.value === value)?.label ?? value
}

/** The message as Xiax reads it: who wrote, from where, and the text as typed. */
export function composeContactMail(payload: ContactPayload, options: ComposeOptions): ContactMail {
  const flag = options.spam.verdict === 'suspect' ? '[suspeito] ' : ''
  const received = options.receivedAt.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  const text = [
    `Nome: ${payload.name}`,
    `Empresa: ${payload.company}`,
    `E-mail: ${payload.email}`,
    `Frente: ${frontLabel(payload.front)}`,
    `Recebida em: ${received}`,
    `Origem: ${options.address} · filtro: ${options.spam.verdict} (${options.spam.score})${
      options.spam.reasons.length > 0 ? ` · ${options.spam.reasons.join(', ')}` : ''
    }`,
    '',
    'O que trava hoje:',
    payload.message,
    '',
    'Responda a este e-mail para falar com a pessoa.',
  ].join('\n')

  return {
    from: { name: 'Site da Xiax', address: options.fromAddress },
    to: options.to,
    replyTo: { name: payload.name, address: payload.email },
    subject: `${flag}Mensagem do site: ${payload.name} (${payload.company})`,
    text,
  }
}

/** A relay that never answers must not hold the form open. */
const CONNECTION_TIMEOUT_MS = 8000
const SOCKET_TIMEOUT_MS = 15000

/**
 * Sends through the configured SMTP server. Throws when the server refuses or
 * goes quiet. Port 465 is implicit TLS; an unauthenticated relay is spoken to
 * in plain text, because it lives on the same machine or private network.
 */
export async function sendContactMail(mail: ContactMail, account: SmtpAccount): Promise<void> {
  const transport = createTransport({
    host: account.host,
    port: account.port,
    secure: account.port === 465,
    connectionTimeout: CONNECTION_TIMEOUT_MS,
    greetingTimeout: CONNECTION_TIMEOUT_MS,
    socketTimeout: SOCKET_TIMEOUT_MS,
    ...(account.auth ? { auth: account.auth } : { ignoreTLS: true }),
  })
  try {
    await transport.sendMail(mail)
  } finally {
    transport.close()
  }
}
