# Desenho

## Decisões, na ordem em que foram tomadas (09–10/09/2026)

1. **Stack**: Next.js 15 (App Router), React 19, TypeScript strict, Tailwind v4 com tokens da marca; Vitest; Playwright só para captura de tela. Sem biblioteca de animação: CSS (`animation-timeline`, `@property`, `@starting-style`, `linear()`) e View Transitions API.
2. **Referências** (`docs/references.md`): funil de 100 → 3 (37signals, Bakken & Bæck, thoughtbot + deploy.co). Anti-referência: os sites de software house genéricos.
3. **Marca vence a skill** (`docs/design-brief.md` §4): `#0B0B0C`, mono em dado e radius zero ficam, porque são manual, não moda.
4. **Tema escuro único** (decisão do fundador, rodada 9): o brief propunha claro por padrão; o site ficou escuro, com a faixa do motor invertida. Assinatura centralizada no rodapé também é decisão do fundador, contra o manual, e está registrada.
5. **Movimento com significado**: cada peça é uma leitura de "o centro manda, os satélites executam". Um único quadrado violeta viaja a página e termina no botão de enviar. Nada de fade-up de seção.
6. **Portfólio = prova**: a captura real é pequena; o destaque é o sistema simulado, em vetor, fiel à interface real e inerte — só o cursor "IA" opera.
7. **Núcleo das frentes**: imagem gerada por IA foi descartada; o núcleo é um mosaico fixo 10×10, 40 violeta / 60 branco, com placa branca para o texto.
8. **"IA" é da logo; no site o centro é a Xiax**: o núcleo do diagrama antes/depois leva a marca XIAX.
9. **Chamadas para ação**: trilho ao fim de cada bloco, botão no cabeçalho, barra fixa no telefone; cada botão de trilho é um ponto de pouso do núcleo, então só o botão em foco é violeta.
10. **Telefone desenhado**: sonda de largura (`innerWidth == scrollWidth`) em 320/390/412/768 nas três rotas é parte do "pronto".

## Trabalho de terceiros

Skills `emilkowalski/skills` (animate, review-animations, animation-vocabulary) copiadas em `.claude/skills/emil-*`, sem rodar instalador. Matter.js (MengTo) avaliado e recusado: física de corpo rígido gira o símbolo.
