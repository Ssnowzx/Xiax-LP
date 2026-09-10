'use server'

import { headers } from 'next/headers'

import type { ContactResult } from '@/types'
import { deliverContact, parseContact } from '@/lib/contact'
import { env } from '@/lib/env'
import { isRateLimited } from '@/lib/rate-limit'

/**
 * Receives the contact form. Validates, rate-limits by address, and hands the
 * message to Xiax's own endpoint. Nothing leaves for a third-party service.
 */
export async function sendContact(_previous: ContactResult, formData: FormData): Promise<ContactResult> {
  // A filled honeypot means a bot. Say "sent" and drop it.
  if (formData.get('website')) return { status: 'sent' }

  const parsed = parseContact({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company'),
    front: formData.get('front'),
    message: formData.get('message'),
  })
  if (parsed.status !== 'ok') return parsed

  const requestHeaders = await headers()
  const address = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(address)) return { status: 'failed', reason: 'rate-limited' }

  return deliverContact(parsed.payload, { webhookUrl: env.CONTACT_WEBHOOK_URL })
}
