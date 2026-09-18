# Deploy em VPS própria

## Purpose

O site roda na infraestrutura da Xiax, como os sistemas que ela vende. Sem analytics, sem script de terceiro, sem SaaS no caminho.

## Requirements

### Requirement: Contêiner e TLS

O site SHALL rodar em Docker (build multi-stage, saída `standalone` do Next.js) atrás do Caddy, que emite o certificado TLS para `xiax.com.br` e `www`. `docker compose up -d --build` sobe tudo; `scripts/deploy.sh` atualiza depois de um `git pull`. Numa VPS que já tem outro servidor nas portas 80/443, o Caddy é desligado por um `docker-compose.override.yml` local e o proxy existente aponta para o contêiner `site`.

#### Scenario: Primeira subida
- **WHEN** o DNS aponta para a VPS e `docker compose up -d --build` roda
- **THEN** o site responde em HTTPS sem configuração manual de certificado

### Requirement: Variáveis de ambiente

`NEXT_PUBLIC_SITE_URL` (padrão `https://xiax.com.br`) SHALL alimentar URLs canônicas, sitemap, robots e JSON-LD; `NEXT_PUBLIC_CONTACT_EMAIL` (padrão `xiaxdesenvolvimento@gmail.com`, fixado no build), `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_SECRET`, `CONTACT_SMTP_HOST`, `CONTACT_SMTP_PORT`, `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASS`, `CONTACT_FROM_EMAIL` e `CONTACT_TO_EMAIL` são opcionais, validadas em `src/lib/env.ts` e repassadas pelo `docker-compose.yml` em tempo de execução, sem rebuild. `.env` e `docker-compose.override.yml` ficam fora do git.

#### Scenario: Sem canal de entrega
- **WHEN** nem SMTP nem `CONTACT_WEBHOOK_URL` estão definidos
- **THEN** o build passa e o formulário avisa que o envio não está ligado

### Requirement: Nenhum terceiro no navegador

A página MUST NOT carregar analytics, fonte remota de terceiro ou script externo. As fontes são servidas pelo próprio site.

#### Scenario: Inspeção de rede
- **WHEN** a página inicial carrega
- **THEN** todas as requisições vão para a própria origem
