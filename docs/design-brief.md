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
removido. A mitigação passa a ser outra: o violeta continua ocupando só o núcleo — um único
quadrado que viaja a página — e a seção "Donos do motor" inverte a polaridade (papel branco)
para quebrar a monotonia do preto. A regra dos ~9% vale igual: nenhum fundo, faixa ou botão
extra em violeta; quando um botão fica violeta é porque o núcleo pousou nele.

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
Está nos tokens como `--color-muted-lift` e é a única extensão do manual feita aqui.

---

## 7. O que ainda não existe — e trava o planejamento

- `company/offering.md` está "a preencher": escopo, o que não entra, prazo, faixa de preço e
  critério de aceite das quatro frentes. Sem isso, as quatro páginas de frente não têm o que dizer
  além da promessa de uma linha.
- **Portfólio, por decisão do fundador (09/09/2026): só o Xclinicas, por enquanto.** Está em
  produção em `xclinicas.xiax.com.br`, com preço público. Outros sistemas da casa (Gestão Nossa,
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
- `docs/motion-spec.md` — o sistema de movimento: núcleo viajante, símbolo nascendo, carcaça de
  satélites, grade sob o cursor, operação antes/depois, mosaico das frentes, Tetris de quadrados,
  varredura violeta, Xclinicas simulado.
- `src/content/ctas.ts` — as chamadas para ação de fim de seção, uma frase por momento da leitura.
- `openspec/specs/` — as specs vigentes, por capacidade.

Fontes: `Cursor/XiaxFolder/company/brand/brand-context.md`, `company/identity.md`,
`company/offering.md`, `company/stack.md`, `company/team.md`.
