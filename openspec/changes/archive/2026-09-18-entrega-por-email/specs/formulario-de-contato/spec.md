## MODIFIED Requirements

### Requirement: Destino da mensagem

A mensagem SHALL ser entregue por todo canal configurado. Com `CONTACT_SMTP_USER` e `CONTACT_SMTP_PASS`, ela SHALL ir por e-mail em texto puro para `CONTACT_TO_EMAIL` (padrão `NEXT_PUBLIC_CONTACT_EMAIL`), com `Reply-To` no e-mail da pessoa, o rótulo da frente, o IP de origem e o veredito do filtro; mensagem em zona de suspeita leva `[suspeito]` no assunto. Com `CONTACT_WEBHOOK_URL` definido, a mensagem SHALL ser enviada em JSON ao endpoint da Xiax, com `address` (IP de origem) e `spam` (veredito, pontuação e razões); com `CONTACT_WEBHOOK_SECRET`, o corpo SHALL ir assinado em HMAC-SHA256 no header `x-xiax-signature`. A pessoa vê "enviado" quando ao menos um canal aceitou. Sem nenhum canal, o formulário valida e avisa que o envio não está ligado, mostrando `NEXT_PUBLIC_CONTACT_EMAIL` quando existir. O site MUST NOT usar serviço de formulário de terceiro.

#### Scenario: E-mail sai
- **WHEN** a conta SMTP está configurada e o servidor aceita
- **THEN** a pessoa vê "Mensagem recebida" e a Xiax responde o lead respondendo o e-mail

#### Scenario: Canal fora do ar
- **WHEN** todo canal configurado responde erro ou não responde
- **THEN** a pessoa vê uma mensagem de falha e o e-mail alternativo, se configurado
