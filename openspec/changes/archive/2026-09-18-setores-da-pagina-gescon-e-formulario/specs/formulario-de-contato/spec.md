## REMOVED Requirements

### Requirement: Frase com lacunas

**Reason**: A frase em primeira pessoa com lacunas não era reconhecida como formulário (pedido do fundador em 17/09/2026: "não é muito intuitivo").

**Migration**: Os mesmos cinco campos, com os mesmos nomes e a mesma validação, passam a campos com rótulo dentro de um cartão de papel; a ação do servidor, o honeypot e o limite de taxa não mudam.

## ADDED Requirements

### Requirement: Campos com rótulo em cartão de papel

O formulário SHALL ter cinco campos com rótulo visível acima de cada um: nome, empresa, e-mail para a resposta, frente que mais parece com a da pessoa (opcional, "Ainda não sei" por padrão) e o que trava hoje (texto livre). Os campos SHALL ser caixas com borda; nome, empresa, e-mail e frente ficam em duas colunas a partir de 48rem e empilhados abaixo disso. Um campo com dica SHALL mostrá-la entre o rótulo e a caixa. O formulário fica num cartão de papel (polaridade invertida: papel, tinta, violeta de fundo claro), encabeçado pelo símbolo e pela etiqueta "mensagem para a Xiax" em tamanho de apoio, com o destaque violeta. O papel do cartão MUST ser pintado atrás do núcleo viajante, para o núcleo aparecer pelo botão de enviar.

#### Scenario: Envio com campo vazio
- **WHEN** a pessoa envia sem nome ou com e-mail inválido
- **THEN** cada erro aparece em português do Brasil logo abaixo do campo a que pertence, a borda do campo engrossa e fica tracejada, e nada é enviado

#### Scenario: Telefone
- **WHEN** a largura é menor que 48rem
- **THEN** os cinco campos ficam empilhados numa coluna e o botão "Enviar mensagem" continua sendo o último encaixe do núcleo
