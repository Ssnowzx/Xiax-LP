# Formulário de contato

## Purpose

A conversão da página é uma mensagem. O formulário é uma frase com lacunas, dentro de um card, e é o ponto final do núcleo viajante.

## Requirements

### Requirement: Proteções

O envio SHALL validar com zod no servidor, ignorar silenciosamente o honeypot preenchido e aplicar limite de taxa por origem e por e-mail remetente (`src/lib/rate-limit.ts`). Toda mensagem válida SHALL passar por pontuação anti-spam no servidor (`src/lib/spam.ts`), sem serviço de terceiro: tempo entre o formulário aparecer e o envio, links, HTML, alfabeto não latino, texto de venda, nome estranho, e-mail descartável e texto repetido em 24 h. Um sinal fraco sozinho MUST NOT descartar; um sinal forte (muitos links, HTML, outro alfabeto) pode.

#### Scenario: Honeypot
- **WHEN** o campo oculto vem preenchido
- **THEN** a ação responde como sucesso sem chamar o webhook

#### Scenario: Pontuação alta
- **WHEN** a soma dos sinais chega ao limiar de spam
- **THEN** a ação responde como sucesso, não chama o webhook e a pessoa (ou o robô) não sabe que foi descartada

#### Scenario: Pontuação intermediária
- **WHEN** a soma dos sinais fica na zona de suspeita
- **THEN** a mensagem é entregue com `spam.verdict = "suspect"` e as razões, e o endpoint decide o destino

### Requirement: Destino da mensagem

A mensagem SHALL ser entregue por todo canal configurado. Com `CONTACT_SMTP_USER` e `CONTACT_SMTP_PASS`, ela SHALL ir por e-mail em texto puro para `CONTACT_TO_EMAIL` (padrão `NEXT_PUBLIC_CONTACT_EMAIL`), com `Reply-To` no e-mail da pessoa, o rótulo da frente, o IP de origem e o veredito do filtro; mensagem em zona de suspeita leva `[suspeito]` no assunto. Com `CONTACT_WEBHOOK_URL` definido, a mensagem SHALL ser enviada em JSON ao endpoint da Xiax, com `address` (IP de origem) e `spam` (veredito, pontuação e razões); com `CONTACT_WEBHOOK_SECRET`, o corpo SHALL ir assinado em HMAC-SHA256 no header `x-xiax-signature`. A pessoa vê "enviado" quando ao menos um canal aceitou. Sem nenhum canal, o formulário valida e avisa que o envio não está ligado, mostrando `NEXT_PUBLIC_CONTACT_EMAIL` quando existir. O site MUST NOT usar serviço de formulário de terceiro.

#### Scenario: E-mail sai
- **WHEN** a conta SMTP está configurada e o servidor aceita
- **THEN** a pessoa vê "Mensagem recebida" e a Xiax responde o lead respondendo o e-mail

#### Scenario: Canal fora do ar
- **WHEN** todo canal configurado responde erro ou não responde
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
