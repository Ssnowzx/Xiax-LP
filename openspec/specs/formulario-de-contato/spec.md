# Formulário de contato

## Purpose

A conversão da página é uma mensagem. O formulário é uma frase com lacunas, dentro de um card, e é o ponto final do núcleo viajante.

## Requirements

### Requirement: Proteções

O envio SHALL validar com zod no servidor, ignorar silenciosamente o honeypot preenchido e aplicar limite de taxa por origem (`src/lib/rate-limit.ts`).

#### Scenario: Honeypot
- **WHEN** o campo oculto vem preenchido
- **THEN** a ação responde como sucesso sem chamar o webhook

### Requirement: Destino da mensagem

Com `CONTACT_WEBHOOK_URL` definido, a mensagem SHALL ser enviada em JSON ao endpoint da Xiax. Sem ele, o formulário valida e avisa que o envio não está ligado, mostrando `NEXT_PUBLIC_CONTACT_EMAIL` quando existir. O site MUST NOT usar serviço de formulário de terceiro.

#### Scenario: Webhook fora do ar
- **WHEN** o endpoint responde erro ou não responde
- **THEN** a pessoa vê uma mensagem de falha e o e-mail alternativo, se configurado

### Requirement: O núcleo termina no botão

O botão "Enviar mensagem" SHALL ser o último `data-core-slot` da página: o violeta que acompanhou a leitura vira a ação.

#### Scenario: Chegada ao formulário
- **WHEN** o botão passa a linha de foco do núcleo viajante
- **THEN** o núcleo pousa sobre ele e o texto do botão fica em tinta sobre violeta

### Requirement: Campos com rótulo em cartão de papel

O formulário SHALL ter cinco campos com rótulo visível acima de cada um: nome, empresa, e-mail para a resposta, frente que mais parece com a da pessoa (opcional, "Ainda não sei" por padrão) e o que trava hoje (texto livre). Os campos SHALL ser caixas com borda; nome, empresa, e-mail e frente ficam em duas colunas a partir de 48rem e empilhados abaixo disso. Um campo com dica SHALL mostrá-la entre o rótulo e a caixa. O formulário fica num cartão de papel (polaridade invertida: papel, tinta, violeta de fundo claro), encabeçado pelo símbolo e pela etiqueta "mensagem para a Xiax" em tamanho de apoio, com o destaque violeta. O papel do cartão MUST ser pintado atrás do núcleo viajante, para o núcleo aparecer pelo botão de enviar.

#### Scenario: Envio com campo vazio
- **WHEN** a pessoa envia sem nome ou com e-mail inválido
- **THEN** cada erro aparece em português do Brasil logo abaixo do campo a que pertence, a borda do campo engrossa e fica tracejada, e nada é enviado

#### Scenario: Telefone
- **WHEN** a largura é menor que 48rem
- **THEN** os cinco campos ficam empilhados numa coluna e o botão "Enviar mensagem" continua sendo o último encaixe do núcleo
