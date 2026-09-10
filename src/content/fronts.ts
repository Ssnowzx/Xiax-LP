import type { Front } from '@/types'

/**
 * The four fronts, per the company's offering. Four fronts, four satellites:
 * the information architecture and the mark describe the same structure.
 *
 * Commercial scope and prices are still open in company/offering.md, so the
 * site says only what each front is for. It does not invent deliverables.
 */
export const FRONTS: readonly Front[] = [
  {
    slug: 'plataformas',
    name: 'Plataformas completas',
    promise: 'O sistema inteiro do negócio, do cadastro ao financeiro, com IA no núcleo da operação.',
    problem:
      'A operação roda em planilha, WhatsApp e três assinaturas que não conversam entre si.',
    loader: 'grow',
    examples: ['cadastro', 'agenda', 'financeiro', 'atendimento'],
  },
  {
    slug: 'gestao',
    name: 'Sistemas de gestão',
    promise: 'ERP e back-office construídos para o seu processo, não para um mercado inteiro.',
    problem: 'O ERP de prateleira obriga a mudar o processo que funciona para caber no software.',
    loader: 'orbit-step',
    examples: ['pedidos', 'estoque', 'caixa', 'relatórios'],
  },
  {
    slug: 'automacao',
    name: 'Automação comercial',
    promise: 'Prospecção, qualificação e atendimento rodando 24 horas, com a sua regra.',
    problem:
      'O time comercial passa o dia respondendo o que já foi respondido e perde o lead que estava pronto.',
    loader: 'orbit',
    examples: ['prospecção', 'qualificação', 'resposta no WhatsApp', 'acompanhamento'],
  },
  {
    slug: 'produtos',
    name: 'Produtos digitais',
    promise: 'Produto próprio ou em parceria, do primeiro commit ao dia em que entra no ar.',
    problem: 'A ideia existe há dois anos e nunca passou do protótipo.',
    loader: 'sequence',
    examples: ['produto próprio', 'parceria', 'assinatura', 'no ar'],
  },
] as const

export function findFront(slug: string): Front | undefined {
  return FRONTS.find((front) => front.slug === slug)
}

/** Label shown in the contact form's select. */
export const FRONT_OPTIONS: readonly { readonly value: Front['slug'] | 'nao-sei'; readonly label: string }[] = [
  { value: 'nao-sei', label: 'Ainda não sei' },
  ...FRONTS.map((front) => ({ value: front.slug, label: front.name })),
]
