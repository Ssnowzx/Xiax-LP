## Why

O fundador escreveu uma mensagem curta demais em 18/09/2026 e o formulário apagou tudo. O erro
aparecia sob o campo, mas quem acabou de ver a tela esvaziar não lê uma linha de letra miúda: o
React limpa o formulário assim que a ação responde, e o aviso ficava sozinho num cartão em branco.

## What Changes

- Resultado reprovado (`invalid`) e falha de entrega (`failed`) passam a devolver o que a pessoa
  escreveu; o formulário volta preenchido, inclusive a frente escolhida.
- O cursor vai para o primeiro campo com erro, na ordem de leitura, então a tela rola até ele.
- A dica do campo de mensagem diz que é preciso pelo menos uma frase, antes de a pessoa enviar.

## Capabilities

### Modified Capabilities

- `formulario-de-contato`: o que acontece com o texto quando o envio não passa.

## Impact

- `src/types/index.ts`, `src/lib/contact.ts`, `src/app/(site)/contato/actions.ts`,
  `src/components/sections/contact-form.tsx`, `src/lib/contact.test.ts`.
