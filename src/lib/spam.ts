import { createHash } from 'node:crypto'

import type { ContactPayload, SpamReason, SpamVerdict } from '@/types'

/**
 * Server-side spam filter for the contact form. No third-party service: each
 * signal adds points and the total decides whether the message is delivered,
 * delivered flagged, or dropped. Only a strong signal (a wall of links, markup,
 * another alphabet) drops a message on its own; the weak ones need company,
 * because losing one real lead costs more than reading one piece of spam.
 */

const SPAM_AT = 4
const SUSPECT_AT = 2
/** A person needs at least this long to read the form and type a message. */
const MIN_ELAPSED_MS = 3000
/** How long a message body is remembered to catch the same text sent again. */
const REPEAT_WINDOW_MS = 24 * 60 * 60 * 1000
const REPEAT_MEMORY_LIMIT = 5000

const WEIGHTS: Readonly<Record<SpamReason, number>> = {
  'too-fast': 3,
  'no-timer': 1,
  link: 1,
  'many-links': 4,
  'link-in-identity': 4,
  markup: 4,
  'foreign-script': 4,
  shouting: 1,
  'sales-pitch': 2,
  'heavy-pitch': 2,
  'odd-name': 1,
  'disposable-email': 2,
  repeated: 3,
}

const URL_PATTERN =
  /(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(?:com|net|org|io|ru|cn|xyz|info|biz|top|site|online|shop|club|link|br)\b/gi
const MARKUP_PATTERN = /<[a-z][^>]*>|\[url[=\]]|\[link[=\]]/i

/** Classic unsolicited offers, in the two languages they arrive in. Whole words only. */
const PITCH_TERMS = [
  'seo',
  'backlink',
  'backlinks',
  'guest post',
  'link building',
  'first page of google',
  'ranking on google',
  'web traffic',
  'website owner',
  'dear sir',
  'dear madam',
  'casino',
  'viagra',
  'cialis',
  'crypto',
  'bitcoin',
  'forex',
  'loan',
  'renda extra',
  'ganhe dinheiro',
  'divulgação em massa',
  'lista de e-mails',
  'disparo em massa',
]
const PITCH_PATTERN = new RegExp(`\\b(?:${PITCH_TERMS.join('|')})\\b`, 'i')
const PITCH_PATTERN_ALL = new RegExp(PITCH_PATTERN.source, 'gi')

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'yopmail.com',
  'sharklasers.com',
  'trashmail.com',
  'getnada.com',
  'dispostable.com',
])

export interface SpamSignals {
  /** Milliseconds between the form appearing and the submit. Undefined when the browser sent none. */
  readonly elapsedMs?: number | undefined
}

const seenMessages = new Map<string, number>()

function fingerprint(message: string): string {
  const normalised = message.toLowerCase().replace(/\s+/g, ' ').trim()
  return createHash('sha256').update(normalised).digest('hex')
}

/** Remembers the message and says whether the same text arrived inside the window. */
function isRepeated(message: string, now: number): boolean {
  if (seenMessages.size >= REPEAT_MEMORY_LIMIT) {
    for (const [key, expiresAt] of seenMessages) if (expiresAt <= now) seenMessages.delete(key)
  }
  const key = fingerprint(message)
  const expiresAt = seenMessages.get(key)
  seenMessages.set(key, now + REPEAT_WINDOW_MS)
  return expiresAt !== undefined && expiresAt > now
}

function timingReasons({ elapsedMs }: SpamSignals): SpamReason[] {
  if (elapsedMs === undefined) return ['no-timer']
  return elapsedMs < MIN_ELAPSED_MS ? ['too-fast'] : []
}

function linkReasons({ name, company, message }: ContactPayload): SpamReason[] {
  const reasons: SpamReason[] = []
  const links = message.match(URL_PATTERN)?.length ?? 0
  if (links >= 2) reasons.push('many-links')
  else if (links === 1) reasons.push('link')
  if (URL_PATTERN.test(name) || URL_PATTERN.test(company)) reasons.push('link-in-identity')
  URL_PATTERN.lastIndex = 0
  if (MARKUP_PATTERN.test(message)) reasons.push('markup')
  return reasons
}

function scriptReasons(message: string): SpamReason[] {
  const letters = message.match(/\p{L}/gu) ?? []
  if (letters.length < 10) return []
  const reasons: SpamReason[] = []
  const latin = letters.filter((letter) => /\p{Script=Latin}/u.test(letter)).length
  if (1 - latin / letters.length > 0.3) reasons.push('foreign-script')
  const upper = letters.filter((letter) => letter !== letter.toLowerCase()).length
  if (letters.length >= 20 && upper / letters.length > 0.6) reasons.push('shouting')
  return reasons
}

function contentReasons({ name, email, message }: ContactPayload): SpamReason[] {
  const reasons: SpamReason[] = []
  const pitches = message.match(PITCH_PATTERN_ALL)?.length ?? 0
  if (pitches >= 1) reasons.push('sales-pitch')
  if (pitches >= 2) reasons.push('heavy-pitch')
  if (/\d/.test(name) || !/[aeiouyáéíóúãõâêô]/i.test(name)) reasons.push('odd-name')
  const domain = email.toLowerCase().split('@')[1] ?? ''
  if (DISPOSABLE_DOMAINS.has(domain)) reasons.push('disposable-email')
  return reasons
}

/**
 * Scores a validated message. Remembers its text so the same body sent again
 * inside 24 hours counts against it, whoever sends it.
 */
export function assessSpam(payload: ContactPayload, signals: SpamSignals, now: number = Date.now()): SpamVerdict {
  const reasons: SpamReason[] = [
    ...timingReasons(signals),
    ...linkReasons(payload),
    ...scriptReasons(payload.message),
    ...contentReasons(payload),
  ]
  if (isRepeated(payload.message, now)) reasons.push('repeated')

  const score = reasons.reduce((total, reason) => total + WEIGHTS[reason], 0)
  const verdict = score >= SPAM_AT ? 'spam' : score >= SUSPECT_AT ? 'suspect' : 'ham'
  return { verdict, score, reasons }
}

/** Test seam. Never called by application code. */
export function resetSpamMemory(): void {
  seenMessages.clear()
}
