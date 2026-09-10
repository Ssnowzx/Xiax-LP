# Demonstração do Xclinicas

## Purpose

Mostrar o sistema em produção sem depender de captura de tela em baixa resolução: um Xclinicas simulado, em vetor, rodando no navegador sem back-end, operado por um cursor-núcleo. Uma tela real pequena ao lado é a prova de que o sistema existe.

## Requirements

### Requirement: Sistema simulado sem back-end

`ClinicDemo` SHALL simular os módulos Agenda, Lista de espera, Financeiro e Indicadores com um único estado (reducer): confirmar sessão, encaixar da fila, fechar o mês e trocar de módulo alteram os mesmos números.

#### Scenario: Encaixe da lista de espera
- **WHEN** o roteiro encaixa uma pessoa da lista de espera num horário livre
- **THEN** a pessoa some da fila, aparece na agenda do profissional e o contador da fila diminui em um

### Requirement: Fidelidade à interface real

A simulação SHALL seguir a interface real de `clinica.gestaonossa.com.br`: barra lateral com grupos de módulos, pílula de contadores no topo, agenda por profissional em colunas, lista de espera como coluna vertical da própria agenda (painel branco com ícone de recolher e contagem), sem linha do "agora". Em telefone, a barra lateral mostra só ícones.

#### Scenario: Lista de espera
- **WHEN** a agenda está em tela
- **THEN** a lista de espera aparece como coluna à direita da grade de horários, não como aba solta

### Requirement: Só o cursor opera

A moldura da simulação SHALL ser inerte (`inert`, `pointer-events: none`): nenhum clique ou tecla da pessoa altera o estado. Só o cursor "IA" (quadrado violeta) executa o roteiro, em loop, com easing de mola (`linear()`), transições de elemento pela View Transitions API e entradas com `@starting-style`.

#### Scenario: Movimento reduzido
- **WHEN** `prefers-reduced-motion: reduce` está ativo
- **THEN** não há roteiro nem transições; a simulação mostra um estado parado

#### Scenario: Janela parcialmente sob o cabeçalho
- **WHEN** a moldura não está inteira entre o cabeçalho fixo e a barra do telefone
- **THEN** o roteiro aplica o estado sem View Transition, porque a transição desenharia os cartões por cima do cabeçalho

### Requirement: Janela e prova

A simulação SHALL ficar dentro de uma janela desenhada pela Xiax (três quadrados, endereço `clinica.gestaonossa.com.br`, etiqueta "demonstração" a partir de 48rem), que entra com mola ao aparecer e flutua devagar. A janela MUST caber em qualquer telefone: o endereço encurta antes de forçar a largura da página. Ao lado, uma captura real pequena SHALL indicar a fonte e a data da captura.

#### Scenario: Telefone de 320px
- **WHEN** a página abre com 320px de largura
- **THEN** a barra da janela não é mais larga que a tela e a etiqueta fica oculta
