import Link from 'next/link'

import { Lockup } from '@/components/brand/lockup'
import { Container } from '@/components/layout/container'
import { SectionCompass } from '@/components/layout/section-compass'
import { PRIMARY_NAV } from '@/content/nav'

export function SiteHeader() {
  return (
    <header id="site-header" className="sticky top-0 z-40 border-b border-hairline bg-surface">
      <Container className="flex items-center justify-between gap-clearance py-margin">
        <Link href="/" aria-label="Xiax, página inicial" className="shrink-0" data-header-mark>
          <Lockup size={24} />
        </Link>
        <SectionCompass />
        <nav aria-label="Principal" className="site-nav flex items-center gap-4 sm:gap-clearance">
          <ul className="site-nav-list flex items-center">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={item.cta ? 'btn btn-secondary btn-compact nav-cta' : 'inline-block py-2 hover:underline'}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
