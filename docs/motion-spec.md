# Movimento — o que se move, por quê, e o que nunca se move

Regra de origem: **o centro manda, os satélites executam** (manual da marca, §2). Todo
movimento do site é uma leitura dessa frase. Nada se move por decoração. As exigências estão
em `openspec/specs/movimento-de-marca/spec.md`; aqui está o desenho de cada peça.

| Peça | O que faz | Dispara | Desliga com |
|---|---|---|---|
| **Núcleo viajante** | Um único quadrado violeta. Nasce como núcleo do símbolo no hero e, ao rolar, voa e encaixa no núcleo de cada seção — o diagrama do serviço, o símbolo do método, o mosaico das frentes, o portfólio, o motor — e em cada botão de chamada para ação, até terminar no botão "Enviar mensagem". | scroll | `prefers-reduced-motion` → cada seção pinta o próprio núcleo, parado. Sem JS: idem. |
| **Nascimento do símbolo** | Núcleo aparece, satélites nascem do centro em sentido horário, 0,2 s de defasagem (variação "do centro para fora" do manual). Uma vez, no carregamento. | load | reduced-motion → símbolo estático |
| **Splash de entrada** | Primeira visita da sessão: o GIF de órbita do manual, no preto, um ciclo (1,6 s); a página entra por baixo. O símbolo do hero só nasce depois. | load | reduced-motion, visita repetida |
| **Carcaça em escala de página** | Os quatro satélites do símbolo, vazados, fixos nos cantos da tela atrás de tudo; abrem conforme a página rola e fecham no fim (`animation-timeline: scroll(root)`). Com o núcleo viajando por dentro, a página é o X · IA · X. | scroll | < 64 rem, sem suporte ou reduced-motion: parados |
| **Grade sob o cursor** | A grade de engenharia de 100u numa camada fixa da página toda (`PageGrid`), visível só num raio ao redor do cursor. | pointer | toque, reduced-motion |
| **Satélites inclinam** | No hero, até 3u na direção do cursor. O núcleo não se move. | pointer | toque, reduced-motion |
| **A operação, antes e depois** | Nove quadrados espalhados (planilha, WhatsApp, ERP alugado…) viram o símbolo: quatro partes que se falam e o núcleo com a marca XIAX; o duplicado some. Toca ao entrar na tela; dois botões refazem. | scroll, clique | — (transição instantânea em reduced-motion) |
| **Comparação, um par por vez** | A lista dos cinco pares é o conteúdo e o registro. A partir de 64 rem, a primeira tela da seção (título, apoio e o diagrama antes/depois) fixa (sticky) e a rolagem caminha os pares: meio passo de tela à vista, um passo (50 vh) por par, meio passo final. Enquanto um par está aberto, um véu fixo cobre a janela inteira abaixo do cabeçalho (`backdrop-filter: blur`) e um baralho de cartões de papel flutua no centro da tela: o da frente é o par lido, com a linha do mercado riscada, a frase da Xiax varrida em violeta atrás de um átomo violeta, o contador "01 de 05", cinco células (violeta as lidas) e a dica "role para o próximo"; os já lidos ficam empilhados atrás, espiando pelo topo. **Trava por cartão:** com a tela fixa e um cartão aberto (ou prestes a abrir), cada gesto de roda, trackpad ou teclado leva a página a exatamente um cartão, o próximo ou o anterior, rolando suave até a parada dele; o resto do mesmo gesto é ignorado. Um gesto novo se reconhece por silêncio, mudança de direção ou duas subidas seguidas de intensidade (a inércia só decai). Enquanto um cartão está aberto, a página inteira fica em `scroll-snap-type: y mandatory` e cada parada é `scroll-snap-stop: always`, então a inércia que o navegador não deixa cancelar também para no próximo cartão. Da saída da pista, um gesto para cima volta ao cartão 05 enquanto a saída ainda está na tela; mais abaixo, a rolagem é livre. A página nunca corre na frente do cartão. O baralho inclina até 4° na direção do cursor e o cartão da frente mostra a grade de engenharia ao redor do ponteiro. Depois do quinto cartão o baralho fecha sobre a primeira tela, nítida de novo, e há uma tela inteira de pista antes da folha: a tabela sobe pela borda de baixo como uma folha de papel opaca, com título e frase, por cima da primeira tela ainda fixa, cobrindo-a; a tela solta no fim da folha. Sem sombra: papel, contorno de tinta e o véu. No telefone e no tablet não há palco: o par mais perto do meio da tela vira o cartão de papel, com a mesma varredura. | scroll, pointer | toque: sem inclinação nem grade; reduced-motion: tabela completa, parada, sem véu |
| **Método em foco** | Os quatro passos são células de uma coluna com fio. O passo mais perto do meio da tela vira papel, com o número em violeta e o texto em tinta; os já lidos ficam acesos, os à frente esperam apagados. A célula em foco inclina na direção do cursor e mostra a grade ao redor do ponteiro. O símbolo ao lado continua preenchendo um satélite por passo alcançado. | scroll, pointer | toque: sem inclinação; reduced-motion: todos acesos, sem foco |
| **Frentes nascem uma a uma** | A partir de 64 rem, a composição das quatro frentes fixa (sticky), em duas fileiras com o núcleo ao meio, dimensionada para caber inteira na tela. Cada frente é uma placa de papel com contorno de tinta e uma placa de tinta-cinza deslocada atrás (profundidade sem sombra). A pista tem uma parada por frente: a cada gesto, uma frente nasce do centro para o seu canto (opacidade, deslocamento de 4 rem a partir do núcleo e escala 0,94 → 1, 640 ms), a mesma ordem do loader "do centro para fora". Mesma trava de gesto do baralho (gancho `useRunway`, snap obrigatório compartilhado entre os palcos), mas solta no quarto (`releaseAtLast`): o gesto que traz o quarto canto para nele, com a composição parada; o gesto seguinte rola livre, sem parada extra, e a pista termina exatamente onde a composição solta (altura da composição medida pelo componente). Para cima, de além do quarto, a página volta ao quarto antes de recuar um canto. Abaixo de 64 rem as quatro ficam no lugar. | scroll, gesto | reduced-motion e < 64 rem: as quatro paradas, sem palco |
| **Mosaico das frentes** | O núcleo da seção é uma grade fixa 10×10 ordenada como a grade da marca: anel externo violeta (células transparentes, que o núcleo viajante pinta quando pousa), segundo anel intercalado violeta e branco em simetria espelhada, centro branco. Placa branca no meio (linhas 3–6, colunas 1–8) com o texto em tinta, dimensionado em `cqw`. Não anima: a animação é o núcleo chegando. | scroll (núcleo) | — |
| **Loaders do manual nas frentes** | Cada frente carrega a variação cuja função no manual combina: "do centro para fora" (plataformas), "em passos" (gestão), "órbita contínua" (automação), "em sequência" (produtos). | sempre, em loop de 1,6 s | reduced-motion → símbolo parado |
| **Visor de telas reais** | Telas reais de um sistema numa janela Xiax, uma aba por módulo. Enquanto ninguém toca nas abas e o visor está em tela, as telas avançam a cada 4,8 s (três ciclos do loader) e o sublinhado da aba ativa preenche no mesmo tempo. Clique ou seta do teclado entregam as abas à pessoa. Abaixo de 48 rem a tela mantém uma altura legível (62 svh, até 30 rem) e rola para o lado sob o dedo, com a dica "arraste a tela para o lado"; o painel ativo é focável. | scroll (visor em tela), clique, arrasto lateral (telefone) | reduced-motion: sem avanço |
| **Bússola de setores** | No cabeçalho fixo, seis células, uma por setor numerado da página: a do setor em tela preenchida, as já lidas apagadas, as outras vazadas, e o número com o nome ao lado. Cada célula é um link para o setor. Só preto e branco: violeta é do núcleo. | scroll | < 48 rem: oculta (os cabeçalhos de setor orientam) |
| **Janela do demo** | Moldura desenhada pela Xiax (três quadrados, endereço, etiqueta "demonstração" a partir de 48 rem), entra com mola ao aparecer e flutua devagar (7 s). O endereço encurta antes de alargar a página. | scroll | reduced-motion: parada |
| **Sistema simulado** | Um Xclinicas funcionando no navegador, sem back-end: agenda por profissional, lista de espera como coluna da agenda, financeiro e indicadores compartilham um estado. A moldura é inerte: só o **cursor-núcleo** (quadrado violeta com "IA") opera, em loop. Movimentos de elemento pela View Transitions API (a sessão *vai* da fila para a agenda); toasts e menus entram com `@starting-style`; cursor com easing `linear()` de mola. Tela real pequena ao lado como prova. | scroll | reduced-motion: sem roteiro, sem transições |
| **Setores de papel** | Os setores 02 (método) e 04 (o que está no ar) invertem os tokens: papel branco no site escuro; o cartão do formulário de contato faz o mesmo. O núcleo viajante continua visível por trás, porque o papel é pintado atrás dele. O passo do método em foco toma a polaridade oposta à do setor (tinta sobre papel). | — | — |
| **Trilhos de ação** | Ao fim de serviço, método, portfólio e motor: uma frase e um botão. O botão é um ponto de pouso do núcleo — violeta só enquanto o núcleo está nele; os outros ficam de contorno. | scroll (núcleo) | reduced-motion: cada botão pinta o próprio violeta |
| **Destaque violeta** | Título e apoio do contato e a etiqueta do card: o violeta varre as palavras conforme a página rola (`@property --sweep` no bloco, `background-size` no texto), e as letras escurecem por onde ele passou. Nos setores de papel, a mesma varredura vira **sublinhado** violeta (`.sweep-line`) sob os títulos, os nomes dos sistemas e o título da folha. Sem linha do tempo de scroll, `SweepDriver` faz o mesmo em JS. | scroll | reduced-motion: coberto e parado |
| **O núcleo termina no botão** | O último encaixe do núcleo viajante é o botão "Enviar mensagem": o violeta que se seguiu vira a ação. O cartão do formulário é papel pintado atrás do núcleo (z -2), para o núcleo aparecer por trás do botão. | scroll | reduced-motion: botão violeta parado |
| **Títulos entram por varredura** | `clip-path` da esquerda para a direita ao entrar na tela (`animation-timeline: view()`). | scroll | reduced-motion: sem varredura |
| **Rodapé vivo** | A marca centralizada com o loader "órbita contínua" no lugar do símbolo parado. | sempre | reduced-motion: símbolo parado |
| **Tetris de quadrados** | Acima da linha do rodapé, quadrados caem em colunas (gravidade), encaixam na linha ou sobre os já empilhados; uma fileira completa pisca em violeta e some, as de cima descem. Um em nove é o núcleo. Toque numa coluna e cai um ali. Canvas, nítido em qualquer tela; só roda com a área visível. | scroll, clique | reduced-motion: pilha parada |
| **Botões** | O átomo da marca — um quadrado de 6 px — desliza antes do rótulo no hover e no foco. | hover, foco | reduced-motion |

## Relógio

Tudo usa o relógio do loader: 180 ms (resposta ao cursor), 320 ms (transição base),
640 ms (voo do núcleo), 1,1 s (ação curta), 1,6 s (ciclo). Uma curva: `cubic-bezier(0.2, 0, 0, 1)`.

## O que nunca acontece

Fade-and-slide-up de seção. Hover em card. Parallax de fundo. Partícula. Scroll sequestrado
(smooth scroll de biblioteca) — com uma exceção decidida pelo fundador em 17/09/2026: dentro da
pista da comparação, cada gesto avança um cartão. Sombra. Cor fora do núcleo — com a exceção que o próprio manual
abre: nos loaders "órbita" e "rastro", o violeta circula pelas posições dos satélites.

## Como o núcleo viajante funciona

`TravelingCore` (`src/components/motion/traveling-core.tsx`) é um `div` absoluto de 30×30 px
com `z-index: -1`, atrás do conteúdo. Cada seção — e cada botão de ação — tem um *slot*,
elemento com `data-core-slot`, que pinta o próprio violeta até o JS ligar `html.core-travels`;
a partir daí o slot fica transparente e o viajante se posiciona por `translate + scale` na
caixa do slot em coordenadas do documento. O slot ativo é o último cujo topo passou 80% da
altura da janela (`FOCUS_LINE`); a troca liga uma transição de 640 ms. Um slot que o núcleo
deixou fica só com contorno. Redimensionamento e carregamento de fonte reposicionam sem
transição. Regra derivada: nenhum contêiner entre um slot e a página pode ter fundo opaco,
senão o núcleo pousa escondido (foi o caso do card do contato, corrigido).

## Celular e tablet (desenhado, não só encaixado)

| Onde | Telefone (< 48 rem) | Tablet (48–64 rem) |
|---|---|---|
| Cabeçalho | três itens como link; em 320 px, no tamanho de dado; sem bússola | "Contato" como botão de contorno; bússola de setores ao centro |
| Hero | símbolo antes do título; índice dos seis setores em cartões, duas colunas; barra fixa com a ação principal no rodapé da tela, que some quando o formulário está visível | idem, símbolo maior, cartões em três colunas |
| Serviço | pares empilhados com rótulo em mono; o par no meio da tela vira cartão de papel | duas colunas; o par no meio vira cartão |
| Frentes | mosaico em cima; as quatro frentes num trilho com encaixe (swipe) e a dica "deslize" | mosaico em cima; grade 2×2 |
| Demo | barra lateral só com ícones; etiqueta da janela oculta; endereço encurta | idem, com etiqueta |
| Carcaça e grade | desligadas (viravam ruído sobre o texto) | desligadas |
| Trilhos de ação | frase e botão empilhados; o núcleo continua pousando | idem |
| Contato | campos empilhados no cartão de papel; botão vira o encaixe final do núcleo | campos em duas colunas |

Verificação que faz parte do "pronto": `scrollWidth == innerWidth` em 320, 390, 412 e 768 px,
nas rotas `/`, `/portfolio` e `/contato`.

## Skills consultados (skills.sh, 2026-09-10)

- `emilkowalski/skills` — 36,5 mil estrelas, MIT; `animate`, `review-animations` e
  `animation-vocabulary` copiados para `.claude/skills/emil-*` (sem rodar instalador de
  terceiro). Servem de revisor da qualidade do movimento.
- `MengTo/Skills` (Matter.js) — 5,9 mil estrelas. Não usado: física de corpo rígido faz os
  quadrados girarem e tombarem; a marca proíbe girar o símbolo, e Tetris é grade.
