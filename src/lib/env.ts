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
})

export type Env = z.infer<typeof schema>

export const env: Env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  CONTACT_WEBHOOK_URL: process.env.CONTACT_WEBHOOK_URL,
})
