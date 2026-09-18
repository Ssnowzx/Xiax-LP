## 1. Setores e orientação

- [x] 1.1 Criar `src/content/sections.ts` com os seis setores (id, nome, frase) e os tipos em `src/types/index.ts`; verificar com o teste "page sections" em `src/content/content.test.ts`
- [x] 1.2 Criar `SectionHead` e abrir cada seção com ele; mover os ids de âncora para as seções e os títulos para `-titulo`; verificar com `pnpm typecheck` e captura de tela
- [x] 1.3 Criar `SectionCompass` no cabeçalho fixo (seis células, nome, links) e `PageIndex` no hero; verificar rolando a página em 1440 px e conferindo a célula preenchida por setor
- [x] 1.4 Índice do hero em cartões com a frase de cada setor (`PageIndex`, grade com fio); verificar em 1440 e 390 px
- [x] 1.5 `ComparisonStage`: palco fixo com cartão de papel e véu no desktop, par em foco no telefone, tabela completa com movimento reduzido; verificar com `comparison-stage.test.tsx` e capturas em cinco pontos da rolagem
- [x] 1.7 Método em foco (`MethodSteps`: célula em papel, número violeta, inclinação e grade); verificar rolando o método em 1440 e 390 px
- [x] 1.8 Trava por cartão no baralho (1,2 s mínimo, fila até alcançar, volta imediata); verificar com rolagem instantânea até o fim da pista e amostragem do cartão da frente
- [x] 1.9 Frentes uma a uma (`FrontsStage` sobre `useRunway`/`Runway`; duas fileiras, núcleo ao meio, cabe na tela); verificar com `fronts-stage.test.tsx`, gestos emulados e medida de encaixe em 900 e 760 px
- [x] 1.10 Solta no quarto canto (`releaseAtLast` no `useRunway`: o gesto que traz o quarto para nele, o seguinte rola livre, para cima volta ao quarto; pista termina onde a composição solta, altura medida por `ResizeObserver`); verificar com gestos emulados, teclado e toque em 900 e 760 px, e o baralho sem regressão
- [x] 1.11 Placas de papel com placa deslocada nas quatro frentes (sem sombra), ritmo interno por altura da tela no palco; encaixe medido em 1440×{900, 836, 760, 700, 650}, 1280×{690, 653} e 1024×768, trilho do telefone com `scroll-padding`, ida e volta dos dois palcos sem falha
- [x] 1.12 Auditoria completa (console, rede, hidratação, CLS, axe, 22 larguras × 4 rotas, rolagem contínua ida e volta em 1440×900 e 1280×690, teclado, saltos de âncora com palco aberto, quadros, movimento reduzido, trilho e visor por toque, formulário vazio) e correções: snap solto antes de salto de âncora, trilho e painel do visor focáveis, tela do portfólio rola para o lado no telefone, área de toque dos links do rodapé e do portfólio, contraste da barra da janela do demo, nota do mosaico com piso de 12px
- [x] 1.6 Estilos em `globals.css` (`.section-head`, `.compass`, `.page-index`, `scroll-margin-top`); verificar com `pnpm slop:check` e `pnpm brand:check`

## 2. Gestão de Convênios no portfólio

- [x] 2.1 Capturar as cinco telas por snapshot do DOM anonimizado e renderizar em 2x; verificar com a checagem de vazamento (zero nomes e números do original no render)
- [x] 2.2 Salvar `public/portfolio/gescon-*.jpg` e a entrada em `src/content/portfolio.ts` com `redacted`; verificar com o teste "portfolio captures"
- [x] 2.3 Criar `ScreenViewer` (abas, avanço no relógio do loader, setas, movimento reduzido) e usá-lo em `SystemShowcase` para sistemas sem demo; verificar com `screen-viewer.test.tsx`

## 3. Formulário

- [x] 3.1 Reescrever `ContactForm` com cinco campos rotulados, dica e erro por campo, mantendo a ação, o honeypot e o botão como slot do núcleo; verificar enviando o formulário vazio e vendo os erros sob os campos
- [x] 3.2 Cartão em papel (`.band-ink`) com o papel pintado atrás do núcleo; verificar rolando até o contato e vendo o núcleo pousar no botão

## 4. Fechamento

- [x] 4.1 `pnpm check` e `pnpm build` verdes
- [x] 4.2 Capturas em 1440 e 390 px e sonda de largura (`scrollWidth == innerWidth`) em 320, 390, 412 e 768 px nas rotas `/`, `/portfolio` e `/contato`
- [x] 4.3 `docs/motion-spec.md` e `docs/design-brief.md` atualizados
