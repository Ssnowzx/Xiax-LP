---
name: xiax-voice
description: A voz da Xiax por escrito. Use SEMPRE que for escrever qualquer texto que carregue o nome da Xiax — proposta comercial, e-mail para cliente, post, página de site, apresentação, mensagem de WhatsApp comercial, README público, descrição de produto, resposta a lead. Também ao revisar texto pronto antes de sair da empresa. Não use para documento interno do repo (journal, ADR, playbook), que tem regras próprias no CLAUDE.md.
---

# A voz da Xiax

A Xiax vende para empresa. Empresa **confia antes de gostar**. Por isso a escrita é
sóbria, técnica e direta — o oposto do tom de startup de IA.

Antes de escrever, leia `docs/design-brief.md`. Se o texto for para um cliente
específico, leia também `docs/references.md`.

## O que a Xiax é (e isso guia cada frase)

Empresa de tecnologia brasileira, IA-first, que constrói **sistemas completos em
produção** para outras empresas, em **infraestrutura própria**. Não vende ferramenta
pronta, não revende SaaS de terceiro, não entrega piloto como produto final.

Ordem de prioridade da mensagem, sempre:
1. **Engenharia de verdade** — sistema em produção, não protótipo.
2. **O motor é nosso** — infra própria, tecnologia no núcleo.
3. **Sobriedade** — nada de euforia.

## Regras de escrita

**Escreva assim:**
- Frase curta. Verbo concreto. Sujeito explícito.
- Diga o que o sistema faz, não o que ele "representa".
- Número só com prova. Se não podemos provar, não entra.
- Nomeie o custo junto do benefício. Isso é o que distingue vendedor de engenheiro.
- Português do Brasil. Termo técnico em inglês só quando não existe equivalente em uso
  real (deploy, cache, deadline não; *durable execution*, *buy box* sim).

**Nunca escreva:**
- "Revolucionário", "disruptivo", "mágico", "game changer", "solução inovadora",
  "transformação digital", "potencializar", "alavancar", "unlock", "empoderar".
- "Nós acreditamos que...", "No mundo de hoje...", "Em um cenário cada vez mais..."
- Promessa de resultado sem caso que a sustente ("aumente suas vendas em 300%").
- Emoji em material comercial. Em texto interno, no máximo como marcador de estado.
- Exclamação. Uma por documento é uma a mais.

## Estrutura padrão de texto comercial

1. **O problema, nas palavras do cliente.** Se você não consegue escrever isso, o
   discovery não terminou — pergunte, não invente.
2. **O que a Xiax constrói.** Concreto: o sistema, os módulos, onde roda.
3. **O que não está incluso.** Explicitamente. Escopo aberto destrói projeto.
4. **Como se sabe que deu certo.** Critério verificável.
5. **Investimento e prazo.**

## Marca guarda-chuva

A Xiax assina produtos com nomes e públicos diferentes. Texto institucional **nunca**
amarra a Xiax a um produto específico. Produto tem nome próprio; a Xiax é o selo de
quem construiu.

## Assinatura verbal

Padrão: **"IA no núcleo da operação."**

| Alternativa | Quando |
|---|---|
| Em produção, não em piloto. | Venda, para quem já testou IA e não colocou nada no ar |
| Donos do motor. | Peça pequena, autoridade |
| Sistemas, não assinaturas. | Contraste direto com o mercado de SaaS |
| Tecnologia que entra em produção. | Institucional |

Regra de encaixe: alinhada à esquerda, Archivo 500, corpo entre 22% e 30% do nome.
**Nunca centralizada, nunca em caixa alta.**

## Teste final, antes de entregar

> Esse texto caberia em qualquer empresa de IA do Brasil?

Se a resposta for sim, ele não é da Xiax. Reescreva até só a Xiax poder ter escrito.

Para revisão visual da peça, use a skill `xiax-brand` ou o agente `brand-guardian`.
