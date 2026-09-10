# Formulário de contato

## Purpose

A conversão da página é uma mensagem. O formulário é uma frase com lacunas, dentro de um card, e é o ponto final do núcleo viajante.

## Requirements

### Requirement: Frase com lacunas

O formulário SHALL ser uma frase em primeira pessoa com lacunas para nome, empresa, e-mail, frente (opcional, "ainda não sei" por padrão) e o que trava hoje (texto livre). Fica num card com contorno, sem preenchimento, encabeçado pelo símbolo e pela etiqueta "mensagem para a Xiax" em tamanho de apoio, com o destaque violeta.

#### Scenario: Envio com campo vazio
- **WHEN** a pessoa envia sem nome ou com e-mail inválido
- **THEN** os erros aparecem em português do Brasil junto do formulário e nada é enviado

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
