/** Institutional copy. Source of truth: the company repo (XiaxFolder/company). */

export const COMPANY = {
  name: 'Xiax',
  legalName: 'Xiax Tecnologia e Desenvolvimento Ltda.',
  /** The fixed brand signature. Campaign lines change; this one does not. */
  signature: 'IA no núcleo da operação.',
  /** Approved alternates, by context. */
  lines: {
    sales: 'Em produção, não em piloto.',
    authority: 'Donos do motor.',
    contrast: 'Sistemas, não assinaturas.',
    institutional: 'Tecnologia que entra em produção.',
  },
  description:
    'A Xiax entra na operação da empresa, encontra o que trava e constrói o sistema que resolve, com IA no núcleo e em infraestrutura própria.',
  hero: {
    /** Three sentences, three lines. Each one is a verb the client can hold us to. */
    headline: ['Entramos na sua operação.', 'Encontramos o que trava.', 'Colocamos o sistema em produção.'],
    lede: 'Passamos dias dentro da sua empresa, com quem faz o trabalho. Construímos o sistema inteiro que resolve o que custa hora e dinheiro, com IA no núcleo, e rodamos em infraestrutura própria.',
    primaryCta: 'Contar a minha operação',
    secondaryCta: 'Ver o que está no ar',
  },
  service: {
    title: 'O que fazemos pela sua operação',
    lede: 'Uma operação que roda em planilha, WhatsApp e três assinaturas vira um sistema só, construído em volta do seu processo. A IA entra onde tira trabalho de gente: confirmação, triagem, conciliação, resposta.',
    /** Column headings of the comparison table. Plain words, no jargon. */
    columns: { market: 'Software sob encomenda', xiax: 'Xiax' },
    /** The whole table, after the pairs have been shown one by one. */
    table: {
      title: 'O que muda, lado a lado',
      lede: 'Os cinco pares juntos, para comparar de uma vez como o software sob encomenda trabalha e como a Xiax trabalha.',
    },
  },
  engine: [
    {
      title: 'Infraestrutura própria',
      body: 'VPS e Docker sob nosso controle. Nenhuma plataforma de terceiro no núcleo do sistema.',
    },
    {
      title: 'Dado no Brasil',
      body: 'Dado pessoal fica em região brasileira, com LGPD desde o desenho, não como ajuste no fim.',
    },
    {
      title: 'Sistema, não assinatura',
      body: 'O que entregamos é o sistema inteiro rodando, não um pacote de licenças que some quando o contrato acaba.',
    },
  ],
  social: {
    github: 'https://github.com/Ssnowzx',
  },
} as const
