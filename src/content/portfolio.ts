import type { PortfolioItem } from '@/types'

/**
 * Systems Xiax built. The list is short on purpose: a system enters here when
 * it exists, with its real state. "Em produção" means people use it today.
 *
 * Client-owned systems appear only with the client's authorisation to be named.
 * Every line below comes from the product's own pages.
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
  {
    slug: 'gestao-de-convenios',
    name: 'Gestão de Convênios',
    url: 'https://gescon.gestaonossa.com.br',
    owner: 'xiax',
    clientNamed: true,
    front: 'plataformas',
    summary:
      'A esteira de convênios do Xclinicas: do pedido médico à conciliação do que o convênio pagou, com a guia gerada e acompanhada por automação no portal da operadora.',
    forWhom:
      'Clínica que atende por convênio e descobre tarde a guia negada, a senha vencida e a glosa.',
    built: [
      'Solicitações: o pedido médico escaneado é lido por IA e vira o formulário preenchido, para conferência',
      'Guias geradas e consultadas por automação no portal da Unimed, com senha de autorização e validade acompanhadas',
      'Guias negadas e com restrição sinalizadas para revisão no painel',
      'Antecipações: o próximo ciclo da guia preparado antes do vencimento, para revisar e enviar',
      'Sessões lançadas pela foto ou pela webcam da folha de registro, contando contra a cota da guia',
      'Analítico do convênio importado e conciliação financeira: pendente, conferida, paga',
      'Auditoria de cada alteração e uma clínica por tenant',
    ],
    stack: ['React', 'Laravel'],
    state: 'production',
    screens: {
      screens: [
        {
          src: '/portfolio/gescon-solicitacoes.jpg',
          width: 3200,
          height: 2000,
          alt: 'Solicitações: a lista de pedidos médicos com paciente, convênio, itens com a guia e o status, o médico e o botão Ler pedido médico.',
          label: 'Solicitações',
        },
        {
          src: '/portfolio/gescon-guias.jpg',
          width: 3200,
          height: 2000,
          alt: 'Guias: avisos de guias negadas e com restrição, filtros e a tabela com número, paciente, carteirinha, especialidade, profissional, status, sessões e senha.',
          label: 'Guias',
        },
        {
          src: '/portfolio/gescon-automacoes.jpg',
          width: 3200,
          height: 2000,
          alt: 'Automações: as execuções na Unimed, uma por linha, com a operação, o status e o botão Tentar novamente.',
          label: 'Automações',
        },
        {
          src: '/portfolio/gescon-antecipacoes.jpg',
          width: 3200,
          height: 2000,
          alt: 'Antecipações: guias aprovadas perto do próximo ciclo, cada uma com a data prevista e os botões Ignorar e Gerar.',
          label: 'Antecipações',
        },
        {
          src: '/portfolio/gescon-painel.jpg',
          width: 3200,
          height: 2000,
          alt: 'Painel: saúde do sistema, novidades e os contadores de guias negadas, com restrição, em análise e prontas para antecipação.',
          label: 'Painel',
        },
      ],
      source: 'gescon.gestaonossa.com.br',
      capturedAt: '2026-09-17',
      redacted: 'Nomes, carteirinhas e números de guia foram substituídos.',
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
