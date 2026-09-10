import Link from 'next/link'

import { Lockup } from '@/components/brand/lockup'
import { Container } from '@/components/layout/container'
import { SquarePile } from '@/components/motion/square-pile'
import { COMPANY } from '@/content/company'
import { FOOTER_NAV } from '@/content/nav'

/**
 * The close: the lockup centred and alive with the manual's orbit, the
 * signature under it, then the practical lines. Xiax appears the same in
 * every footer, whatever product signs the page above.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-satellite pb-satellite lg:pb-core">
      <Container>
        <SquarePile />
        <div className="flex flex-col items-center border-t border-on pt-core text-center">
          <Lockup size={72} animated className="max-w-full" />
          <p className="mt-clearance text-lede font-medium">{COMPANY.signature}</p>
        </div>
        <div className="mt-core flex flex-col items-center gap-clearance border-t border-hairline pt-clearance text-center">
          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap justify-center gap-margin text-sm">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="data">
            {COMPANY.legalName} {year}. Sistema e infraestrutura próprios.
          </p>
        </div>
      </Container>
    </footer>
  )
}
