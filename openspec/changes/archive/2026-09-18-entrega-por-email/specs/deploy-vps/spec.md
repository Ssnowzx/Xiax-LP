## MODIFIED Requirements

### Requirement: Variáveis de ambiente

`NEXT_PUBLIC_CONTACT_EMAIL` passa a ter padrão `xiaxdesenvolvimento@gmail.com`. Entram `CONTACT_SMTP_HOST` (padrão `smtp.gmail.com`), `CONTACT_SMTP_PORT` (padrão `465`), `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASS` e `CONTACT_TO_EMAIL`, todas opcionais e repassadas pelo `docker-compose.yml` em tempo de execução, sem rebuild.

#### Scenario: Sem canal de entrega
- **WHEN** nem SMTP nem `CONTACT_WEBHOOK_URL` estão definidos
- **THEN** o build passa e o formulário avisa que o envio não está ligado
