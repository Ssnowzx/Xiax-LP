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
| `osascript scripts/snapshot-chrome-tab.applescript` | tela real de um sistema logado no Chrome da máquina, com dado pessoal substituído dentro da página (`scripts/anonymize-snapshot.js`); `scripts/render-snapshot.mjs` renderiza em 2x e prova que nenhum nome ou número do original sobreviveu |

Antes de dizer "pronto" numa mudança visual: `pnpm check`, `pnpm build` e a sonda de largura
em telefone — `document.documentElement.scrollWidth` igual a `window.innerWidth` em 320, 390,
412 e 768 px, nas rotas `/`, `/portfolio` e `/contato`.

## Variáveis de ambiente

| Variável | Obrigatória | Para quê |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | não (padrão `https://xiax.com.br`) | URLs canônicas, sitemap, robots, JSON-LD |
| `NEXT_PUBLIC_CONTACT_EMAIL` | não (padrão `xiaxdesenvolvimento@gmail.com`) | e-mail mostrado se o formulário não puder enviar |
| `CONTACT_SMTP_HOST` / `CONTACT_SMTP_PORT` | não | servidor SMTP; só o host já liga o envio (relay sem login, porta 25 por padrão) |
| `CONTACT_SMTP_USER` / `CONTACT_SMTP_PASS` | não | login SMTP; os dois juntos ligam o envio, com `smtp.gmail.com:465` por padrão |
| `CONTACT_FROM_EMAIL` | não (padrão usuário SMTP, senão `site@<host do site>`) | remetente mostrado no e-mail |
| `CONTACT_TO_EMAIL` | não (padrão `NEXT_PUBLIC_CONTACT_EMAIL`) | caixa que recebe o formulário |
| `CONTACT_WEBHOOK_URL` | não | endpoint da Xiax que recebe o formulário em JSON |
| `CONTACT_WEBHOOK_SECRET` | não | segredo compartilhado; assina cada envio (HMAC-SHA256) no header `x-xiax-signature` |

O formulário entrega por e-mail (SMTP), por webhook, ou pelos dois; "enviado" quando ao menos um
aceitou. Sem nenhum dos dois, valida e avisa que o envio não está ligado.

### E-mail: dois jeitos

**(a) Pelo próprio servidor (postfix/sendmail na VPS), sem conta Google.** Instale o postfix na VPS
(`apt install postfix`, tipo "Internet Site"), deixe-o aceitar a rede do Docker (`mynetworks` com
`172.16.0.0/12`, `inet_interfaces = all`) e no `.env`: `CONTACT_SMTP_HOST=host.docker.internal`.
Para o Gmail não jogar em spam, o domínio do remetente precisa de SPF e rDNS apontando para a VPS,
e o provedor precisa liberar a porta 25 de saída.

**(b) Pelo Gmail com senha de app.** Ligue a verificação em duas etapas, crie a senha em
<https://myaccount.google.com/apppasswords> e no `.env`: `CONTACT_SMTP_USER=xiaxdesenvolvimento@gmail.com`
e `CONTACT_SMTP_PASS=` a senha (com ou sem espaços). O Gmail não aceita mais a senha comum da conta.

Nos dois casos, `docker compose up -d` basta (o `.env` é lido no `up`, sem rebuild).

A mensagem chega em texto puro, com `Reply-To` na pessoa: responder o e-mail já responde o lead.
Mensagem na zona de suspeita vai com `[suspeito]` no assunto e as razões no corpo.

### Anti-spam

Tudo no servidor, sem serviço de terceiro (`src/lib/spam.ts`):

- honeypot preenchido, ou pontuação alta, responde "enviado" e descarta;
- limite de 5 mensagens por 10 min, por IP e por e-mail remetente;
- sinais pontuados: envio em menos de 3 s, links, HTML, alfabeto não latino, texto de venda
  (SEO, backlinks, cassino...), nome estranho, e-mail descartável, mesmo texto repetido em 24 h.

O JSON entregue ao webhook traz `address` (IP) e `spam: { verdict, score, reasons }`. `verdict`
é `ham` ou `suspect`; o endpoint decide o que fazer com `suspect` (etiqueta, pasta, silêncio).

Com `CONTACT_WEBHOOK_SECRET`, o endpoint deve recusar o que não vier assinado. Em Node:

```js
const expected = 'sha256=' + crypto.createHmac('sha256', SECRET).update(rawBody).digest('hex')
const ok = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(req.headers['x-xiax-signature'] ?? ''))
```

## Deploy (VPS própria)

```bash
docker compose up -d --build     # site + Caddy com TLS automático
./scripts/deploy.sh              # atualiza depois de um git pull
```

Aponte o DNS de `xiax.com.br` e `www` para a VPS antes de subir; o Caddy emite o certificado.
Se a VPS já tem outro servidor nas portas 80/443, desligue o Caddy num `docker-compose.override.yml`
(fica fora do git) e aponte o proxy existente para o contêiner `site`.

## Estrutura

```
src/app/              rotas: /, /portfolio, /contato, /privacidade · robots · sitemap · globals.css (tokens e movimento)
src/components/brand/ símbolo, lockup e os oito loaders do manual
src/components/motion/ núcleo viajante, carcaça, grade sob o cursor, pista e trava de gesto dos palcos (useRunway/Runway), operação antes/depois, Tetris, varredura violeta
src/components/layout/ cabeçalho com a bússola de setores, cabeçalho de setor, rodapé
src/components/demo/  Xclinicas simulado (sem back-end) operado pelo cursor-núcleo
src/components/sections/ hero e índice de setores, serviço (baralho da comparação), método, frentes (placas), portfólio (visor de telas reais), motor, contato
src/components/ui/    botões e trilho de chamada para ação
src/content/          copy e dados: empresa, frentes, método, comparação, portfólio, chamadas, claims proibidos
src/lib/              env, seo, contato (zod), mail (SMTP), rate limit, spam
scripts/              guardas de marca e anti-slop, capturas de tela, captura anonimizada de sistema logado (AppleScript + Playwright), deploy
docs/                 brief de design, referências, spec de movimento, fontes da marca
openspec/             specs por capacidade e mudanças arquivadas (spec-driven)
```

## Como o site se move

Um único quadrado violeta nasce como núcleo do símbolo no hero e viaja a página, pousando no
núcleo de cada seção e em cada botão de chamada para ação, até terminar no botão "Enviar
mensagem". O resto do movimento — símbolo nascendo, satélites nos cantos, mosaico das frentes,
Tetris no rodapé, violeta que varre o texto do contato — está descrito em `docs/motion-spec.md`.
`prefers-reduced-motion` e toque desligam tudo.

Dois setores viram palco numa tela larga: a comparação, um par por vez num baralho de papel
sobre a página velada, e as quatro frentes, que nascem do centro uma por gesto. Nos dois, um
gesto de roda, trackpad ou teclado move exatamente um passo (`src/components/motion/use-runway.ts`);
chegando ao último, a rolagem segue livre, e um salto para qualquer âncora da página solta a trava
antes. No telefone não há palco: as frentes são um trilho que rola para o lado e as telas do
portfólio rolam para o lado dentro da janela.

## Contribuir

Leia `CLAUDE.md`. Mudança de comportamento passa por `/opsx:propose` antes do código; as
specs vigentes estão em `openspec/specs/`. `pnpm check` precisa passar antes de qualquer
commit. Commits em Conventional Commits, em inglês. Antes de dizer "pronto" numa mudança visual
ou de rolagem, rode também a auditoria descrita em `docs/design-brief.md` §9 (ida e volta dos
palcos, saltos de âncora, larguras, console, acessibilidade).

## Pendências antes de ir ao ar

- Autorização para o nome de clínica visível na captura real da agenda, ou trocar a captura.
- Domínio, e-mail de contato e `CONTACT_WEBHOOK_URL` confirmados.
- Revisão jurídica do texto de `/privacidade`.
