/**
 * Section-end calls to action. Every one of them leads to the same form;
 * the label says what the person is about to do there, in their own voice.
 */
export interface Cta {
  readonly lede: string
  readonly action: string
}

export const CTAS = {
  service: {
    lede: 'Se a sua operação roda em planilha, WhatsApp e assinatura solta, é o caso típico. Conte como é a sua.',
    action: 'Descrever a minha operação',
  },
  method: {
    lede: 'Começa com uma conversa: você descreve o que trava, a gente diz se cabe.',
    action: 'Marcar a conversa',
  },
  portfolio: {
    lede: 'Um sistema assim, para a sua operação, começa pelo mesmo lugar.',
    action: 'Pedir um sistema assim',
  },
  engine: {
    lede: 'Sistema seu, rodando em máquina nossa. Se hoje você paga aluguel de ferramenta, vale a conversa.',
    action: 'Falar sobre o meu sistema',
  },
} as const satisfies Record<string, Cta>
