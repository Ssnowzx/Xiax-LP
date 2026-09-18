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
  /** SMTP account the site sends from. User and password together turn e-mail delivery on. */
  CONTACT_SMTP_HOST: z.string().min(1).default('smtp.gmail.com'),
  CONTACT_SMTP_PORT: z.coerce.number().int().positive().default(465),
  CONTACT_SMTP_USER: optional(z.string().min(1)),
  CONTACT_SMTP_PASS: optional(z.string().min(1)),
})

export type Env = z.infer<typeof schema>

export const env: Env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  CONTACT_WEBHOOK_URL: process.env.CONTACT_WEBHOOK_URL,
  CONTACT_WEBHOOK_SECRET: process.env.CONTACT_WEBHOOK_SECRET,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  CONTACT_SMTP_HOST: process.env.CONTACT_SMTP_HOST || undefined,
  CONTACT_SMTP_PORT: process.env.CONTACT_SMTP_PORT || undefined,
  CONTACT_SMTP_USER: process.env.CONTACT_SMTP_USER,
  // Google shows app passwords in groups of four; the spaces are not part of the secret.
  CONTACT_SMTP_PASS: process.env.CONTACT_SMTP_PASS?.replace(/\s+/g, ''),
})
