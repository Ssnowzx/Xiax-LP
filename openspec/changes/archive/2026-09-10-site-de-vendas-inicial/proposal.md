# Site de vendas e portfólio da Xiax

## Por quê

A Xiax não tinha página. O que existia era o manual de marca (`docs/brand-source`), o posicionamento e um sistema em produção (Xclinicas). Uma empresa que vende sistema em produção precisa de uma página que prove isso sem virar mais um site de IA com fundo preto e violeta.

## O que muda

- Página inicial de venda de serviço: hero, serviço, método, frentes, o que está no ar, motor, contato.
- Páginas `/portfolio`, `/contato`, `/privacidade`.
- Sistema de movimento da marca: núcleo viajante, símbolo nascendo, carcaça, grade, operação antes/depois, mosaico, Tetris de quadrados, destaque que varre o texto.
- Xclinicas simulado no navegador, sem back-end, operado por um cursor-núcleo.
- Guardas de marca e anti-slop em código, rodando no CI.
- Deploy em VPS própria com Docker e Caddy.

## Fora de escopo

- Páginas de frente com escopo, prazo e preço (dependem de `company/offering.md`).
- Página Sobre (depende de `company/team.md`).
- Outros sistemas no portfólio (dependem de autorização e estado confirmado).
- Envio real do formulário (depende de `CONTACT_WEBHOOK_URL`, domínio e e-mail).

## Capacidades

`pagina-de-vendas`, `movimento-de-marca`, `demonstracao-xclinicas`, `formulario-de-contato`, `portfolio`, `guardas-de-marca`, `deploy-vps` — todas em `openspec/specs/`.
