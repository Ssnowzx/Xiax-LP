## MODIFIED Requirements

### Requirement: Ordem e conteúdo das seções

A página inicial SHALL apresentar o hero e, depois dele, seis setores numerados nesta ordem: 01 serviço (tabela de comparação e a operação antes/depois), 02 método em quatro passos, 03 quatro frentes, 04 o que está no ar (portfólio), 05 motor (infraestrutura própria) e 06 contato; depois, o rodapé. Cada setor SHALL abrir com um cabeçalho de setor: um fio, o número com dois dígitos, o nome curto e uma frase sobre o que está ali, sempre em caixa baixa. O hero SHALL terminar num índice com os seis setores em cartões de uma grade com fio, cada um com o número, o nome e a frase do setor, levando à âncora dele. Os ids `servico`, `metodo`, `frentes`, `no-ar`, `motor` e `contato` MUST ficar nas seções, para servirem de âncora.

#### Scenario: Leitura de cima a baixo
- **WHEN** a pessoa rola a página inicial do topo ao fim
- **THEN** encontra o hero com o índice, os seis setores na ordem acima, cada um aberto pelo próprio cabeçalho de setor, e o rodapé com a marca, a assinatura, a navegação e a razão social "Xiax Tecnologia e Desenvolvimento Ltda." com o ano corrente

#### Scenario: Salto pelo índice
- **WHEN** a pessoa escolhe "04 O que está no ar" no índice do hero
- **THEN** a página rola até o setor do portfólio e o cabeçalho de setor "04 O que está no ar" fica abaixo do cabeçalho fixo, não escondido por ele

### Requirement: Tema escuro único

O site SHALL usar um único tema, de base escura: superfície `#0B0B0C`, texto `#FFFFFF`, secundário `#8E8E93`, violeta `oklch(0.60 0.18 295)` (`#8E6FE0`). Os setores 02 (método) e 04 (o que está no ar) SHALL inverter a polaridade só dentro do próprio bloco (papel suave `oklch(0.96 0.004 295)` como superfície, estrutura preta, violeta `#7B57D4`), assim como o cartão do contato, os cartões da comparação e a folha da tabela; o texto sobre tinta continua `#FFFFFF`. Os números que guiam a leitura (índice do hero, cabeçalhos de setor, passo do método em foco) SHALL ser violeta. Não existe alternância de tema.

#### Scenario: Preferência do sistema por tema claro
- **WHEN** o sistema operacional pede tema claro
- **THEN** a página continua escura na base; só os setores e cartões de papel são claros

#### Scenario: Passo em foco num setor de papel
- **WHEN** um passo do método entra em foco
- **THEN** a célula fica em tinta com o texto em papel e o número em violeta, o oposto do setor

## ADDED Requirements

### Requirement: Bússola de setores

A partir de 48rem, o cabeçalho fixo SHALL mostrar, entre a marca e a navegação, uma bússola com seis células, uma por setor: a célula do setor em tela preenchida, as dos setores já lidos apagadas, as demais vazadas, e o número com o nome do setor ao lado. Cada célula SHALL ser um link para o setor. A bússola MUST usar só preto e branco. Nas rotas que não são a página inicial e no hero, a bússola não indica setor.

#### Scenario: Setor em tela
- **WHEN** o topo do setor "02 Como entramos" passa 40% da altura da janela
- **THEN** a segunda célula fica preenchida, a primeira apagada e o rótulo diz "02 Como entramos"

#### Scenario: Telefone
- **WHEN** a largura é menor que 48rem
- **THEN** a bússola não aparece e os cabeçalhos de setor continuam orientando a leitura
