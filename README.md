# Xiax-site

Site de vendas e portfólio da Xiax: entra na operação, encontra o que trava, coloca o
sistema em produção — com IA no núcleo e em infraestrutura própria.

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind v4 · Vitest · Playwright
(captura de tela). Sem biblioteca de animação, sem analytics, sem script de terceiro.

## Instalar

Requer Node.js ≥ 20.19 e pnpm 10.

```bash
pnpm install
cp .env.example .env   # preencha o que tiver
pnpm dev               # http://localhost:3000
```

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm dev` | servidor de desenvolvimento |
| `pnpm build` / `pnpm start` | build de produção e servidor |
| `pnpm check` | typecheck, lint, guarda de marca, guarda anti-slop e testes — o portão do CI |
| `pnpm test` / `pnpm test:coverage` | testes unitários (Vitest, mínimo 80% de cobertura) |
| `pnpm brand:check` | confere cores, fontes e geometria contra o manual da marca |
| `pnpm slop:check` | reprova gradiente, sombra, radius, eyebrow, hype e tropos proibidos |
| `pnpm shots` | captura desktop, tablet e telefone com Playwright (precisa de `pnpm start` rodando) |

Antes de dizer "pronto" numa mudança visual: `pnpm check`, `pnpm build` e a sonda de largura
em telefone — `document.documentElement.scrollWidth` igual a `window.innerWidth` em 320, 390,
412 e 768 px, nas rotas `/`, `/portfolio` e `/contato`.

## Variáveis de ambiente

| Variável | Obrigatória | Para quê |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | não (padrão `https://xiax.com.br`) | URLs canônicas, sitemap, robots, JSON-LD |
| `NEXT_PUBLIC_CONTACT_EMAIL` | não | e-mail mostrado se o formulário não puder enviar |
| `CONTACT_WEBHOOK_URL` | não | endpoint da Xiax que recebe o formulário em JSON |

Sem `CONTACT_WEBHOOK_URL`, o formulário valida e avisa que o envio não está ligado.

## Deploy (VPS própria)

```bash
docker compose up -d --build     # site + Caddy com TLS automático
./scripts/deploy.sh              # atualiza depois de um git pull
```

Aponte o DNS de `xiax.com.br` e `www` para a VPS antes de subir; o Caddy emite o certificado.

## Estrutura

```
src/app/              rotas: /, /portfolio, /contato, /privacidade · robots · sitemap · globals.css (tokens e movimento)
src/components/brand/ símbolo, lockup e os oito loaders do manual
src/components/motion/ núcleo viajante, carcaça, grade sob o cursor, operação antes/depois, Tetris, varredura violeta
src/components/demo/  Xclinicas simulado (sem back-end) operado pelo cursor-núcleo
src/components/sections/ hero, serviço, método, frentes, portfólio, motor, contato
src/components/ui/    botões e trilho de chamada para ação
src/content/          copy e dados: empresa, frentes, método, comparação, portfólio, chamadas, claims proibidos
src/lib/              env, seo, contato (zod), rate limit
scripts/              guardas de marca e anti-slop, capturas, deploy
docs/                 brief de design, referências, spec de movimento, fontes da marca
openspec/             specs por capacidade e mudanças arquivadas (spec-driven)
```

## Como o site se move

Um único quadrado violeta nasce como núcleo do símbolo no hero e viaja a página, pousando no
núcleo de cada seção e em cada botão de chamada para ação, até terminar no botão "Enviar
mensagem". O resto do movimento — símbolo nascendo, satélites nos cantos, mosaico das frentes,
Tetris no rodapé, violeta que varre o texto do contato — está descrito em `docs/motion-spec.md`.
`prefers-reduced-motion` e toque desligam tudo.

## Contribuir

Leia `CLAUDE.md`. Mudança de comportamento passa por `/opsx:propose` antes do código; as
specs vigentes estão em `openspec/specs/`. `pnpm check` precisa passar antes de qualquer
commit. Commits em Conventional Commits, em inglês.

## Pendências antes de ir ao ar

- Autorização para o nome de clínica visível na captura real da agenda, ou trocar a captura.
- Domínio, e-mail de contato e `CONTACT_WEBHOOK_URL` confirmados.
- Revisão jurídica do texto de `/privacidade`.
