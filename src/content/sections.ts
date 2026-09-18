import type { PageSection, PageSectionId } from '@/types'

/**
 * The sales page in six numbered parts, in reading order. The number is real
 * information: it is the order of the argument, and it lets the reader see
 * where they are in it. The hero is the cover and carries no number.
 */
export const PAGE_SECTIONS: readonly PageSection[] = [
  {
    id: 'servico',
    name: 'O serviço',
    brief: 'O que a Xiax faz pela sua operação e o que muda em relação ao software sob encomenda.',
  },
  {
    id: 'metodo',
    name: 'Como entramos',
    brief: 'Quatro passos, da imersão na empresa até a operação rodar sem a gente.',
  },
  {
    id: 'frentes',
    name: 'Quatro frentes',
    brief: 'Onde o serviço se aplica: plataformas, gestão, automação e produtos.',
  },
  {
    id: 'no-ar',
    name: 'O que está no ar',
    brief: 'Sistemas em produção, com telas reais e o que está construído em cada um.',
  },
  {
    id: 'motor',
    name: 'Donos do motor',
    brief: 'Infraestrutura própria, dado no Brasil e sistema em vez de assinatura.',
  },
  {
    id: 'contato',
    name: 'Contato',
    brief: 'Conte a operação. Se fizer sentido, marcamos uma visita.',
  },
] as const

/** "01", "02"… the number a section shows for its position. */
export function sectionNumber(position: number): string {
  return String(position + 1).padStart(2, '0')
}

export function findSection(
  id: PageSectionId,
): { readonly section: PageSection; readonly position: number } | undefined {
  const position = PAGE_SECTIONS.findIndex((section) => section.id === id)
  const section = PAGE_SECTIONS[position]
  return section ? { section, position } : undefined
}
