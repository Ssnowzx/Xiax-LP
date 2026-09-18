'use server'

import { headers } from 'next/headers'

import type { ContactResult } from '@/types'
import type { MailChannel } from '@/lib/contact'
import { deliverContact, parseContact } from '@/lib/contact'
import { env } from '@/lib/env'
import { isRateLimited } from '@/lib/rate-limit'
import { assessSpam } from '@/lib/spam'

/** Milliseconds since the form appeared, when the browser ran the timer. */
function elapsedSince(startedAt: FormDataEntryValue | null): number | undefined {
  const started = Number(startedAt)
  return Number.isFinite(started) && started > 0 ? Date.now() - started : undefined
}

/** The SMTP channel, when user and password are set. The mailbox defaults to the public address. */
function mailChannel(): MailChannel | undefined {
  const to = env.CONTACT_TO_EMAIL ?? env.NEXT_PUBLIC_CONTACT_EMAIL
  if (!to || !env.CONTACT_SMTP_USER || !env.CONTACT_SMTP_PASS) return undefined
  return {
    to,
    account: { host: env.CONTACT_SMTP_HOST, port: env.CONTACT_SMTP_PORT, user: env.CONTACT_SMTP_USER, pass: env.CONTACT_SMTP_PASS },
  }
}

/**
 * Receives the contact form. Validates, rate-limits by address and by sender,
 * scores the message for spam, and hands it to Xiax's own endpoint and/or
 * mailbox. Nothing leaves for a third-party form service. Spam is answered as sent and dropped, so
 * the bot learns nothing.
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
  const sender = `email:${parsed.payload.email.toLowerCase()}`
  if (isRateLimited(address) || isRateLimited(sender)) return { status: 'failed', reason: 'rate-limited' }

  const spam = assessSpam(parsed.payload, { elapsedMs: elapsedSince(formData.get('startedAt')) })
  if (spam.verdict === 'spam') return { status: 'sent' }

  return deliverContact(parsed.payload, {
    webhookUrl: env.CONTACT_WEBHOOK_URL,
    secret: env.CONTACT_WEBHOOK_SECRET,
    mail: mailChannel(),
    address,
    spam,
  })
}
