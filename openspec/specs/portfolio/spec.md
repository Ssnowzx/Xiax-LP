# Portfólio

## Purpose

Só sistema que existe, no estado real. O portfólio é prova, não promessa.

## Requirements

### Requirement: Só produção

`src/content/portfolio.ts` SHALL listar apenas sistemas em produção, com estado real, URL pública e stack. Piloto e protótipo MUST NOT entrar. Por decisão do fundador (09/09/2026), a lista tem só o Xclinicas (`https://xclinicas.xiax.com.br`).

#### Scenario: Entrada sem URL pública
- **WHEN** alguém adiciona uma entrada sem `url` ou com `state` diferente de `production`
- **THEN** o teste de conteúdo (`src/content/content.test.ts`) reprova

### Requirement: Capturas com origem

Cada captura de tela SHALL registrar `source` (o domínio de onde saiu) e `capturedAt` (data), mostrados na legenda. A captura real aparece pequena, como prova; a demonstração vetorial é o destaque.

#### Scenario: Legenda
- **WHEN** a captura da agenda aparece na página
- **THEN** a legenda diz "Tela real da agenda, clinica.gestaonossa.com.br, 2026-09-09"

### Requirement: Nome de cliente só com autorização

Nenhum cliente SHALL ser nomeado sem autorização por escrito. Pendência aberta: a captura real da agenda mostra o nome de uma clínica; antes de o site ir ao ar, obter a autorização ou trocar a captura.

#### Scenario: Página /portfolio
- **WHEN** a pessoa abre `/portfolio`
- **THEN** vê a mesma lista da página inicial, com o botão externo "Abrir Xclinicas"
