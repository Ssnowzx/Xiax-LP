'use client'

import { useEffect, useState } from 'react'

import { ButtonLink } from '@/components/ui/button'
import { COMPANY } from '@/content/company'

/**
 * On phones the primary action stays under the thumb: a fixed bar at the
 * bottom with the one call to action, which steps aside while the contact
 * form itself is on screen.
 */
export function MobileCta() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const target = document.getElementById('contato')
    if (!target) return undefined
    const observer = new IntersectionObserver(
      (entries) => setHidden(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.15 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="mobile-cta" data-hidden={hidden}>
      <ButtonLink href="/#contato" variant="primary" className="w-full">
        {COMPANY.hero.primaryCta}
      </ButtonLink>
    </div>
  )
}
