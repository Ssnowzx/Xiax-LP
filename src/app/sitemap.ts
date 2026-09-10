import type { MetadataRoute } from 'next'

import { env } from '@/lib/env'

const ROUTES = ['/', '/portfolio', '/contato', '/privacidade'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map((route) => ({
    url: new URL(route, env.NEXT_PUBLIC_SITE_URL).toString(),
    lastModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.6,
  }))
}
