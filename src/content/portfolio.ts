import type { PortfolioItem } from '@/types'

/**
 * Systems Xiax built. The list is short on purpose: a system enters here when
 * it exists, with its real state. "Em produção" means people use it today.
 *
 * Client-owned systems appear only with the client's authorisation to be named.
 * Every line below comes from the product's own public page.
 */
export const PORTFOLIO: readonly PortfolioItem[] = [
  {
    slug: 'xclinicas',
    name: 'Xclinicas',
    url: 'https://xclinicas.xiax.com.br',
    owner: 'xiax',
    clientNamed: true,
    front: 'plataformas',
    summary:
      'Gestão para clínicas de psicologia: agenda, prontuário, convênios, financeiro e confirmação pelo WhatsApp num sistema só.',
    forWhom:
      'Clínica de 3 a 25 profissionais que fecha o mês na planilha e corre atrás de guia de convênio.',
    built: [
      'Agenda multiprofissional com confirmação pelo WhatsApp',
      'Prontuário com anamnese e evolução por sessão',
      'Convênios: guias, autorização e conciliação',
      'Financeiro com fechamento do mês',
      'Indicadores da operação',
      'Três planos com preço público, do Essencial à Rede',
    ],
    stack: ['React', 'Laravel', 'MySQL'],
    state: 'production',
    screens: {
      screens: [
        {
          src: '/portfolio/xclinicas-agenda.jpg',
          width: 1493,
          height: 812,
          alt: 'Agenda do dia: cinco profissionais em colunas, sessões de 8h às 14h com status, convênio e sala, lista de espera ao lado.',
          label: 'Agenda',
        },
        {
          src: '/portfolio/xclinicas-lista-de-espera.jpg',
          width: 1493,
          height: 812,
          alt: 'Lista de espera: três pacientes com prioridade, tempo na fila, observação e o botão Encaixar.',
          label: 'Lista de espera',
        },
        {
          src: '/portfolio/xclinicas-pacientes.jpg',
          width: 1493,
          height: 812,
          alt: 'Pacientes: busca, filtros de ativos e inativos e a lista com idade, necessidade e aviso de cadastro incompleto.',
          label: 'Pacientes',
        },
        {
          src: '/portfolio/xclinicas-ficha.jpg',
          width: 1162,
          height: 757,
          alt: 'Ficha do paciente: painel com convênio, carteirinha, contrato e sessões, e as abas de cadastro, prontuário, anamnese e anexos.',
          label: 'Ficha do paciente',
        },
        {
          src: '/portfolio/xclinicas-indicadores.jpg',
          width: 1162,
          height: 757,
          alt: 'Indicadores do mês: agendamentos por status em barras, atendimentos e o financeiro com recebidas e pagas.',
          label: 'Indicadores',
        },
      ],
      source: 'clinica.gestaonossa.com.br',
      capturedAt: '2026-09-09',
    },
  },
] as const

export function findPortfolioItem(slug: string): PortfolioItem | undefined {
  return PORTFOLIO.find((item) => item.slug === slug)
}

export const STATE_LABEL: Readonly<Record<PortfolioItem['state'], string>> = {
  production: 'em produção',
  development: 'em desenvolvimento',
}
