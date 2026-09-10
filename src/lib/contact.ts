import { z } from 'zod'

import type { ContactPayload, ContactResult } from '@/types'

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
  readonly fetchImpl?: typeof fetch
}

/** Posts the message to Xiax's own endpoint. No third-party form service. */
export async function deliverContact(
  payload: ContactPayload,
  { webhookUrl, fetchImpl = fetch }: DeliverOptions,
): Promise<ContactResult> {
  if (!webhookUrl) return { status: 'failed', reason: 'unconfigured' }

  try {
    const response = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString(), source: 'xiax-site' }),
    })
    return response.ok ? { status: 'sent' } : { status: 'failed', reason: 'upstream' }
  } catch {
    return { status: 'failed', reason: 'upstream' }
  }
}
