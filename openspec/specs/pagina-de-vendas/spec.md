# Página de vendas

## Purpose

A página inicial vende o serviço da Xiax: entrar na operação da empresa, encontrar o que trava e colocar o sistema em produção, com IA no núcleo e em infraestrutura própria. Ela é uma página de venda de serviço, não um portal institucional: cada bloco termina numa ação, e todas as ações levam ao formulário de contato.

## Requirements

### Requirement: Ordem e conteúdo das seções

A página inicial SHALL apresentar, nesta ordem: hero, serviço (tabela de comparação e a operação antes/depois), método em quatro passos, quatro frentes, o que está no ar (portfólio), motor (infraestrutura própria) e contato; depois, o rodapé.

#### Scenario: Leitura de cima a baixo
- **WHEN** a pessoa rola a página inicial do topo ao fim
- **THEN** encontra as sete seções na ordem acima e o rodapé com a marca, a assinatura, a navegação e a razão social "Xiax Tecnologia e Desenvolvimento Ltda." com o ano corrente

### Requirement: Voz e idioma

Todo texto lido pela pessoa SHALL estar em português do Brasil e seguir a voz da Xiax (`.claude/skills/xiax-voice`): frase curta, verbo concreto, sem palavra de hype, sem exclamação, sem número que não se possa provar. A página MUST NOT usar o termo "business house"; descreve o serviço em vez de nomeá-lo. Identificadores, nomes de arquivo e commits ficam em inglês.

#### Scenario: Guarda anti-slop encontra hype
- **WHEN** um texto com "revolucionário", "disruptivo", "transformação digital" ou similar entra em `src/`
- **THEN** `pnpm slop:check` reprova e o CI falha

### Requirement: Chamadas para ação

A página SHALL oferecer uma ação em cada momento da leitura, todas levando ao formulário em `/#contato`:
- no cabeçalho, o item "Contato" como botão com contorno (a partir de 40rem; em telefone volta a ser link, porque a barra fixa já carrega a ação);
- no hero, o botão principal "Contar a minha operação" (violeta) e o secundário "Ver o que está no ar" (para `/portfolio`);
- ao fim de serviço, método, portfólio e motor, um trilho (`CtaRail`) com uma frase própria do momento e um botão, com o texto em `src/content/ctas.ts`;
- abaixo de 64rem, uma barra fixa no rodapé da tela com a ação principal, que some enquanto o formulário está visível.

#### Scenario: Botão de trilho recebe o núcleo
- **WHEN** a pessoa rola até o trilho de uma seção em um navegador com movimento habilitado
- **THEN** o núcleo viajante pousa no botão, que fica violeta com o texto em tinta, e os demais botões de trilho ficam só com contorno

#### Scenario: Ação no telefone
- **WHEN** a largura é menor que 64rem
- **THEN** a barra fixa com "Contar a minha operação" fica visível, exceto quando `#contato` está na tela

### Requirement: Tema escuro único

O site SHALL usar um único tema: superfície `#0B0B0C`, texto `#FFFFFF`, secundário `#8E8E93`, violeta `oklch(0.60 0.18 295)` (`#8E6FE0`). A seção "Donos do motor" SHALL inverter a polaridade só dentro do próprio bloco (papel branco, estrutura preta, violeta `#7B57D4`). Não existe alternância de tema.

#### Scenario: Preferência do sistema por tema claro
- **WHEN** o sistema operacional pede tema claro
- **THEN** a página continua escura; só a faixa do motor é clara

### Requirement: Telefone e tablet desenhados

A página SHALL ter layout pensado para telefone (< 48rem) e tablet (48–64rem), não só encaixado: tabela de comparação em pares empilhados com rótulo; frentes num trilho com encaixe (telefone) ou em grade 2×2 (tablet); núcleo das frentes acima das frentes; carcaça e grade de cursor desligadas; cabeçalho que cabe em 320px.

#### Scenario: Nenhum vazamento horizontal
- **WHEN** a página inicial, `/portfolio` ou `/contato` abre em 320px, 390px, 412px ou 768px de largura
- **THEN** `document.documentElement.scrollWidth` é igual a `window.innerWidth`
