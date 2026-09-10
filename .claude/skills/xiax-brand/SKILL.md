---
name: xiax-brand
description: Identidade visual da Xiax. Use SEMPRE que for produzir ou revisar qualquer peça visual da Xiax — página HTML, artifact, slide, PDF, apresentação, gráfico, interface, e-mail com layout, post, cartão, banner, favicon, loader. TEM PRECEDÊNCIA sobre qualquer outra skill de marca ou tema (inclusive brand-guidelines, que aplica a marca da Anthropic e NUNCA deve ser usada em material da Xiax). Também ao escolher cores, fontes ou espaçamento de qualquer coisa que leve o nome Xiax.
---

# Identidade visual da Xiax

⚠️ **Precedência:** existe uma skill `brand-guidelines` instalada que aplica a marca da
**Anthropic**. Ela não tem nada a ver com a Xiax. Em qualquer peça da Xiax, esta skill
manda. Nunca aplique cor, tipografia ou estilo da Anthropic em material da Xiax.

A autoridade completa é `docs/brand-source/canvas/XIAX-CONTEXTO-MARCA.md` — leia antes de qualquer peça
não trivial. Este arquivo é o operacional do dia a dia.

## Símbolo

Cinco peças quadradas: quatro satélites nos cantos, um núcleo maior no centro.
Leitura: **hierarquia, não rede.** O centro manda, os satélites executam.
Estrutura preta = a engenharia. Núcleo colorido = a inteligência.

Insight que sustenta o desenho: **XIAX = X · IA · X** — carcaça nas pontas,
inteligência no núcleo.

Arquivos prontos em `public/brand/`:

| Arquivo | Uso |
|---|---|
| `xiax-simbolo-principal.svg` | fundo claro |
| `xiax-simbolo-fundo-escuro.svg` | fundo escuro |
| `xiax-simbolo-uma-tinta-preto.svg` / `-branco.svg` | monocromático, gravação, serigrafia |
| `xiax-logo-horizontal.jpg` | lockup padrão |
| `xiax-logo-vertical.jpg` | espaço quadrado: avatar, adesivo |
| `xiax-loader-*.gif` | animação de carregamento |

**Prefira embutir o SVG** — é 376 bytes e escala. Só use JPG quando SVG não for possível.

## Cor — a regra que define a marca

**A cor aparece só no núcleo.** Nome e satélites são sempre preto ou branco.

```css
:root {
  --xiax-core:  #7B57D4;  /* oklch(0.52 0.17 295) — núcleo em fundo claro */
  --xiax-dark:  #0B0B0C;
  --xiax-light: #FFFFFF;
  --xiax-muted: #6E6E72;  /* texto secundário */
}
:root:not([data-theme="light"]) { /* @media (prefers-color-scheme: dark) */
  --xiax-core: #8E6FE0;   /* oklch(0.60 0.18 295) — núcleo em fundo escuro */
}
```

- Violeta é **acento**, não fundo de peça inteira. Na marca ele ocupa ~9% da área —
  essa proporção é a decisão, não um acaso.
- O núcleo da marca Xiax **não varia por nicho**. Cor própria é do produto assinado.
- A marca funciona em uma tinta só. Não dependa de cor para ela existir.

## Tipografia

| Uso | Fonte |
|---|---|
| Marca | Archivo 700, tracking `0.30em`, caixa alta |
| Títulos | Archivo 800, tracking `-0.03em` |
| Texto corrido | Archivo 400 |
| Dado, etiqueta, código | IBM Plex Mono 400 |

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&family=IBM+Plex+Mono:wght@400&display=swap">
```
Fallback obrigatório: `Archivo, system-ui, -apple-system, sans-serif` ·
`"IBM Plex Mono", ui-monospace, monospace`.

## Geometria (grade de 100 unidades)

| Elemento | Medida |
|---|---|
| Satélite | 22u, margem 6u das bordas |
| Núcleo | 30u centrado, folga 7u |
| Área de respiro | 1 satélite (22u) em todos os lados |
| Vão símbolo–nome | 1 satélite |

Tamanho mínimo: símbolo isolado 16px em tela / 8mm impresso. Lockup completo só a partir
de 24px de altura do símbolo — abaixo disso, use só o símbolo.

## Proibido

Distorcer, girar, aplicar sombra, **inverter as cores** (satélite colorido com núcleo
preto), usar sobre fundo de luminosidade média, colar símbolo no nome sem o vão de
1 satélite, slogan centralizado ou em caixa alta.

**Tropos visuais proibidos:** cérebro, rede neural, circuito, nós conectados, partículas,
gradiente holográfico, robô, balão de conversa, foguete, seta subindo, gráfico crescente,
globo, hexágono genérico de "tech", off-white quente com laranja-barro.

## Loader

O violeta circula pela estrutura. Padrão: órbita contínua, ciclo de 1,6s
(1,1s para ação curta, 2s para processo longo). Código ajustável em
`docs/brand-source/canvas/Xiax Loader.dc.html`.
Com `prefers-reduced-motion`, use pulso do núcleo ou símbolo estático. O loader nunca é
a única indicação de carregamento.

## Antes de entregar

Rode o agente `brand-guardian` para revisão completa. Para o texto da peça, use a skill
`xiax-voice`.
