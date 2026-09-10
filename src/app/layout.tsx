import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Archivo, IBM_Plex_Mono } from 'next/font/google'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { MobileCta } from '@/components/layout/mobile-cta'
import { SkipLink } from '@/components/layout/skip-link'
import { Splash } from '@/components/layout/splash'
import { ThemeScript } from '@/components/layout/theme-script'
import { PageGrid } from '@/components/motion/page-grid'
import { PageShell } from '@/components/motion/page-shell'
import { TravelingCore } from '@/components/motion/traveling-core'
import { COMPANY } from '@/content/company'
import { env } from '@/lib/env'
import { OG_IMAGE, organizationJsonLd } from '@/lib/seo'

import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: { default: `${COMPANY.name} — ${COMPANY.signature}`, template: `%s — ${COMPANY.name}` },
  description: COMPANY.description,
  applicationName: COMPANY.name,
  authors: [{ name: COMPANY.name }],
  robots: { index: true, follow: true },
  icons: { icon: '/brand/xiax-simbolo-principal.svg' },
  openGraph: { images: [{ url: OG_IMAGE, width: 2400, height: 960, alt: 'Xiax' }] },
}

export const viewport: Viewport = {
  themeColor: '#0b0b0c',
}

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <Splash />
        <SkipLink />
        <SiteHeader />
        <main id="conteudo">{children}</main>
        <SiteFooter />
        <MobileCta />
        <PageShell />
        <PageGrid />
        <TravelingCore />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationJsonLd() }} />
      </body>
    </html>
  )
}
