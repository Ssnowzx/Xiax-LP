import type { ComparisonRow } from '@/types'

/** Software house versus business house. Read left to right, row by row. */
export const COMPARISON: readonly ComparisonRow[] = [
  {
    softwareHouse: 'Começa no briefing.',
    businessHouse: 'Começa dentro da operação, com quem faz o trabalho.',
  },
  {
    softwareHouse: 'Entrega o que foi pedido.',
    businessHouse: 'Entrega o que resolve a dor que custa dinheiro.',
  },
  {
    softwareHouse: 'Termina no deploy.',
    businessHouse: 'Fica até a operação rodar sem a gente.',
  },
  {
    softwareHouse: 'Integra assinaturas de terceiros.',
    businessHouse: 'Constrói o sistema e hospeda em infraestrutura própria.',
  },
  {
    softwareHouse: 'IA como funcionalidade.',
    businessHouse: 'IA no núcleo da operação.',
  },
] as const
