import type { MethodStep } from '@/types'

/** How Xiax enters a company. This is a sequence, so the page may number it. */
export const METHOD: readonly MethodStep[] = [
  {
    title: 'Imersão',
    body: 'Entramos na empresa e passamos tempo com quem executa o trabalho, não só com quem o descreve. O que é dito na reunião raramente é o que trava no balcão.',
  },
  {
    title: 'Mapa do que trava',
    body: 'Listamos o que custa hora, cliente ou dinheiro hoje e ordenamos pelo custo. Tecnologia entra depois. Primeiro é o problema.',
  },
  {
    title: 'Sistema em produção',
    body: 'Construímos o núcleo e colocamos no ar, em infraestrutura nossa, não em plataforma de terceiro. Piloto não conta como entrega.',
  },
  {
    title: 'Operação assistida',
    body: 'Ficamos enquanto o sistema absorve a rotina. Quando ele roda sem a gente, o trabalho acabou.',
  },
] as const
