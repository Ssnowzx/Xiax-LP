'use client'

import { useActionState } from 'react'
import type { ReactNode } from 'react'

import type { ContactResult } from '@/types'
import { Mark } from '@/components/brand/mark'
import { Button } from '@/components/ui/button'
import { FRONT_OPTIONS } from '@/content/fronts'

interface ContactFormProps {
  readonly action: (previous: ContactResult, formData: FormData) => Promise<ContactResult>
  /** Shown when the form cannot send. Omitted when not configured. */
  readonly fallbackEmail?: string
}

const IDLE: ContactResult = { status: 'idle' }

const FIELD_NAMES: Readonly<Record<string, string>> = {
  name: 'Nome',
  email: 'E-mail',
  company: 'Empresa',
  front: 'Frente',
  message: 'O que trava',
}

function fieldError(state: ContactResult, field: string): string | undefined {
  if (state.status !== 'invalid') return undefined
  return state.errors[field as keyof typeof state.errors]
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

/**
 * "Conte a operação, do seu jeito": the form is a sentence with blanks. Every
 * blank is a real, labelled field; the labels are read by screen readers and
 * shown next to the errors.
 */
export function ContactForm({ action, fallbackEmail }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(action, IDLE)
  const failure = failureMessage(state, fallbackEmail)
  const errors = state.status === 'invalid' ? Object.entries(state.errors) : []

  if (state.status === 'sent') {
    return (
      <div className="border-t border-on pt-clearance" role="status">
        <p className="text-xl font-extrabold tracking-display">Mensagem recebida.</p>
        <p className="mt-2 text-on-muted">A Xiax responde no e-mail que você informou.</p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="story">
      <p className="story-line">
        Meu nome é{' '}
        <Blank id="name" label="Nome" invalid={Boolean(fieldError(state, 'name'))}>
          <input id="name" name="name" type="text" autoComplete="name" placeholder="seu nome" size={12} required className="blank-input" aria-invalid={Boolean(fieldError(state, 'name'))} />
        </Blank>{' '}
        e trabalho na{' '}
        <Blank id="company" label="Empresa" invalid={Boolean(fieldError(state, 'company'))}>
          <input id="company" name="company" type="text" autoComplete="organization" placeholder="empresa" size={14} required className="blank-input" aria-invalid={Boolean(fieldError(state, 'company'))} />
        </Blank>
        . Dá para me responder em{' '}
        <Blank id="email" label="E-mail" invalid={Boolean(fieldError(state, 'email'))}>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="e-mail" size={20} required className="blank-input" aria-invalid={Boolean(fieldError(state, 'email'))} />
        </Blank>
        .
      </p>
      <p className="story-line">
        A frente que mais parece com a minha é{' '}
        <Blank id="front" label="Frente" invalid={false}>
          <select id="front" name="front" defaultValue="nao-sei" className="blank-input blank-select">
            {FRONT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label.toLowerCase()}
              </option>
            ))}
          </select>
        </Blank>
        .
      </p>
      <p className="story-line">O que trava hoje é:</p>
      <label htmlFor="message" className="sr-only">
        O que trava hoje
      </label>
      <textarea
        id="message"
        name="message"
        rows={3}
        required
        placeholder="Conte do seu jeito. O que custa hora, cliente ou dinheiro?"
        className="story-text"
        aria-invalid={Boolean(fieldError(state, 'message'))}
      />

      {/* Honeypot: people never see it; bots fill it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Site</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errors.length > 0 ? (
        <ul role="alert" className="story-errors">
          {errors.map(([field, message]) => (
            <li key={field}>
              <span className="font-medium">{FIELD_NAMES[field] ?? field}:</span> {message}
            </li>
          ))}
        </ul>
      ) : null}

      {failure ? (
        <p role="alert" className="text-sm text-on">
          {failure}
        </p>
      ) : null}

      <div>
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
      </div>
    </form>
  )
}

interface BlankProps {
  readonly id: string
  readonly label: string
  readonly invalid: boolean
  readonly children: ReactNode
}

function Blank({ id, label, invalid, children }: BlankProps) {
  return (
    <span className="blank" data-invalid={invalid}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children}
    </span>
  )
}
