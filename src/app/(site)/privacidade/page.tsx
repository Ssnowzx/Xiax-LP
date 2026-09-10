import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Privacidade',
  description: 'Como a Xiax trata os dados enviados por este site, conforme a LGPD.',
  path: '/privacidade',
})

export default function PrivacyPage() {
  return (
    <Container width="reading" className="py-satellite lg:py-core">
      <h1 className="text-3xl">Privacidade</h1>
      <div className="prose-xiax mt-satellite text-on">
        <p className="text-on-muted">
          Este aviso vale para o site xiax.com.br e explica o que acontece com os dados que você
          envia por ele, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>

        <h2>Quais dados o site recebe</h2>
        <p>
          Só o que você digita no formulário de contato: nome, e-mail, empresa, a frente de
          interesse e a mensagem. O site não usa cookies de rastreamento, não carrega scripts de
          terceiros e não mede comportamento de navegação.
        </p>
        <p>
          A preferência de tema claro ou escuro fica guardada no seu navegador e não é enviada a
          lugar nenhum.
        </p>

        <h2>Para que a Xiax usa esses dados</h2>
        <p>Para responder à sua mensagem e, se fizer sentido para os dois lados, combinar uma conversa.</p>
        <p>A base legal é a execução de diligências preliminares a pedido seu (art. 7º, V, da LGPD).</p>

        <h2>Por quanto tempo</h2>
        <p>
          Enquanto a conversa durar e por até doze meses depois do último contato, para que o
          histórico exista se você voltar. Depois disso, a mensagem é apagada.
        </p>

        <h2>Com quem a Xiax compartilha</h2>
        <p>
          Com ninguém. A mensagem vai do site para um sistema da própria Xiax, hospedado em
          infraestrutura própria em região brasileira. Nenhum serviço de terceiro recebe o
          conteúdo.
        </p>

        <h2>Seus direitos</h2>
        <ul>
          <li>Saber quais dados a Xiax tem sobre você.</li>
          <li>Corrigir um dado incompleto ou errado.</li>
          <li>Pedir a exclusão do que foi enviado.</li>
          <li>Revogar o consentimento, quando ele for a base do tratamento.</li>
        </ul>
        <p>Para exercer qualquer um deles, use o mesmo formulário de contato e diga o que precisa.</p>

        <h2>Mudanças neste aviso</h2>
        <p>
          Se o tratamento mudar, este texto muda junto, com a data da alteração. Última alteração:
          setembro de 2026.
        </p>
      </div>
    </Container>
  )
}
