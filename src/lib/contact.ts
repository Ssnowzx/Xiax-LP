import { createHmac } from 'node:crypto'

import { z } from 'zod'

import type { ContactPayload, ContactResult, SpamVerdict } from '@/types'

const FRONT_VALUES = ['plataformas', 'gestao', 'automacao', 'produtos', 'nao-sei'] as const

/** Field errors are written for the person filling the form, not for the log. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Diga como devemos te chamar.').max(120, 'Nome longo demais.'),
  email: z.string().trim().email('Esse e-mail não parece válido.').max(200),
  company: z.string().trim().min(2, 'Qual é a empresa?').max(160, 'Nome longo demais.'),
  front: z.enum(FRONT_VALUES, { message: 'Escolha uma opção.' }),
  message: z
    .string()
    .trim()
    .min(20, 'Conte um pouco mais: o que trava hoje?')
    .max(4000, 'Resuma em até 4.000 caracteres.'),
})

export function parseContact(input: unknown): ContactResult | { status: 'ok'; payload: ContactPayload } {
  const parsed = contactSchema.safeParse(input)
  if (parsed.success) return { status: 'ok', payload: parsed.data }

  const errors: Partial<Record<keyof ContactPayload, string>> = {}
  for (const issue of parsed.error.issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && field in contactSchema.shape) {
      const key = field as keyof ContactPayload
      if (!errors[key]) errors[key] = issue.message
    }
  }
  return { status: 'invalid', errors }
}

interface DeliverOptions {
  readonly webhookUrl: string | undefined
  /** Shared with the endpoint. When set, the body is signed so the endpoint can refuse anything else. */
  readonly secret?: string | undefined
  /** Address the message came from, for the endpoint to filter or block. */
  readonly address: string
  readonly spam: SpamVerdict
  readonly fetchImpl?: typeof fetch
}

export const SIGNATURE_HEADER = 'x-xiax-signature'

/** HMAC-SHA256 of the raw body, hex, prefixed like GitHub and Stripe do. */
export function signBody(body: string, secret: string): string {
  return `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`
}

/** Posts the message to Xiax's own endpoint. No third-party form service. */
export async function deliverContact(
  payload: ContactPayload,
  { webhookUrl, secret, address, spam, fetchImpl = fetch }: DeliverOptions,
): Promise<ContactResult> {
  if (!webhookUrl) return { status: 'failed', reason: 'unconfigured' }

  const body = JSON.stringify({ ...payload, receivedAt: new Date().toISOString(), source: 'xiax-site', address, spam })
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (secret) headers[SIGNATURE_HEADER] = signBody(body, secret)

  try {
    const response = await fetchImpl(webhookUrl, { method: 'POST', headers, body })
    return response.ok ? { status: 'sent' } : { status: 'failed', reason: 'upstream' }
  } catch {
    return { status: 'failed', reason: 'upstream' }
  }
}
