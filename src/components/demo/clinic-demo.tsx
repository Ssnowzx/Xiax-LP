'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import './demo.css'

type ModuleId = 'agenda' | 'espera' | 'financeiro' | 'indicadores'
type Status = 'aberto' | 'confirmado' | 'realizado' | 'faltou'
type Plan = 'Particular' | 'Unimed' | 'Bradesco'

interface Session {
  readonly id: string
  readonly slot: string
  readonly pro: number
  readonly patient: string
  readonly status: Status
  readonly plan: Plan
  readonly count: string
}

interface Waiting {
  readonly id: string
  readonly patient: string
  readonly pro: number
  readonly priority: 'urgente' | 'alta' | 'normal'
  readonly days: number
  readonly plan: Plan
  readonly note: string
}

interface State {
  readonly module: ModuleId
  readonly sessions: readonly Session[]
  readonly waiting: readonly Waiting[]
  readonly open: string | null
  readonly toast: string | null
  readonly closed: boolean
}

type Action =
  | { readonly type: 'module'; readonly module: ModuleId }
  | { readonly type: 'toggle'; readonly id: string }
  | { readonly type: 'status'; readonly id: string; readonly status: Status }
  | { readonly type: 'fit'; readonly id: string }
  | { readonly type: 'close' }
  | { readonly type: 'toast'; readonly text: string | null }
  | { readonly type: 'reset' }

type IconName = 'calendar' | 'clock' | 'users' | 'user' | 'wallet' | 'tasks' | 'chart' | 'inbox' | 'file' | 'note' | 'book' | 'settings' | 'check' | 'dashed' | 'panel'

interface ModuleInfo {
  readonly id: ModuleId
  readonly name: string
  readonly line: string
  readonly icon: IconName
}

const AGENDA: ModuleInfo = { id: 'agenda', name: 'Agenda', line: 'Cada sessão com status, convênio e confirmação pelo WhatsApp.', icon: 'calendar' }
const ESPERA: ModuleInfo = { id: 'espera', name: 'Lista de espera', line: 'Quem espera, por quanto tempo, e o encaixe no primeiro horário livre.', icon: 'clock' }
const FINANCEIRO: ModuleInfo = { id: 'financeiro', name: 'Financeiro', line: 'O lançamento nasce da sessão realizada. O mês fecha com o que aconteceu.', icon: 'wallet' }
const INDICADORES: ModuleInfo = { id: 'indicadores', name: 'Indicadores', line: 'Os números do mês, sem pedir relatório.', icon: 'chart' }
const MODULES: readonly ModuleInfo[] = [AGENDA, ESPERA, FINANCEIRO, INDICADORES]

const PROS = [
  { name: 'Ana', initials: 'AN', specialty: 'Fonoaudiologia', hours: 'Seg–Sex · 08:00–12:00' },
  { name: 'Bruno', initials: 'BR', specialty: 'Psicologia', hours: 'Seg–Sex · 08:00–18:00' },
  { name: 'Carla', initials: 'CA', specialty: 'Terapia ocupacional', hours: 'Seg–Sex · 09:00–19:00' },
] as const
const SLOTS = ['08:00', '08:40', '09:20', '10:00', '10:40', '11:20'] as const
const PRICE: Readonly<Record<Plan, number>> = { Particular: 180, Unimed: 120, Bradesco: 110 }
const STATUS_LABEL: Readonly<Record<Status, string>> = {
  aberto: 'Em aberto',
  confirmado: 'Confirmado',
  realizado: 'Realizado',
  faltou: 'Faltou',
}

const INITIAL: State = {
  module: 'agenda',
  sessions: [
    { id: 's1', slot: '08:00', pro: 0, patient: 'Helena', status: 'aberto', plan: 'Unimed', count: '2/20 sessões' },
    { id: 's2', slot: '08:00', pro: 2, patient: 'Noah', status: 'confirmado', plan: 'Particular', count: '6/20 sessões' },
    { id: 's3', slot: '08:40', pro: 0, patient: 'Giovana', status: 'aberto', plan: 'Unimed', count: '2/20 sessões' },
    { id: 's4', slot: '08:40', pro: 1, patient: 'Lucas', status: 'realizado', plan: 'Particular', count: '11/12 sessões' },
    { id: 's5', slot: '09:20', pro: 2, patient: 'Lorena', status: 'confirmado', plan: 'Bradesco', count: '6/20 sessões' },
    { id: 's6', slot: '10:00', pro: 0, patient: 'Arthur', status: 'faltou', plan: 'Particular', count: '4/20 sessões' },
    { id: 's7', slot: '10:40', pro: 1, patient: 'Késia', status: 'aberto', plan: 'Particular', count: '3/20 sessões' },
    { id: 's8', slot: '11:20', pro: 2, patient: 'Cecília', status: 'aberto', plan: 'Unimed', count: '4/20 sessões' },
  ],
  waiting: [
    { id: 'w1', patient: 'Rafael', pro: 0, priority: 'urgente', days: 4, plan: 'Unimed', note: 'Encaminhamento do pediatra. Pode vir de manhã.' },
    { id: 'w2', patient: 'Isabela', pro: 2, priority: 'alta', days: 11, plan: 'Particular', note: 'Só terça e quinta à tarde. Quem traz é a avó.' },
    { id: 'w3', patient: 'Sofia', pro: 1, priority: 'normal', days: 25, plan: 'Bradesco', note: 'Aceita encaixe de última hora, mora perto.' },
  ],
  open: null,
  toast: null,
  closed: false,
}

const TOAST_BY_STATUS: Readonly<Record<Status, string>> = {
  aberto: 'Sessão reaberta.',
  confirmado: 'Confirmado pelo WhatsApp. A família respondeu.',
  realizado: 'Sessão realizada. Lançamento criado no financeiro.',
  faltou: 'Falta registrada. O horário volta para a lista de espera.',
}

function money(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR')}`
}

function realizadas(sessions: readonly Session[]): readonly Session[] {
  return sessions.filter((session) => session.status === 'realizado')
}

function reduce(state: State, action: Action): State {
  switch (action.type) {
    case 'module':
      return { ...state, module: action.module, open: null }
    case 'toggle':
      return { ...state, open: state.open === action.id ? null : action.id }
    case 'status':
      return {
        ...state,
        open: null,
        toast: TOAST_BY_STATUS[action.status],
        sessions: state.sessions.map((session) =>
          session.id === action.id ? { ...session, status: action.status } : session,
        ),
      }
    case 'fit': {
      const entry = state.waiting.find((waiting) => waiting.id === action.id)
      if (!entry) return state
      const taken = new Set(state.sessions.filter((session) => session.pro === entry.pro).map((session) => session.slot))
      const slot = SLOTS.find((candidate) => !taken.has(candidate))
      if (!slot) return { ...state, toast: 'Sem horário livre para essa profissional hoje.' }
      return {
        ...state,
        module: 'agenda',
        open: null,
        toast: `Encaixado às ${slot} com ${PROS[entry.pro]?.name ?? ''}. Confirmação enviada pelo WhatsApp.`,
        waiting: state.waiting.filter((waiting) => waiting.id !== action.id),
        sessions: [
          ...state.sessions,
          { id: entry.id, slot, pro: entry.pro, patient: entry.patient, status: 'confirmado', plan: entry.plan, count: '1/20 sessões' },
        ],
      }
    }
    case 'close': {
      const done = realizadas(state.sessions)
      const total = done.reduce((sum, session) => sum + PRICE[session.plan], 0)
      return { ...state, closed: true, toast: `Mês fechado: ${money(total)} em ${done.length} sessões.` }
    }
    case 'toast':
      return { ...state, toast: action.text }
    case 'reset':
      return INITIAL
    default:
      return state
  }
}

/** What the core does when nobody is touching the system. Targets are data-demo-target values. */
const SCRIPT: readonly { readonly target: string; readonly action: Action; readonly wait: number }[] = [
  { target: 'module-agenda', action: { type: 'module', module: 'agenda' }, wait: 900 },
  { target: 'session-s1', action: { type: 'toggle', id: 's1' }, wait: 700 },
  { target: 'act-s1-confirmado', action: { type: 'status', id: 's1', status: 'confirmado' }, wait: 1700 },
  { target: 'module-espera', action: { type: 'module', module: 'espera' }, wait: 1300 },
  { target: 'fit-w1', action: { type: 'fit', id: 'w1' }, wait: 2000 },
  { target: 'session-s5', action: { type: 'toggle', id: 's5' }, wait: 700 },
  { target: 'act-s5-realizado', action: { type: 'status', id: 's5', status: 'realizado' }, wait: 1600 },
  { target: 'module-financeiro', action: { type: 'module', module: 'financeiro' }, wait: 1500 },
  { target: 'close', action: { type: 'close' }, wait: 2000 },
  { target: 'module-indicadores', action: { type: 'module', module: 'indicadores' }, wait: 3000 },
]

const CURSOR_MS = 640

function sleep(ms: number, signal: { cancelled: boolean }): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setInterval(() => {
      if (signal.cancelled) {
        window.clearInterval(timer)
        resolve()
      }
    }, 50)
    window.setTimeout(() => {
      window.clearInterval(timer)
      resolve()
    }, ms)
  })
}

/** CSSProperties plus the one custom property the cards use for their colour. */
type DemoStyle = CSSProperties & { readonly '--demo-pro'?: string }

const ICON_PATHS: Readonly<Record<IconName, string>> = {
  calendar: 'M3 4.5h10v9H3zM3 7.5h10M6 2.5v3M10 2.5v3',
  clock: 'M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 5v3l2 1.2',
  users: 'M6 8.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5zM2 13.5c0-2.4 1.8-3.8 4-3.8s4 1.4 4 3.8M11 8a1.75 1.75 0 1 0 0-3.5M13.5 13c0-1.8-1-3-2.5-3.4',
  user: 'M8 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 13.5c0-2.8 2.2-4.2 5-4.2s5 1.4 5 4.2',
  wallet: 'M2 5.5h12v8H2zM2 8.5h12M11 11a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM4 5.5V4h8v1.5',
  tasks: 'M3 4.5h10M3 8h10M3 11.5h6',
  chart: 'M3 13.5V8.5M7 13.5V4M11 13.5V6.5M2 13.5h12',
  inbox: 'M2 9l2-5.5h8L14 9v4H2zM2 9h4l1 1.5h2L10 9h4',
  file: 'M4 2.5h6l3 3v8H4zM10 2.5v3h3',
  note: 'M3 2.5h10v11H3zM5.5 6h5M5.5 9h5',
  book: 'M3 3h9.5v10H3zM6.5 3v10',
  settings: 'M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.8 3.8l1 1M11.2 11.2l1 1M3.8 12.2l1-1M11.2 4.8l1-1',
  check: 'M3 8.5l3 3 7-7',
  dashed: 'M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3z',
  panel: 'M2.5 3.5h11v9h-11zM10 3.5v9M12 6.5l-1.5 1.5 1.5 1.5',
}

function Icon({ name }: { readonly name: IconName }) {
  return (
    <svg className="demo-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON_PATHS[name]} strokeDasharray={name === 'dashed' ? '2 1.6' : undefined} />
    </svg>
  )
}

/**
 * A working Xclinicas, in the browser, with no backend, drawn like the real
 * one: sidebar, top counters, the day's agenda by professional, waiting list,
 * finance and indicators sharing one state. Left alone, the core runs the
 * script itself. Element moves use the View Transitions API where it exists.
 */
export function ClinicDemo({ name }: { readonly name: string }) {
  const [state, dispatch] = useReducer(reduce, INITIAL)
  const [playing, setPlaying] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const reduceRef = useRef(false)
  const inViewRef = useRef(false)

  /**
   * Moves are animated with the View Transitions API, which paints the named
   * cards in the top layer, above the sticky header and the phone bar. So the
   * transition only runs while the whole frame sits between the two.
   */
  const canTransition = useCallback(() => {
    if (reduceRef.current || typeof document === 'undefined' || !('startViewTransition' in document)) return false
    const frame = frameRef.current
    if (!frame) return false
    const box = frame.getBoundingClientRect()
    const ceiling = document.getElementById('site-header')?.getBoundingClientRect().bottom ?? 0
    const bar = document.querySelector<HTMLElement>('.mobile-cta')
    const barShown = bar !== null && bar.dataset['hidden'] !== 'true' && getComputedStyle(bar).display !== 'none'
    const floor = barShown ? bar.getBoundingClientRect().top : window.innerHeight
    return box.top >= ceiling - 1 && box.bottom <= floor + 1
  }, [])

  const commit = useCallback(
    (action: Action) => {
      const apply = () => dispatch(action)
      if (canTransition() && 'startViewTransition' in document) {
        document.startViewTransition(() => flushSync(apply))
        return
      }
      apply()
    },
    [canTransition],
  )

  useEffect(() => {
    if (!state.toast) return undefined
    const timer = window.setTimeout(() => dispatch({ type: 'toast', text: null }), 2600)
    return () => window.clearTimeout(timer)
  }, [state.toast])

  const moveCursorTo = useCallback(async (target: string, signal: { cancelled: boolean }) => {
    const frame = frameRef.current
    const cursor = cursorRef.current
    const element = frame?.querySelector<HTMLElement>(`[data-demo-target="${target}"]`)
    if (!frame || !cursor || !element) return
    const box = frame.getBoundingClientRect()
    const rect = element.getBoundingClientRect()
    const x = rect.left - box.left + rect.width / 2
    const y = rect.top - box.top + rect.height / 2
    cursor.style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px)`
    cursor.classList.add('is-visible')
    await sleep(CURSOR_MS, signal)
    if (signal.cancelled) return
    cursor.classList.add('is-pressing')
    element.classList.add('is-pressed')
    await sleep(160, signal)
    cursor.classList.remove('is-pressing')
    element.classList.remove('is-pressed')
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return undefined
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries.some((entry) => entry.isIntersecting)
      },
      { threshold: 0.4 },
    )
    observer.observe(frame)

    const signal = { cancelled: false }
    const run = async () => {
      while (!signal.cancelled) {
        if (!inViewRef.current || reduceRef.current) {
          setPlaying(false)
          await sleep(500, signal)
          continue
        }
        setPlaying(true)
        for (const step of SCRIPT) {
          if (signal.cancelled || !inViewRef.current) break
          await moveCursorTo(step.target, signal)
          if (signal.cancelled) break
          commit(step.action)
          await sleep(step.wait, signal)
        }
        if (!signal.cancelled) {
          await sleep(1200, signal)
          cursorRef.current?.classList.remove('is-visible')
          commit({ type: 'reset' })
          await sleep(900, signal)
        }
      }
    }
    void run()

    return () => {
      signal.cancelled = true
      observer.disconnect()
    }
  }, [commit, moveCursorTo])

  const active = MODULES.find((module) => module.id === state.module) ?? AGENDA
  const done = realizadas(state.sessions)
  const total = done.reduce((sum, session) => sum + PRICE[session.plan], 0)
  const counts = (['aberto', 'confirmado', 'realizado', 'faltou'] as const).map((status) => ({
    status,
    count: state.sessions.filter((session) => session.status === status).length,
  }))
  const maxCount = Math.max(1, ...counts.map((entry) => entry.count))

  const navButton = (module: ModuleInfo) => (
    <button
      key={module.id}
      type="button"
      className="demo-nav-item"
      data-demo-target={`module-${module.id}`}
      aria-current={state.module === module.id ? 'true' : undefined}
    >
      <Icon name={module.icon} />
      <span className="demo-nav-label">{module.name}</span>
    </button>
  )
  const navStatic = (icon: IconName, label: string) => (
    <span key={label} className="demo-nav-item demo-nav-static">
      <Icon name={icon} />
      <span className="demo-nav-label">{label}</span>
    </span>
  )

  return (
    <div className="demo" data-playing={playing}>
      <div className="demo-window">
        <div className="demo-window-bar" aria-hidden="true">
          <span className="demo-window-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="data demo-window-url">clinica.gestaonossa.com.br</span>
          <span className="data demo-window-tag">demonstração</span>
        </div>
      <div ref={frameRef} className="demo-frame" inert>
        <aside className="demo-side">
          <div className="demo-brand">
            <span className="demo-avatar">CE</span>
            <b>Clínica Exemplo</b>
          </div>
          <nav aria-label={`Módulos do ${name}`}>
            <p className="demo-group">Atendimento</p>
            {navButton(AGENDA)}
            {navButton(ESPERA)}
            {navStatic('users', 'Pacientes')}
            {navStatic('inbox', 'Cadastros recebidos')}
            {navStatic('user', 'Profissionais')}
            {navStatic('file', 'Tratamentos')}
            <p className="demo-group">Gestão</p>
            {navButton(FINANCEIRO)}
            {navStatic('tasks', 'Tarefas')}
            {navStatic('note', 'Mensagens')}
            {navButton(INDICADORES)}
            <p className="demo-group">Administração</p>
            {navStatic('inbox', 'Cadastros')}
            {navStatic('users', 'Usuários')}
            {navStatic('book', 'Auditoria')}
          </nav>
          <div className="demo-side-foot">
            {navStatic('book', 'Manual')}
            {navStatic('settings', 'Configurações')}
          </div>
        </aside>

        <div className="demo-main">
          <div className="demo-topbar">
            <div className="demo-pill">
              <span>
                <Icon name="note" /> Evoluções <b>39</b>
              </span>
              <span>
                <Icon name="calendar" /> Retornos <b>1</b>
              </span>
              <span>
                <Icon name="tasks" /> Tarefas <b>3</b>
              </span>
              <span>
                <Icon name="user" /> Aniversários <b>1</b>
              </span>
              <span>
                <Icon name="file" /> Termos <b>13</b>
              </span>
              <span className="demo-ok">
                <Icon name="check" /> Em dia
              </span>
            </div>
            <div className="demo-user">
              <span className="demo-avatar demo-avatar-small">AE</span> Admin Exemplo <span className="demo-muted">Sair</span>
            </div>
          </div>

          <div className="demo-page">
            <header className="demo-page-head">
              <div>
                <p className="demo-title">{active.name}</p>
                <p className="demo-sub">
                  {state.module === 'agenda' ? 'Terça-feira, 15 de setembro de 2026' : null}
                  {state.module === 'espera' ? `${state.waiting.length} pacientes esperando` : null}
                  {state.module === 'financeiro' ? 'Setembro de 2026' : null}
                  {state.module === 'indicadores' ? 'Os números de setembro de 2026. Cada aba abre conforme a sua permissão.' : null}
                </p>
              </div>
              {state.module === 'agenda' ? (
                <div className="demo-controls">
                  <span className="demo-seg">
                    <span>Dia</span>
                    <span>Semana</span>
                    <span data-on="">Visão geral</span>
                  </span>
                  <span className="demo-datebox">‹ 15/09/2026 ›</span>
                  <span className="demo-ghost">
                    <Icon name="calendar" /> Hoje
                  </span>
                </div>
              ) : null}
              {state.module === 'espera' ? <span className="demo-primary">Entrar na fila</span> : null}
              {state.module === 'indicadores' ? (
                <div className="demo-controls">
                  <span className="demo-datebox">‹ setembro de 2026 ›</span>
                  <span className="demo-ghost">Imprimir</span>
                </div>
              ) : null}
            </header>

            <div className="demo-panel">
              {state.module === 'agenda' ? (
                <div className="demo-agenda">
                  <aside className="demo-pros">
                    <p className="demo-pros-head">Todos os profissionais</p>
                    {PROS.map((pro, index) => (
                      <div key={pro.name} className="demo-pro-row">
                        <span className="demo-dot" style={{ '--demo-pro': `var(--demo-pro-${index})` } as DemoStyle}>
                          {pro.initials}
                        </span>
                        <div>
                          <b>{pro.name}</b>
                          <small>{pro.hours}</small>
                          <small>{pro.specialty}</small>
                        </div>
                      </div>
                    ))}
                  </aside>
                  <div className="demo-grid" role="grid" aria-label="Agenda do dia">
                    <div className="demo-grid-head" role="row">
                      <span role="columnheader">Horário</span>
                      {PROS.map((pro, index) => (
                        <span key={pro.name} role="columnheader">
                          <i className="demo-dot demo-dot-small" style={{ '--demo-pro': `var(--demo-pro-${index})` } as DemoStyle}>
                            {pro.initials}
                          </i>
                          {pro.name}
                        </span>
                      ))}
                    </div>
                    <div className="demo-grid-body">
                      {SLOTS.map((slot) => (
                        <div key={slot} className="demo-grid-row" role="row">
                          <span role="rowheader" className="demo-time">
                            {slot}
                          </span>
                          {PROS.map((pro, index) => {
                            const session = state.sessions.find((candidate) => candidate.slot === slot && candidate.pro === index)
                            if (!session) return <span key={pro.name} role="gridcell" className="demo-cell" data-free="" />
                            const isOpen = state.open === session.id
                            return (
                              <span key={pro.name} role="gridcell" className="demo-cell">
                                <button
                                  type="button"
                                  className="demo-card"
                                  data-demo-target={`session-${session.id}`}
                                  aria-expanded={isOpen}
                                  style={{ viewTransitionName: `s-${session.id}`, '--demo-pro': `var(--demo-pro-${index})` } as DemoStyle}
                                >
                                  <span className="demo-card-title">
                                    <b>{session.slot}</b> Paciente {session.patient}
                                  </span>
                                  <span className="demo-card-line">
                                    <span className="demo-chip" data-status={session.status}>
                                      <Icon name={session.status === 'aberto' ? 'dashed' : 'check'} />
                                      {STATUS_LABEL[session.status]}
                                    </span>
                                    <small>{session.count}</small>
                                  </span>
                                  <span className="demo-card-sub">
                                    {pro.specialty} · {session.plan}
                                  </span>
                                </button>
                                {isOpen ? (
                                  <span className="demo-actions">
                                    {(['confirmado', 'realizado', 'faltou'] as const)
                                      .filter((status) => status !== session.status)
                                      .map((status) => (
                                        <button
                                          key={status}
                                          type="button"
                                          className="demo-action"
                                          data-demo-target={`act-${session.id}-${status}`}
                                        >
                                          {status === 'confirmado' ? 'Confirmar pelo WhatsApp' : STATUS_LABEL[status]}
                                        </button>
                                      ))}
                                  </span>
                                ) : null}
                              </span>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  <aside className="demo-waitpanel" aria-label="Lista de espera">
                    <Icon name="panel" />
                    <span className="demo-waitpanel-label">Lista de espera</span>
                    <b>{state.waiting.length}</b>
                  </aside>
                </div>
              ) : null}

              {state.module === 'espera' ? (
                <div className="demo-table">
                  <div className="demo-table-head">
                    <span>Paciente</span>
                    <span>Espera por</span>
                    <span>Prioridade</span>
                    <span>Na fila</span>
                    <span>Observação</span>
                    <span>Ações</span>
                  </div>
                  {state.waiting.length === 0 ? <p className="demo-empty">Ninguém esperando. A fila zerou.</p> : null}
                  {state.waiting.map((entry) => (
                    <div key={entry.id} className="demo-table-row" style={{ viewTransitionName: `s-${entry.id}` }}>
                      <span>
                        <b>Paciente {entry.patient}</b>
                      </span>
                      <span>
                        {PROS[entry.pro]?.specialty} · {PROS[entry.pro]?.name}
                      </span>
                      <span>
                        <span className="demo-chip" data-priority={entry.priority}>
                          {entry.priority.charAt(0).toUpperCase() + entry.priority.slice(1)}
                        </span>
                      </span>
                      <span>há {entry.days} dias</span>
                      <span>{entry.note}</span>
                      <span className="demo-table-actions">
                        <button type="button" className="demo-primary" data-demo-target={`fit-${entry.id}`}>
                          <Icon name="calendar" /> Encaixar
                        </button>
                        <span className="demo-danger">Sair da fila</span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}

              {state.module === 'financeiro' ? (
                <div className="demo-finance">
                  <div className="demo-kpis">
                    <div className="demo-kpi">
                      <span>Sessões realizadas</span>
                      <b>{done.length}</b>
                    </div>
                    <div className="demo-kpi">
                      <span>A receber</span>
                      <b>{money(total)}</b>
                    </div>
                    <div className="demo-kpi">
                      <span>Mês</span>
                      <b>{state.closed ? 'fechado' : 'aberto'}</b>
                    </div>
                  </div>
                  <div className="demo-table">
                    <div className="demo-table-head" style={{ gridTemplateColumns: '1.2fr 1fr 1fr 1fr' }}>
                      <span>Paciente</span>
                      <span>Sessão</span>
                      <span>Convênio</span>
                      <span>Valor</span>
                    </div>
                    {done.length === 0 ? <p className="demo-empty">Nenhuma sessão realizada hoje. Marque uma na agenda.</p> : null}
                    {done.map((session) => (
                      <div key={session.id} className="demo-table-row is-3">
                        <span>
                          <b>Paciente {session.patient}</b>
                        </span>
                        <span>
                          {session.slot} · {PROS[session.pro]?.name}
                        </span>
                        <span>{session.plan}</span>
                        <span>
                          <b>{money(PRICE[session.plan])}</b>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <button type="button" className="demo-primary" data-demo-target="close" disabled={state.closed}>
                      <Icon name="check" /> {state.closed ? 'Mês fechado' : 'Fechar o mês'}
                    </button>
                  </div>
                </div>
              ) : null}

              {state.module === 'indicadores' ? (
                <div className="demo-finance">
                  <div className="demo-tabs">
                    <span data-on="">Visão geral</span>
                    <span>Financeiro</span>
                    <span>Produtividade</span>
                  </div>
                  <div className="demo-report">
                    <p className="demo-report-title">Agenda</p>
                    <p className="demo-report-big">{state.sessions.length}</p>
                    <p className="demo-sub">sessões hoje</p>
                    {counts.map((entry) => (
                      <div key={entry.status} className="demo-bar-row">
                        <span>{STATUS_LABEL[entry.status]}</span>
                        <span className="demo-bar">
                          <i data-status={entry.status} style={{ width: `${(entry.count / maxCount) * 100}%` }} />
                        </span>
                        <b>{entry.count}</b>
                      </div>
                    ))}
                    <p className="demo-sub">
                      A receber: <b>{money(total)}</b>. Na espera: <b>{state.waiting.length}</b>.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>


        {state.toast ? (
          <p className="demo-toast" role="status" key={state.toast}>
            {state.toast}
          </p>
        ) : null}

        <div ref={cursorRef} className="demo-cursor" aria-hidden="true">
          <i />
          <span>IA</span>
        </div>

        <p className="demo-note">dados fictícios, {playing ? 'operado pelo núcleo' : 'em espera'}</p>
      </div>
      </div>
      <p className="demo-caption data">
        {active.name}: {active.line}
      </p>
    </div>
  )
}
