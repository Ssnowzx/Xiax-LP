import type { NavItem } from '@/types'

export const PRIMARY_NAV: readonly NavItem[] = [
  { href: '/portfolio', label: 'Sistemas' },
  { href: '/#metodo', label: 'Método' },
  { href: '/contato', label: 'Contato', cta: true },
] as const

export const FOOTER_NAV: readonly NavItem[] = [
  { href: '/portfolio', label: 'Sistemas' },
  { href: '/contato', label: 'Contato' },
  { href: '/privacidade', label: 'Privacidade' },
] as const
