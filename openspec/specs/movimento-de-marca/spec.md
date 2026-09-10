# Movimento de marca

## Purpose

Fixa o que o movimento do site precisa fazer: um único núcleo violeta que viaja a página, o símbolo que nasce, a carcaça e a grade, o diagrama antes/depois, o mosaico das frentes, o Tetris do rodapé e o destaque que varre o texto — cada peça como leitura da frase do manual "o centro manda, os satélites executam". O desenho de cada peça está em `docs/motion-spec.md`.

## Requirements

### Requirement: Núcleo viajante

O site SHALL ter um único quadrado violeta (`TravelingCore`) que nasce como núcleo do símbolo no hero e, ao rolar, se encaixa no elemento `[data-core-slot]` ativo: o último cujo topo passou 80% da altura da janela. Cada slot pinta o próprio violeta até o JS ligar `html.core-travels`; depois fica transparente e, quando o núcleo está em outro lugar, mostra só um contorno. O último slot da página MUST ser o botão "Enviar mensagem".

#### Scenario: Movimento reduzido
- **WHEN** `prefers-reduced-motion: reduce` está ativo ou o JS não roda
- **THEN** cada slot pinta o próprio núcleo, parado, e nenhum voo acontece

#### Scenario: Núcleo atrás do conteúdo
- **WHEN** o núcleo pousa num slot
- **THEN** ele é visível através do slot, porque nenhum contêiner entre o slot e a página tem fundo opaco

### Requirement: Nascimento do símbolo e splash

Na primeira visita da sessão, o site SHALL mostrar o GIF de órbita do manual no preto por um ciclo (1,6s) e só então fazer o símbolo do hero nascer do centro para fora, satélite a satélite, com 0,2s de defasagem. Visita repetida ou movimento reduzido pulam o splash.

#### Scenario: Segunda página da sessão
- **WHEN** `sessionStorage` já tem `xiax-seen`
- **THEN** o splash não aparece e o símbolo nasce imediatamente

### Requirement: Carcaça e grade

A partir de 64rem, os quatro satélites do símbolo, vazados, SHALL ficar fixos nos cantos da tela atrás do conteúdo, abrindo com o scroll e fechando no fim (`animation-timeline: scroll(root)`). A grade de engenharia de 100u SHALL aparecer só num raio ao redor do cursor, na página inteira. Ambos desligam com toque e com movimento reduzido.

#### Scenario: Tablet
- **WHEN** a largura é menor que 64rem
- **THEN** carcaça e grade não são renderizadas

### Requirement: A operação antes e depois

Na seção de serviço, nove quadrados espalhados (planilha, WhatsApp, ERP alugado…) SHALL virar o símbolo: quatro viram satélites com rótulos (cadastro, agenda, atendimento, financeiro), um vira o núcleo, quatro somem. O núcleo SHALL carregar a marca "XIAX" no desenho do lockup (Archivo 700, caixa alta, tracking 0,30em), não a palavra "IA".

#### Scenario: Estado "Com a Xiax"
- **WHEN** a seção entra na tela ou a pessoa escolhe "Com a Xiax"
- **THEN** o núcleo violeta mostra "XIAX" em tinta e os satélites brancos mostram os quatro módulos

### Requirement: Mosaico das frentes

O núcleo da seção de frentes SHALL ser uma grade fixa de 10×10 células: exatamente 40 células violetas (transparentes, pintadas pelo núcleo viajante quando ele está lá) e 60 brancas, espalhadas por embaralhamento com semente fixa (`MOSAIC_SEED`) para servidor e cliente desenharem o mesmo padrão. As linhas 3–6, colunas 1–8, MUST ser brancas para servir de placa ao texto "IA no núcleo da operação. / Quatro frentes. Um jeito de construir.", em tinta, dimensionado em `cqw`. As células não animam.

#### Scenario: Núcleo ausente
- **WHEN** o núcleo viajante está em outra seção
- **THEN** o mosaico mostra células brancas sobre o preto da página e o texto continua legível na placa

### Requirement: Método em sequência

Ao lado dos quatro passos do método, o símbolo SHALL preencher um satélite por passo lido (variação "carregando em sequência").

#### Scenario: Passo entra na tela
- **WHEN** o terceiro passo cruza o limiar do observador
- **THEN** três satélites estão preenchidos e o quarto não

### Requirement: Tetris de quadrados

Acima da linha do rodapé, quadrados SHALL cair em colunas com gravidade e empilhar na linha ou sobre os já caídos; uma fileira completa pisca em violeta e some; um em nove é violeta; toque numa coluna faz cair um ali. Só quadrados, sem rotação. Roda só com a área visível; com movimento reduzido a pilha é estática.

#### Scenario: Fileira completa
- **WHEN** a última coluna de uma fileira é preenchida
- **THEN** a fileira pisca em violeta, some, e as de cima descem

### Requirement: Destaque violeta que varre o texto

O título e o apoio do contato e a etiqueta "mensagem para a Xiax" SHALL receber um fundo violeta que avança sobre as palavras conforme a página rola (`@property --sweep` animado no bloco por `animation-timeline: view()`, `background-size` no texto), escurecendo as letras por onde passou. Navegador sem linha do tempo de scroll usa `SweepDriver` (JS). Nenhum filho MUST redefinir `--sweep`.

#### Scenario: Rolagem até o contato
- **WHEN** o título entra na faixa de 25% a 45% da janela
- **THEN** `--sweep` vai de 0% a 100% e o violeta cobre o título inteiro

### Requirement: O que nunca acontece

O site MUST NOT ter fade-and-slide-up de seção, hover de card, parallax, partícula, scroll sequestrado, sombra, gradiente decorativo ou cor fora do núcleo (exceção do manual: os loaders "órbita" e "rastro"). Toque e `prefers-reduced-motion` desligam tudo o que é movimento.

#### Scenario: Guarda anti-slop
- **WHEN** um `box-shadow`, `linear-gradient` com duas cores ou `border-radius` diferente de zero entra no CSS
- **THEN** `pnpm slop:check` reprova
