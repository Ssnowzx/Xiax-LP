import { z } from 'zod'

/**
 * Environment contract. The build fails loudly instead of shipping a site that
 * silently points at nothing. Empty strings count as unset, because container
 * runtimes pass "" for variables that were declared but never filled.
 */
const optional = <T extends z.ZodTypeAny>(inner: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), inner.optional())

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://xiax.com.br'),
  /** Shown as a fallback when the form cannot send. Omit to hide it. */
  NEXT_PUBLIC_CONTACT_EMAIL: optional(z.string().email()),
  /** Where the contact form posts. Xiax's own endpoint, never a third-party SaaS. */
  CONTACT_WEBHOOK_URL: optional(z.string().url()),
  /** Shared secret; when set, every webhook body is signed with HMAC-SHA256. */
  CONTACT_WEBHOOK_SECRET: optional(z.string().min(16)),
  /** Mailbox that receives the form. Falls back to the public contact e-mail. */
  CONTACT_TO_EMAIL: optional(z.string().email()),
  /**
   * SMTP server the site sends through. A host alone means an open relay on the
   * private network (postfix on the VPS); user and password add authentication
   * (Gmail app password). Either one turns e-mail delivery on.
   */
  CONTACT_SMTP_HOST: optional(z.string().min(1)),
  CONTACT_SMTP_PORT: optional(z.coerce.number().int().positive()),
  CONTACT_SMTP_USER: optional(z.string().min(1)),
  CONTACT_SMTP_PASS: optional(z.string().min(1)),
  /** Sender shown on the e-mail. Defaults to the SMTP user, then to site@<site host>. */
  CONTACT_FROM_EMAIL: optional(z.string().email()),
})

export type Env = z.infer<typeof schema>

export const env: Env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  CONTACT_WEBHOOK_URL: process.env.CONTACT_WEBHOOK_URL,
  CONTACT_WEBHOOK_SECRET: process.env.CONTACT_WEBHOOK_SECRET,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  CONTACT_SMTP_HOST: process.env.CONTACT_SMTP_HOST,
  CONTACT_SMTP_PORT: process.env.CONTACT_SMTP_PORT,
  CONTACT_SMTP_USER: process.env.CONTACT_SMTP_USER,
  // Google shows app passwords in groups of four; the spaces are not part of the secret.
  CONTACT_SMTP_PASS: process.env.CONTACT_SMTP_PASS?.replace(/\s+/g, ''),
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
})
