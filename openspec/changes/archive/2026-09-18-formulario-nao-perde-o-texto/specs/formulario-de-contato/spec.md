## MODIFIED Requirements

### Requirement: Campos com rótulo em cartão de papel

O formulário SHALL ter cinco campos com rótulo visível acima de cada um: nome, empresa, e-mail para a resposta, frente que mais parece com a da pessoa (opcional, "Ainda não sei" por padrão) e o que trava hoje (texto livre). Os campos SHALL ser caixas com borda; nome, empresa, e-mail e frente ficam em duas colunas a partir de 48rem e empilhados abaixo disso. Um campo com dica SHALL mostrá-la entre o rótulo e a caixa. O formulário fica num cartão de papel (polaridade invertida: papel, tinta, violeta de fundo claro), encabeçado pelo símbolo e pela etiqueta "mensagem para a Xiax" em tamanho de apoio, com o destaque violeta. O papel do cartão MUST ser pintado atrás do núcleo viajante, para o núcleo aparecer pelo botão de enviar. Um envio que não passa MUST devolver o formulário com tudo que foi escrito, inclusive a frente escolhida, e o foco SHALL ir para o primeiro campo com erro na ordem de leitura. O erro SHALL ser marcado pelo átomo violeta e escrito em peso forte, e a frase SHALL dizer o motivo da recusa, não só o que fazer.

#### Scenario: Envio com campo vazio
- **WHEN** a pessoa envia sem nome ou com e-mail inválido
- **THEN** cada erro aparece em português do Brasil logo abaixo do campo a que pertence, a borda do campo engrossa e fica tracejada, nada é enviado, o que foi escrito continua no formulário e o cursor pousa no primeiro campo com erro

#### Scenario: Mensagem curta demais
- **WHEN** a pessoa escreve menos que o mínimo no campo de mensagem
- **THEN** o texto continua lá, o cursor vai para ele e o aviso aparece logo abaixo

#### Scenario: Entrega falha
- **WHEN** nenhum canal aceita a mensagem
- **THEN** a pessoa vê o aviso de falha com o e-mail alternativo e o texto continua no formulário, pronto para outra tentativa

#### Scenario: Telefone
- **WHEN** a largura é menor que 48rem
- **THEN** os cinco campos ficam empilhados numa coluna e o botão "Enviar mensagem" continua sendo o último encaixe do núcleo
