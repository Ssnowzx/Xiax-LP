## Why

O fundador preencheu o formulário no site em 18/09/2026 e nada chegou. O site só sabia entregar num webhook (`CONTACT_WEBHOOK_URL`), que nunca foi ligado nem aqui nem na VPS: não existia endpoint. E o endereço de apoio mostrado, `contato@xiax.com.br`, não é uma caixa que alguém lê.

## What Changes

- A entrega ganha um segundo canal: e-mail por SMTP (`src/lib/mail.ts`, nodemailer) direto para a caixa da Xiax, com `Reply-To` na pessoa. Liga com `CONTACT_SMTP_USER` + `CONTACT_SMTP_PASS`; host e porta têm padrão do Gmail.
- `deliverContact` tenta todo canal configurado (webhook, e-mail ou os dois) e responde "enviado" quando ao menos um aceitou; sem nenhum, continua "não ligado".
- O endereço padrão passa de `contato@xiax.com.br` para `xiaxdesenvolvimento@gmail.com` em `.env.example`, `Dockerfile`, `docker-compose.yml` e README.
- `docker-compose.yml` repassa as variáveis SMTP ao contêiner; README explica a senha de app do Gmail.

## Capabilities

### Modified Capabilities

- `formulario-de-contato`: requisito "Destino da mensagem" ganha o canal de e-mail.
- `deploy-vps`: variáveis SMTP e o novo endereço padrão.

## Impact

- `src/lib/env.ts`, `src/lib/mail.ts` (novo), `src/lib/contact.ts`, `src/app/(site)/contato/actions.ts`
- `src/lib/mail.test.ts` (novo), `src/lib/contact.test.ts`
- `package.json` (nodemailer), `.env.example`, `Dockerfile`, `docker-compose.yml`, `README.md`
