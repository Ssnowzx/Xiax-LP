# Brief de design — site da Xiax

Documento de entrada para quem vai planejar o site. Junta três fontes que, sozinhas,
se contradizem em alguns pontos:

1. `Cursor/XiaxFolder/company/brand/brand-context.md` — manual de marca, fechado em 19/08/2026.
2. `company/identity.md` e `company/offering.md` — posicionamento e frentes.
3. A skill `frontend-design` (Anthropic) — regras anti-slop, instalada neste projeto.

Onde elas brigam, este documento decide. **A marca ganha da skill sempre**, porque a skill
diz explicitamente que o brief do cliente vence quando ele fixa uma direção visual.

---

## 1. O que a Xiax é (uma tela)

Empresa de tecnologia brasileira, IA-first, que constrói o sistema inteiro do cliente com
IA no núcleo da operação. Roda em infraestrutura própria: VPS, Docker, self-host. Cada
frente é sistema em produção, não piloto.

Público: empresa brasileira que precisa de sistema que funcione, não de mais uma assinatura.

Ordem do que a marca comunica: **1) engenharia de verdade · 2) o motor é nosso · 3) sobriedade.**
Sobriedade é a terceira, mas é a que reprova design: cliente empresa precisa confiar antes de gostar.

Assinatura fixa: **"IA no núcleo da operação."**
Alternativas aprovadas por contexto: "Em produção, não em piloto." (venda) · "Donos do motor."
(peça pequena) · "Sistemas, não assinaturas." (contraste com SaaS) · "Tecnologia que entra em
produção." (institucional).

**Restrição estrutural:** Xiax é marca guarda-chuva. Nenhuma peça institucional pode amarrar a
marca a um produto. Produto tem cor e nome próprios; a Xiax aparece igual no rodapé.

---

## 2. Regras de marca inegociáveis

### Geometria
Grade de 100 unidades. Quatro satélites de 22u a 6u das bordas; núcleo de 30u centrado com
folga de 7u. Respiro de 1 satélite (22u) em todos os lados. Vão símbolo–nome no lockup: 1 satélite.

Leitura correta do símbolo: **hierarquia, não rede.** O centro manda, os satélites executam.
Quem desenhar "nós conectados" leu errado.

Mínimos: símbolo isolado 16px; lockup só a partir de 24px de altura de símbolo.

### Cor
**A cor aparece só no núcleo.** Satélites e wordmark são sempre preto ou branco.

| Papel | Valor |
|---|---|
| Núcleo, fundo claro | `oklch(0.52 0.17 295)` ≈ `#7B57D4` |
| Núcleo, fundo escuro | `oklch(0.60 0.18 295)` ≈ `#8E6FE0` |
| Estrutura escura | `#0B0B0C` |
| Estrutura clara | `#FFFFFF` |
| Texto secundário | `#6E6E72` |

O violeta ocupa ~9% da área da marca. **Essa proporção é a regra do site também**: violeta é
marcador de onde está o diferencial, não cor de fundo, não gradiente, não wash.

### Tipografia
Archivo 700 caixa alta tracking 0.30em na marca · Archivo 800 tracking −0.03em nos títulos ·
Archivo 400 no texto · IBM Plex Mono 400 em dado, etiqueta e código.

### Movimento
Ciclo padrão do loader 1,6s. Ação curta 1,1s. Processo longo 2s. Oito variações de loader já
especificadas no manual — a mais útil aqui é "do centro para fora" (núcleo pulsa, satélites
nascem do centro um a um): é literalmente o sistema sendo montado.

Com `prefers-reduced-motion`, cai para pulso do núcleo ou símbolo estático. O loader nunca é a
única indicação de carregamento.

### Proibido
Distorcer, girar, sombra, inverter (satélite colorido e núcleo preto), fundo de luminosidade
média, colar símbolo no nome, assinatura centralizada ou em caixa alta.

Tropos visuais e verbais banidos: cérebro, rede neural, circuito, nós conectados, partículas,
gradiente holográfico, robô, balão de conversa, foguete, seta subindo, gráfico crescente, globo,
hexágono genérico de tech. E off-white quente com laranja-barro.

Verbal: nada de "revolucionário", "disruptivo", "mágico", nem número que não podemos provar.
Teste: se a frase caberia num pitch genérico de IA, reescreva.

---

## 3. Regras anti-slop (skill `frontend-design`)

Os cinco clusters que hoje denunciam página gerada por IA:

1. Fundo creme quente (~`#F4F1EA`) + serifada de alto contraste + acento terracota (~`#D97757`).
2. Fundo quase-preto com um acento ácido único.
3. Layout broadsheet: fios capilares, radius zero, colunas densas de jornal.
4. Kit SaaS-card: tudo picado em cards arredondados iguais, um só radius, a mesma sombra
   `rgba(0,0,0,.1)` embaixo de cada um, gradiente como decoração.
5. Cromo de template: eyebrow em CAIXA ALTA espaçada acima de todo título; metadados juntados
   com ponto médio (`A · B · C`); rótulo `PALAVRA — fragmento` com travessão espaçado;
   quase-preto tingido (`#0B0B0B`, `#111`) no lugar de preto; monoespaçada em rótulo pequeno;
   `→` grudado no texto de botão e link.

Mais três regras da skill que valem aqui:

- **Movimento não pedido, com parcimônia.** Um momento orquestrado (uma sequência de entrada,
  um reveal) vale mais que efeito espalhado. Fade-and-slide-up em cada seção e transição de
  hover em cada card *são* o default genérico.
- **Estrutura é informação.** Fio, borda, numeração e rótulo codificam algo sobre o conteúdo,
  não decoram. Marcador numerado (01 / 02 / 03) só se o conteúdo for mesmo uma sequência.
- **Gaste a ousadia num lugar só.** Um elemento é o memorável; o resto fica quieto.

---

## 4. Conflitos resolvidos

A marca da Xiax cai em cima de três itens da lista anti-slop. Decisão para cada um:

| Item | Skill diz | Marca diz | Decisão |
|---|---|---|---|
| `#0B0B0C` quase-preto | é tell de IA | é a cor de estrutura da marca | **Marca vence.** É valor de manual, não escolha estética de hoje. |
| Monoespaçada em rótulo pequeno | é tell de IA | IBM Plex Mono para dado, etiqueta e código | **Marca vence, com trava:** mono só em dado real — número, identificador, timestamp, código. Nunca como eyebrow decorativa. |
| Radius zero | compõe o cluster broadsheet | símbolo é feito de quadrados | **Marca vence.** Radius 0 é a geometria, não empréstimo de estilo. Mitigação: nada de colunas densas nem fio capilar em toda seção. |

Onde as duas concordam, é regra dupla e não se discute: assinatura nunca em caixa alta
(manual §7 e skill), nada de gradiente decorativo, nada de `→` em botão.

---

## 5. O risco específico deste projeto

**Fundo quase-preto com um acento único é o cluster #2 do anti-slop — e a Xiax é literalmente
`#0B0B0C` + violeta.** Um site escuro com violeta é a coisa mais previsível que este brief
pode produzir, e o violeta já é reconhecidamente cor frequente em produto de IA entre 2024 e 2026.

Mitigação que o próprio manual entrega: o violeta ocupa ~9% da marca. Traduzido para o site,
a proposta original era **padrão claro** — papel branco, estrutura preta, violeta só nos
momentos de núcleo.

**Decisão do fundador (10/09/2026): o site é escuro, e só escuro.** O tema claro foi
removido. **Revisão do fundador (17/09/2026): "muito preto e branco, sem vida; os setores
parecem uma coisa só".** A resposta é ritmo de superfícies, não cor nova: a página é tinta,
e os setores 02 (método) e 04 (o que está no ar) são papel branco, com o cartão do contato,
o baralho da comparação e a folha da tabela também em papel. O violeta continua marcador:
o núcleo que viaja a página, os números que guiam a leitura (índice, cabeçalhos de setor,
passo em foco), o átomo e a varredura nos cartões. Nenhum fundo ou faixa em violeta; quando
um botão fica violeta é porque o núcleo pousou nele.

Duas outras decisões do fundador contrariam o manual e estão registradas aqui de propósito:
a assinatura no rodapé é centralizada, e o núcleo do diagrama antes/depois leva a marca
"XIAX" (no site, o centro é a Xiax; "IA" é vocabulário da logo).

Segundo risco: "IA no núcleo" convida a desenhar um núcleo pulsante genérico. O manual já
proíbe partícula, rede e circuito — o núcleo precisa ser o quadrado de 30u, não uma esfera de luz.

---

## 6. Acessibilidade: contrastes já calculados

| Par | Razão | Veredito |
|---|---|---|
| `#6E6E72` sobre `#FFFFFF` | 5,08:1 | passa AA |
| `#6E6E72` sobre `#0B0B0C` | 3,88:1 | **reprova AA** para texto pequeno |
| `#7B57D4` sobre `#FFFFFF` | 5,05:1 | passa AA |
| `#7B57D4` sobre `#0B0B0C` | 3,90:1 | **reprova AA** — use `#8E6FE0` |
| `#8E6FE0` sobre `#0B0B0C` | 5,16:1 | passa AA |

O manual já resolve o violeta em fundo escuro (`#8E6FE0`), mas **não define secundário para
fundo escuro**. Proposta a validar com quem cuida da marca: `#8E8E93` (6,04:1 sobre `#0B0B0C`).
Está nos tokens como `--color-muted-lift`.

Segunda extensão, por decisão do fundador em 17/09/2026 ("o branco dos fundos machuca os
olhos"): **papel suave `oklch(0.96 0.004 295)`** (≈ `#F4F3F6`) para toda superfície de papel
(setores 02 e 04, folha da tabela, cartões do baralho, do contato e do método). O texto em
papel sobre tinta continua `#FFFFFF`. Contrastes sobre o papel suave: `#0B0B0C` 17:1 ·
`#6E6E72` 4,6:1 (passa AA) · `#7B57D4` 4,6:1 (passa AA). Token `--color-paper-soft`, na lista
da guarda de marca.

---

## 7. O que ainda não existe — e trava o planejamento

- `company/offering.md` está "a preencher": escopo, o que não entra, prazo, faixa de preço e
  critério de aceite das quatro frentes. Sem isso, as quatro páginas de frente não têm o que dizer
  além da promessa de uma linha.
- **Portfólio: Xclinicas e, desde 17/09/2026, a Gestão de Convênios** (`gescon.gestaonossa.com.br`,
  a esteira de convênios do Xclinicas, em produção). As telas da Gestão de Convênios são reais,
  capturadas do sistema em uso, com nome de paciente, carteirinha e número de guia substituídos
  antes da publicação; a legenda declara a substituição. Outros sistemas da casa (Gestão Nossa,
  Só Boleiros, Xiax para barbearias) ficam fora até haver autorização e estado confirmado.
- `company/team.md` está quase vazio: sem papéis nem contatos para a página Sobre.
- Sem domínio, e-mail de contato e endpoint de formulário confirmados.

---

## 8. O que já está escrito no repositório

- `src/app/globals.css` — tokens em Tailwind v4. Escala de espaço derivada da grade 100u a 4px/u
  (`margin` 6u=24px · `clearance` 7u=28px · `satellite` 22u=88px · `core` 30u=120px · `orbit` 44u=176px),
  escala tipográfica, tokens de movimento com o relógio do loader, e `prefers-reduced-motion` como contrato.
- `src/components/brand/mark.tsx` — geometria exata do manual, com a regra de cor no núcleo em código.
- `src/types/index.ts` — contratos de Frente, Case (com `source` obrigatório em cada número) e status.
- `src/content/fronts.ts` — as quatro frentes, com escopo vazio até `offering.md` sair do "a preencher".
- `src/components/sections/fronts-stage.tsx` — as quatro frentes como os satélites do símbolo:
  placas de papel com contorno de tinta em volta do núcleo violeta, cada uma com uma placa de
  tinta-cinza deslocada 0,75 rem atrás. Profundidade por geometria, como o símbolo é construído;
  sem sombra (o fundador pediu "uma sombra atrás das caixas" e a marca responde assim). No palco,
  o ritmo interno das placas (padding, loader, vãos, corpo do título e da promessa) acompanha a
  altura da tela, para as quatro caberem inteiras de 650 px em diante.
- `docs/motion-spec.md` — o sistema de movimento: núcleo viajante, símbolo nascendo, carcaça de
  satélites, grade sob o cursor, operação antes/depois, mosaico das frentes, Tetris de quadrados,
  varredura violeta, Xclinicas simulado.
- `src/content/ctas.ts` — as chamadas para ação de fim de seção, uma frase por momento da leitura.
- `src/content/sections.ts` — os seis setores numerados da página (nome e uma frase cada). Cada
  setor abre com fio, número e nome (`SectionHead`); o hero termina no índice dos seis; a bússola
  do cabeçalho mostra o setor em tela; o índice do hero são seis células de uma grade com fio
  (número, nome e a frase), não cards soltos. Numeração permitida porque a página é uma
  sequência de argumento, e sempre em caixa baixa: nada de eyebrow.
- `src/components/sections/comparison-stage.tsx` — a comparação "software sob encomenda | Xiax"
  um par por vez: palco fixo com cartão de papel sobre a lista velada (desktop) ou o par do meio
  da tela em papel (telefone). Sem sombra: o "flutuar" vem do papel sobre o véu escuro.
- `src/components/motion/use-runway.ts` e `runway.tsx` — a pista e a trava dos palcos: um passo por
  gesto, snap obrigatório enquanto um passo está aberto, solta no último quando o palco pede
  (`releaseAtLast`), e solta antes de qualquer salto de âncora. A entrada da pista tem de ser mais
  alta que a linha do passo (30 vh), ou não há caminho de volta do primeiro passo.
- `src/components/sections/screen-viewer.tsx` — telas reais numa janela Xiax, uma aba por módulo.
  No telefone a tela mantém altura legível e rola para o lado sob o dedo; o painel ativo é focável.
- `openspec/specs/` — as specs vigentes, por capacidade.

---

## 9. Auditoria antes de dizer "pronto"

Além de `pnpm check` e `pnpm build`, uma mudança visual ou de rolagem só está pronta depois de
passar, com Playwright, por:

- **Rotas** (`/`, `/portfolio`, `/contato`, `/privacidade`), em desktop e telefone: console sem
  erro nem aviso, nenhuma requisição falha, sem aviso de hidratação, CLS abaixo de 0,1, axe sem
  violação crítica ou séria (as únicas aceitas: os pares ainda não lidos da comparação, apagados
  de propósito no telefone; a barra da janela do demo enquanto ainda entra em tela).
- **Largura**: `scrollWidth == innerWidth` em 22 larguras de 320 a 1920 px, nas quatro rotas.
- **Rolagem contínua**: gestos emulados de trackpad de cima a baixo e de volta, em 1440×900 e
  1280×690, sem ponto em que três gestos seguidos não movam a página; `scroll-snap-type` volta a
  vazio no fim; PageDown e PageUp atravessam a página inteira.
- **Palcos**: ida por todos os passos, zona livre, volta ao repouso, volta passo a passo até a
  entrada, saída para cima, teclado a partir do primeiro passo, reentrada por baixo (comparação e
  frentes, 900 e 760 px); as quatro placas das frentes inteiras em 1440×{900, 836, 760, 700, 650},
  1280×{690, 653} e 1024×768.
- **Âncoras com palco aberto**: cabeçalho, bússola e índice a partir de um cartão aberto ou de uma
  frente à vista chegam ao setor pedido, com o snap desligado.
- **Quadros**: nenhum quadro acima de 250 ms durante gestos no hero, no baralho e nas frentes
  (headless, sem GPU: indicativo).
- **Movimento reduzido**: a mesma travessia, sem palco e sem snap em momento algum.
- **Telefone**: trilho das frentes e tela do portfólio rolam para o lado por toque; alvos de toque
  de links com pelo menos 24 px; formulário vazio mostra os quatro erros e não envia.

Fontes: `Cursor/XiaxFolder/company/brand/brand-context.md`, `company/identity.md`,
`company/offering.md`, `company/stack.md`, `company/team.md`.
