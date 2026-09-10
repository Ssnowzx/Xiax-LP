import type { Metadata } from 'next'

import { COMPANY } from '@/content/company'
import { env } from '@/lib/env'

interface PageMetaInput {
  readonly title: string
  readonly description: string
  readonly path: string
}

/** The horizontal lockup on white, 2400×960: the same file used for registration. */
export const OG_IMAGE = '/brand/xiax-logo-horizontal.jpg'

export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  const url = new URL(path, env.NEXT_PUBLIC_SITE_URL).toString()
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: COMPANY.name,
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: OG_IMAGE, width: 2400, height: 960, alt: 'Xiax' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE] },
  }
}

export function organizationJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    description: COMPANY.description,
    url: env.NEXT_PUBLIC_SITE_URL,
    slogan: COMPANY.signature,
    logo: new URL('/brand/xiax-simbolo-principal.svg', env.NEXT_PUBLIC_SITE_URL).toString(),
    areaServed: 'BR',
  })
}
