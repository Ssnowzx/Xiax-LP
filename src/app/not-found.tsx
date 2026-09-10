import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Container className="py-orbit">
      <p className="data">404</p>
      <h1 className="mt-margin text-3xl">Essa página não existe.</h1>
      <p className="measure mt-clearance text-on-muted">
        O endereço pode ter mudado ou nunca ter existido. O que existe está na página inicial.
      </p>
      <ButtonLink href="/" className="mt-satellite">
        Ir para a página inicial
      </ButtonLink>
    </Container>
  )
}
