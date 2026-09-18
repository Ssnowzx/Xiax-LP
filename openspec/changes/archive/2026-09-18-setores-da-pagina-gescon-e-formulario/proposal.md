## Why

A página vende o serviço, mas lê como um rolo só: as seções têm a mesma cara, não há índice nem marca de posição, e o formulário em frase com lacunas não é reconhecido como formulário. O portfólio mostra um sistema, e o diferencial de automação da casa, a esteira de convênios em produção em `gescon.gestaonossa.com.br`, fica de fora.

## What Changes

- A página inicial passa a ter seis setores numerados (serviço, método, frentes, no ar, motor, contato). Cada setor abre com um cabeçalho de setor: fio, número, nome e uma frase sobre o que está ali. O hero termina num índice dos seis setores em cartões (número, nome e a frase de cada um). O cabeçalho fixo ganha uma bússola de seis células que mostra o setor em tela e leva a cada um.
- A comparação "software sob encomenda | Xiax" passa a ser apresentada um par por vez: no desktop o bloco fixa enquanto a rolagem caminha os pares, com um cartão de papel flutuando sobre a lista desfocada; no telefone o par no meio da tela vira o cartão. No fim, a tabela inteira fica à vista, riscada e acesa.
- O portfólio ganha o segundo sistema, "Gestão de Convênios", com cinco telas reais num visor com abas dentro da janela Xiax. As telas foram capturadas do sistema em produção com nome de paciente, carteirinha e número de guia substituídos, e a legenda diz isso.
- O formulário de contato deixa a frase com lacunas: cinco campos com rótulo, dica e erro embaixo, num cartão de papel (polaridade invertida), com o núcleo viajante ainda pousando no botão de enviar.
- Os ids de âncora passam para as seções (`#servico`, `#metodo`, `#frentes`, `#no-ar`, `#motor`, `#contato`); os títulos ganham `-titulo`.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `pagina-de-vendas`: ordem e conteúdo das seções (setores numerados com cabeçalho de setor, índice no hero, bússola no cabeçalho fixo, ids de âncora); ritmo de superfícies (setores 02 e 04 em papel, números-guia em violeta).
- `portfolio`: a lista deixa de ser "só o Xclinicas"; captura com dado pessoal substituído e legenda que declara a substituição; visor de telas reais.
- `formulario-de-contato`: a "frase com lacunas" sai; entram campos com rótulo em cartão de papel.
- `movimento-de-marca`: o visor de telas avança no relógio do loader; a comparação vira um palco de rolagem com baralho de cartões, véu e trava por cartão; o método ganha foco por passo; o mosaico das frentes passa a anéis ordenados; o cartão de contato inverte a polaridade sem esconder o núcleo.

## Impact

- Conteúdo: `src/content/sections.ts` (novo), `src/content/portfolio.ts`, `src/types/index.ts`.
- Layout: `src/components/layout/section-head.tsx` e `section-compass.tsx` (novos), `site-header.tsx`.
- Seções: `page-index.tsx`, `screen-viewer.tsx` e `comparison-stage.tsx` (novos); hero, serviço, método, frentes, portfólio, motor, contato, `system-showcase.tsx`, `contact-form.tsx`.
- Estilo e mídia: `src/app/globals.css`, `public/portfolio/gescon-*.jpg`, `scripts/screenshots.mjs`.
- Testes: `src/content/content.test.ts`, `src/components/sections/screen-viewer.test.tsx`, `src/test/setup.ts` (limpeza entre testes).
- Documentação: `docs/motion-spec.md`, `docs/design-brief.md`.
