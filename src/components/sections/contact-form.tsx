'use client'

import { useActionState, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import type { ContactDraft, ContactPayload, ContactResult } from '@/types'
import { Mark } from '@/components/brand/mark'
import { Button } from '@/components/ui/button'
import { FRONT_OPTIONS } from '@/content/fronts'

interface ContactFormProps {
  readonly action: (previous: ContactResult, formData: FormData) => Promise<ContactResult>
  /** Shown when the form cannot send. Omitted when not configured. */
  readonly fallbackEmail?: string
}

const IDLE: ContactResult = { status: 'idle' }

/** Reading order. The first field with an error is the one that gets the cursor. */
const FIELD_ORDER = ['name', 'company', 'email', 'front', 'message'] as const

function fieldError(state: ContactResult, field: keyof ContactPayload): string | undefined {
  if (state.status !== 'invalid') return undefined
  return state.errors[field]
}

function failureMessage(state: ContactResult, fallbackEmail: string | undefined): string | null {
  if (state.status !== 'failed') return null
  if (state.reason === 'rate-limited') return 'Muitas mensagens em pouco tempo. Tente de novo em alguns minutos.'
  if (state.reason === 'unconfigured') {
    return fallbackEmail
      ? `O envio pelo site ainda não está ligado. Escreva para ${fallbackEmail}.`
      : 'O envio pelo site ainda não está ligado.'
  }
  return fallbackEmail
    ? `Não conseguimos enviar agora. Escreva para ${fallbackEmail}.`
    : 'Não conseguimos enviar agora. Tente de novo em instantes.'
}

/** The ids of the hint and the error a field is described by, when they exist. */
function describedBy(id: string, hint: string | undefined, error: string | undefined): string | undefined {
  const ids = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}

/**
 * Five labelled fields in a paper card: who is writing, from which company,
 * where to answer, which front looks like theirs, and what is stuck today.
 * Errors appear under the field they belong to, in plain words.
 */
export function ContactForm({ action, fallbackEmail }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(action, IDLE)
  const failure = failureMessage(state, fallbackEmail)
  // When the form appeared. A submit seconds later is not a person typing.
  const [startedAt, setStartedAt] = useState('')
  useEffect(() => {
    setStartedAt(String(Date.now()))
  }, [])

  // React empties the form once the action returns. Refill it with what was
  // typed, and put the cursor on the first field that needs fixing, so a
  // rejected message is never a blank card with a line of small print.
  const draft: ContactDraft = state.status === 'invalid' || state.status === 'failed' ? state.values : {}
  useEffect(() => {
    if (state.status !== 'invalid') return
    const first = FIELD_ORDER.find((field) => state.errors[field])
    if (first) document.getElementById(first)?.focus()
  }, [state])

  if (state.status === 'sent') {
    return (
      <div className="border-t border-on pt-clearance" role="status">
        <p className="text-xl font-extrabold tracking-display">Mensagem recebida.</p>
        <p className="mt-2 text-on-muted">A Xiax responde no e-mail que você informou.</p>
      </div>
    )
  }

  const nameError = fieldError(state, 'name')
  const companyError = fieldError(state, 'company')
  const emailError = fieldError(state, 'email')
  const frontError = fieldError(state, 'front')
  const messageError = fieldError(state, 'message')
  const frontHint = 'Se não souber, deixe como está.'
  const messageHint = 'Conte do seu jeito, em pelo menos uma frase: o que custa hora, cliente ou dinheiro.'

  return (
    <form action={formAction} noValidate className="contact-form">
      <div className="contact-grid">
        <Field id="name" label="Seu nome" error={nameError}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={draft.name ?? ''}
            required
            className="field"
            aria-invalid={Boolean(nameError)}
            aria-describedby={describedBy('name', undefined, nameError)}
          />
        </Field>
        <Field id="company" label="Empresa" error={companyError}>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            defaultValue={draft.company ?? ''}
            required
            className="field"
            aria-invalid={Boolean(companyError)}
            aria-describedby={describedBy('company', undefined, companyError)}
          />
        </Field>
        <Field id="email" label="E-mail para a resposta" error={emailError}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={draft.email ?? ''}
            required
            className="field"
            aria-invalid={Boolean(emailError)}
            aria-describedby={describedBy('email', undefined, emailError)}
          />
        </Field>
        <Field id="front" label="Frente que mais parece com a sua" hint={frontHint} error={frontError}>
          <span className="field-select-wrap">
            <select
              id="front"
              name="front"
              // A select keeps the choice it was mounted with, so remount it when the draft differs.
              key={draft.front ?? 'nao-sei'}
              defaultValue={draft.front ?? 'nao-sei'}
              className="field field-select"
              aria-invalid={Boolean(frontError)}
              aria-describedby={describedBy('front', frontHint, frontError)}
            >
              {FRONT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        </Field>
      </div>

      <Field id="message" label="O que trava hoje" hint={messageHint} error={messageError}>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={draft.message ?? ''}
          required
          className="field"
          aria-invalid={Boolean(messageError)}
          aria-describedby={describedBy('message', messageHint, messageError)}
        />
      </Field>

      <input type="hidden" name="startedAt" value={startedAt} />

      {/* Honeypot: people never see it; bots fill it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Site</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {failure ? (
        <p role="alert" className="text-sm">
          {failure}
        </p>
      ) : null}

      <div className="contact-actions">
        <Button type="submit" disabled={pending} coreSlot="contact">
          {pending ? (
            <span className="inline-flex items-center gap-3">
              <Mark size={16} structure="paper" core="structure" motion="think" />
              Enviando
            </span>
          ) : (
            'Enviar mensagem'
          )}
        </Button>
        <p className="data">A resposta vai para o e-mail informado.</p>
      </div>
    </form>
  )
}

interface FieldProps {
  readonly id: string
  readonly label: string
  readonly hint?: string | undefined
  readonly error?: string | undefined
  readonly children: ReactNode
}

/** A label above the field, a hint when the label is not enough, and the error under it. */
function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="field-block" data-invalid={Boolean(error)}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="data">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
