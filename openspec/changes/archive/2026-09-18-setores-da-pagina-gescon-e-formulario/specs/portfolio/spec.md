## MODIFIED Requirements

### Requirement: Só produção

`src/content/portfolio.ts` SHALL listar apenas sistemas em produção, com estado real, URL pública e stack. Piloto e protótipo MUST NOT entrar. A lista tem o Xclinicas (`https://xclinicas.xiax.com.br`) e, desde 17/09/2026 por decisão do fundador, a Gestão de Convênios (`https://gescon.gestaonossa.com.br`), a esteira de convênios do Xclinicas. Na página inicial, cada sistema SHALL dizer a própria posição na lista ("sistema 1 de 2") e os sistemas ficam separados por um fio.

#### Scenario: Entrada sem URL pública
- **WHEN** alguém adiciona uma entrada sem `url` ou com `state` diferente de `production`
- **THEN** o teste de conteúdo (`src/content/content.test.ts`) reprova

### Requirement: Capturas com origem

Cada captura de tela SHALL registrar `source` (o domínio de onde saiu) e `capturedAt` (data), mostrados na legenda. Quando a captura teve dado pessoal substituído, a legenda SHALL dizer o que foi substituído. Para o Xclinicas, a captura real aparece pequena, como prova, e a demonstração vetorial é o destaque; para os demais sistemas, as capturas reais são o destaque, num visor com uma aba por módulo.

#### Scenario: Legenda
- **WHEN** a captura da agenda aparece na página
- **THEN** a legenda diz "Tela real da agenda, clinica.gestaonossa.com.br, 2026-09-09"

#### Scenario: Legenda da Gestão de Convênios
- **WHEN** o visor da Gestão de Convênios aparece na página
- **THEN** a legenda diz "Telas reais de gescon.gestaonossa.com.br, 2026-09-17. Nomes, carteirinhas e números de guia foram substituídos."

## ADDED Requirements

### Requirement: Dado pessoal substituído antes de publicar

Uma tela real de sistema em uso MUST NOT mostrar nome de paciente, carteirinha, senha de autorização, número de guia, nome de profissional, de médico ou de usuário reais, nem o nome da clínica cliente. Antes de publicar, esses dados SHALL ser substituídos por valores fictícios na própria captura, e uma checagem automática SHALL comparar os nomes e números do texto original com o texto renderizado: nenhum pode sobreviver.

#### Scenario: Nome real sobrevive à substituição
- **WHEN** a checagem encontra no render um nome ou número presente no texto original da tela
- **THEN** a captura não é publicada até a substituição cobrir esse caso

### Requirement: Visor de telas reais

Um sistema sem demonstração vetorial SHALL mostrar as capturas reais numa janela desenhada pela Xiax (três quadrados, endereço, etiqueta "telas reais"), com uma aba por módulo, uma tela visível por vez, e a legenda com origem, data e o que foi substituído. As abas SHALL responder a clique e às setas do teclado, e cada tela SHALL ter texto alternativo que a descreva. Abaixo de 48rem a tela SHALL manter uma altura legível e rolar para o lado sob o dedo, em vez de encolher à largura do telefone, e o painel ativo SHALL ser focável pelo teclado.

#### Scenario: Tela num telefone
- **WHEN** a pessoa abre o visor num telefone de 390px de largura
- **THEN** a tela ativa aparece mais larga que a janela, rola para o lado ao arrastar, e a página não fica mais larga que a tela

#### Scenario: Troca de aba
- **WHEN** a pessoa escolhe a aba "Automações"
- **THEN** a tela das automações fica visível, a aba fica marcada como selecionada e o avanço automático para
