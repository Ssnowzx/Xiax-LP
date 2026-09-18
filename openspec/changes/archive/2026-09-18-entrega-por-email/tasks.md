## 1. Entrega por e-mail

- [x] 1.1 `src/lib/mail.ts`: compor a mensagem (texto puro, `Reply-To` na pessoa, `[suspeito]` no assunto) e enviar por SMTP; verificar com `mail.test.ts`
- [x] 1.2 `deliverContact` com dois canais e "enviado" se ao menos um aceitou; verificar com `contact.test.ts`
- [x] 1.3 Variáveis `CONTACT_SMTP_*` e `CONTACT_TO_EMAIL` em `env.ts`, `.env.example`, `docker-compose.yml`; ação passa o canal de e-mail
- [x] 1.4 Endereço padrão `xiaxdesenvolvimento@gmail.com` em todo lugar; README com o passo a passo da senha de app
- [ ] 1.5 Na VPS: senha de app no `.env`, `docker compose up -d --build`, enviar um teste pelo site e ver chegar (pendente do fundador)
