import type { Metadata } from 'next'

import { ContactSection } from '@/components/sections/contact-section'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Contato',
  description: 'Conte a operação que precisa entrar em produção. Se fizer sentido, a Xiax marca uma visita.',
  path: '/contato',
})

export default function ContactPage() {
  return <ContactSection headingLevel="h1" />
}
