# Guardas de marca e qualidade

## Purpose

A marca vence a skill; a sobriedade vence a ideia. Duas guardas em código impedem que uma boa ideia saia da marca, e o CI roda as duas.

## Requirements

### Requirement: Portão único

`pnpm check` SHALL rodar, nesta ordem, typecheck, lint, `brand:check`, `slop:check` e os testes. O CI (`.github/workflows/ci.yml`) SHALL rodar `pnpm check` e `pnpm build` em push e pull request para `main`. Cobertura mínima de testes: 80%.

#### Scenario: Portão reprova
- **WHEN** qualquer etapa falha
- **THEN** o commit não deve ser feito e o CI fica vermelho; a regra não é afrouxada para passar

### Requirement: Guarda de marca

`scripts/brand-check.mjs` SHALL reprovar cor fora da paleta aprovada (hex e oklch), fonte fora de Archivo e IBM Plex Mono e geometria do símbolo diferente da do manual. `src/components/demo/demo.css` é a única exceção, porque reproduz a interface de outro produto.

#### Scenario: Cor nova
- **WHEN** um `#` ou `oklch(` fora da lista entra em `src/`
- **THEN** `pnpm brand:check` reprova apontando o arquivo e a linha

### Requirement: Guarda anti-slop

`scripts/anti-slop.mjs` SHALL reprovar gradiente com duas cores, sombra, radius diferente de zero, eyebrow em caixa alta, seta em botão, palavra de hype, tropo visual proibido, `console.*` em produção, `<BuildSlot>` e ponto médio como separador. Exceções declaradas: `components/demo/`, a lista de `forbidden-claims.ts` e `linear-gradient(var(--accent), var(--accent))` (uma cor só, usado pelo destaque violeta).

#### Scenario: Falso positivo conhecido
- **WHEN** o texto contém "robots" (o arquivo robots.ts)
- **THEN** a regra de tropo "robô" não dispara
