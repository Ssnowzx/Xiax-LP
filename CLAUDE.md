# Xiax-site — instruções do projeto

Site de vendas e portfólio da Xiax. Next.js 15 (App Router), React 19, TypeScript strict,
Tailwind v4. Roda em Docker na VPS própria (Caddy na frente). Sem analytics, sem script de
terceiro, sem SaaS de formulário: a mensagem de contato vai para um endpoint da própria Xiax.

Valem também as regras globais em `~/.claude/CLAUDE.md`.

## Antes de mexer em qualquer coisa visual ou de texto

1. `docs/design-brief.md` — marca + regras anti-slop, com os conflitos já decididos.
2. `docs/references.md` — o que se toma emprestado de quem, e o que se recusa.
3. Skills `xiax-brand` e `xiax-voice` (em `.claude/skills/`) disparam sozinhas; siga-as.

Regra que resume as três: **a marca vence a skill; a sobriedade vence a ideia.** Se a peça
caberia em qualquer empresa de IA do Brasil, não é da Xiax.

## Portões (rodam no CI, rode antes de dizer "pronto")

```bash
pnpm check        # typecheck + lint + brand:check + slop:check + test
pnpm build
```

- `scripts/brand-check.mjs` — só cores, fontes e geometria da marca.
- `scripts/anti-slop.mjs` — gradiente, sombra, radius, eyebrow, seta em botão, hype, tropos proibidos.

Se um portão reprova, o portão está certo até prova em contrário. Não afrouxe a regra para
passar; corrija a peça.

## Conteúdo

- Copy em `src/content/`. Texto que a pessoa lê é **pt-BR**; código, nomes e commit são inglês.
- **Número só com prova.** Sem métrica inventada, sem prazo inventado, sem preço que não está
  na página do produto.
- `src/content/portfolio.ts` lista só sistema que existe, no estado real. Cliente só com
  autorização de nome. Piloto e protótipo não entram.
- Movimento só com significado de marca (`docs/motion-spec.md`): núcleo viajante, símbolo
  nascendo, grade sob o cursor, satélites que respondem. Nunca fade-up de seção ou hover de
  card. `prefers-reduced-motion` e toque desligam tudo.
- Chamadas para ação em `src/content/ctas.ts`; todas levam a `/#contato`. Botão violeta só
  onde o núcleo pousa. "IA" é da logo: no site, o centro é a Xiax.

## Fluxo

Mudança de comportamento passa pelo OpenSpec: `/opsx:propose` → revisão → `/opsx:apply` →
`/opsx:archive`. As specs vigentes estão em `openspec/specs/`. Commit em Conventional Commits,
inglês, só quando o usuário pedir; commit e push vão para `github.com/Ssnowzx/xiaxLP`.

## Antes de dizer "pronto" numa mudança visual

`pnpm check`, `pnpm build`, captura com Playwright nos tamanhos que mudaram, e a sonda de
largura em telefone: `scrollWidth == innerWidth` em 320, 390, 412 e 768 px, nas três rotas.
Um elemento que não quebra linha (endereço, etiqueta, item de menu) é o suspeito habitual.
