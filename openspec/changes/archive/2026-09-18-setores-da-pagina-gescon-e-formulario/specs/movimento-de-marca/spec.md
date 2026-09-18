## MODIFIED Requirements

### Requirement: Mosaico das frentes

O núcleo da seção de frentes SHALL ser uma grade fixa de 10×10 células ordenada como a grade da marca: o anel externo violeta (células transparentes, pintadas pelo núcleo viajante quando ele está lá), o segundo anel intercalando violeta e branco em simetria espelhada a partir de cada canto, e o centro branco. As linhas 3–6, colunas 1–8, MUST ser brancas para servir de placa ao texto "IA no núcleo da operação. / Quatro frentes. Um jeito de construir.", em tinta, dimensionado em `cqw`. As células não animam.

#### Scenario: Núcleo ausente
- **WHEN** o núcleo viajante está em outra seção
- **THEN** o mosaico mostra células brancas sobre o preto da página e o texto continua legível na placa

### Requirement: Destaque violeta que varre o texto

O título e o apoio do contato e a etiqueta "mensagem para a Xiax" SHALL receber um fundo violeta que avança sobre as palavras conforme a página rola (`@property --sweep` animado no bloco por `animation-timeline: view()`, `background-size` no texto), escurecendo as letras por onde passou. Nos setores de papel, a mesma varredura SHALL aparecer como sublinhado violeta sob os títulos dos setores 02 e 04, sob os nomes dos sistemas e sob o título da folha da tabela, sem alterar as letras. Navegador sem linha do tempo de scroll usa `SweepDriver` (JS). Nenhum filho MUST redefinir `--sweep`.

#### Scenario: Rolagem até o contato
- **WHEN** o título entra na faixa de 25% a 45% da janela
- **THEN** `--sweep` vai de 0% a 100% e o violeta cobre o título inteiro

#### Scenario: Título num setor de papel
- **WHEN** o título "O que está no ar" entra na mesma faixa
- **THEN** um sublinhado violeta se desenha sob as palavras da esquerda para a direita

### Requirement: Núcleo viajante

O site SHALL ter um único quadrado violeta (`TravelingCore`) que nasce como núcleo do símbolo no hero e, ao rolar, se encaixa no elemento `[data-core-slot]` ativo: o último cujo topo passou 80% da altura da janela. Cada slot pinta o próprio violeta até o JS ligar `html.core-travels`; depois fica transparente e, quando o núcleo está em outro lugar, mostra só um contorno. O último slot da página MUST ser o botão "Enviar mensagem". Um bloco que inverte a polaridade (a faixa do motor e o cartão de contato) MUST pintar o próprio papel atrás do núcleo, nunca sobre ele.

#### Scenario: Movimento reduzido
- **WHEN** `prefers-reduced-motion: reduce` está ativo ou o JS não roda
- **THEN** cada slot pinta o próprio núcleo, parado, e nenhum voo acontece

#### Scenario: Núcleo atrás do conteúdo
- **WHEN** o núcleo pousa num slot
- **THEN** ele é visível através do slot, porque nenhum contêiner entre o slot e a página tem fundo opaco

#### Scenario: Cartão de papel
- **WHEN** o núcleo pousa no botão "Enviar mensagem" dentro do cartão de papel
- **THEN** o violeta aparece pelo botão, sobre o papel do cartão, e o texto do botão fica em papel sobre violeta

## ADDED Requirements

### Requirement: Visor de telas no relógio do loader

O visor de telas reais SHALL avançar de uma tela para a seguinte a cada 4,8 s (três ciclos do loader) enquanto estiver em tela e ninguém tiver tocado nas abas; o sublinhado da aba ativa SHALL preencher da esquerda para a direita nesse mesmo intervalo. Um clique ou uma seta do teclado MUST parar o avanço para o resto da visita. Fora da tela, o avanço para.

#### Scenario: Movimento reduzido
- **WHEN** `prefers-reduced-motion: reduce` está ativo
- **THEN** o visor abre na primeira tela e só troca por clique ou teclado

#### Scenario: Pessoa assume as abas
- **WHEN** a pessoa clica numa aba
- **THEN** aquela tela fica visível e o visor não volta a avançar sozinho

### Requirement: Comparação um par por vez

A comparação "software sob encomenda | Xiax" SHALL manter a lista dos cinco pares como conteúdo acessível, mostrada inteira depois do palco. A partir de 64rem, a primeira tela da seção SHALL fixar enquanto a rolagem caminha os pares: meio passo com a tela à vista, um passo por par com a janela inteira desfocada abaixo do cabeçalho e um baralho de cartões de papel no centro da tela, o cartão da frente mostrando o par (a linha do mercado riscada, a frase da Xiax varrida em violeta com o átomo violeta, o contador "n de 5" e cinco células de progresso) e os já lidos empilhados atrás; meio passo final antes de soltar. Com a tela fixa e um cartão aberto, cada gesto de roda, trackpad ou teclado SHALL levar a página a exatamente um cartão, o próximo ou o anterior, e o resto do mesmo gesto MUST ser ignorado; a inércia do gesto MUST parar no cartão seguinte, nunca além. A página nunca corre na frente do cartão em tela. Fora dos cartões a rolagem MUST ficar livre, exceto o passo de volta a partir da saída enquanto ela ainda está na tela. Com ponteiro fino, o baralho SHALL inclinar na direção do cursor e o cartão da frente mostrar a grade de engenharia ao redor do ponteiro. Abaixo de 64rem, o par mais perto do meio da tela SHALL virar o cartão de papel, sem bloco fixo. O cartão MUST NOT ter sombra nem raio, e a cor MUST ficar só no átomo, na varredura e nas células.

#### Scenario: Rolagem no desktop
- **WHEN** a pessoa rola até a comparação numa tela de 64rem ou mais e segue rolando
- **THEN** a primeira tela da seção fica fixa, a página desfoca, o baralho abre no primeiro par, troca de par a cada 50vh de rolagem com o anterior recuando para trás, e fecha no fim; a tabela inteira sobe como uma folha de papel opaca por cima da tela fixa e a cobre, e só aparece depois que o último cartão fechou

#### Scenario: Rolagem rápida
- **WHEN** a pessoa dá um único gesto forte de rolagem com o baralho aberto
- **THEN** a página para no cartão seguinte, e só outro gesto leva ao próximo

#### Scenario: Cursor sobre o cartão
- **WHEN** o ponteiro passa sobre o cartão da frente
- **THEN** o baralho inclina na direção do ponteiro e a grade aparece num raio ao redor dele, e some quando o ponteiro sai

#### Scenario: Movimento reduzido
- **WHEN** `prefers-reduced-motion: reduce` está ativo
- **THEN** a tabela aparece inteira, riscada e acesa, sem cartão nem véu

### Requirement: Frentes uma a uma

A partir de 64rem, a composição das quatro frentes em volta do núcleo SHALL fixar na tela, dimensionada para caber inteira sem corte, e cada frente SHALL nascer do centro para o seu canto num passo da pista, uma por gesto, na mesma trava de gesto da comparação; antes do primeiro passo só o núcleo está à vista; o gesto que traz a quarta para nela, com a composição parada, e o gesto seguinte rola livre, sem parada extra. Cada frente SHALL ser uma placa de papel com contorno de tinta e uma placa de tinta-cinza deslocada atrás, sem sombra, em qualquer largura. Abaixo de 64rem e com movimento reduzido, as quatro frentes SHALL aparecer paradas, sem palco.

#### Scenario: Salto de âncora com o palco aberto
- **WHEN** a pessoa está no segundo cartão da comparação, ou com duas frentes à vista, e escolhe "Método" no cabeçalho ou um setor na bússola
- **THEN** a página chega ao setor escolhido, o palco fecha e o snap obrigatório fica desligado

#### Scenario: Um gesto, uma frente
- **WHEN** a pessoa dá um gesto de rolagem com a composição fixa e três frentes à vista
- **THEN** a quarta nasce do centro para o seu canto e a página não passa dela

#### Scenario: Cabe na tela
- **WHEN** a janela tem 760px ou mais de altura numa tela de 64rem ou mais
- **THEN** núcleo e quatro cantos ficam inteiros entre o cabeçalho e o fim da janela enquanto a composição está fixa

### Requirement: Método em foco

Os quatro passos do método SHALL ser células de uma coluna com fio. O passo mais perto do meio da tela SHALL virar papel, com o número em violeta e o texto em tinta; os já lidos ficam acesos e os à frente esperam apagados. Com ponteiro fino, a célula em foco SHALL inclinar na direção do cursor e mostrar a grade ao redor do ponteiro. O símbolo ao lado SHALL continuar preenchendo um satélite por passo alcançado.

#### Scenario: Passo no meio da tela
- **WHEN** o segundo passo cruza o meio da janela
- **THEN** ele fica em papel com o número "2" em violeta, o primeiro fica aceso e o terceiro e o quarto apagados

#### Scenario: Movimento reduzido
- **WHEN** `prefers-reduced-motion: reduce` está ativo
- **THEN** os quatro passos ficam acesos, sem foco nem inclinação
