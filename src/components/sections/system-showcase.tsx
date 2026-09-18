import Image from 'next/image'

import type { PortfolioItem } from '@/types'
import { ClinicDemo } from '@/components/demo/clinic-demo'
import { ScreenViewer } from '@/components/sections/screen-viewer'
import { findFront } from '@/content/fronts'
import { STATE_LABEL } from '@/content/portfolio'

interface SystemShowcaseProps {
  readonly item: PortfolioItem
  /** `h2` on the portfolio page, `h3` under the home page's own heading. */
  readonly headingLevel?: 'h2' | 'h3'
  /** Position in the list and how many there are, when the list is shown whole. */
  readonly position?: number | undefined
  readonly count?: number | undefined
}

/** The Xclinicas is shown as a working simulation; every other system shows its real screens. */
const SIMULATED_SLUG = 'xclinicas'

/**
 * One system: the simulation or the real screens in a Xiax window, the
 * modules beside it, and the ledger of what is built. Under the simulation, a
 * small real screen is the proof that the system exists.
 */
export function SystemShowcase({ item, headingLevel = 'h3', position, count }: SystemShowcaseProps) {
  const Heading = headingLevel
  const front = findFront(item.front)
  const simulated = item.slug === SIMULATED_SLUG
  const proof = simulated ? item.screens?.screens[0] : undefined

  return (
    <article className="showcase grid gap-satellite py-satellite">
      <div>
        {position && count ? (
          <p className="data">
            sistema {position} de {count}
          </p>
        ) : null}
        <Heading className="sweep mt-2 text-2xl lg:text-3xl">
          <span className="sweep-line">{item.name}</span>
        </Heading>
        <p className="data mt-3">
          {STATE_LABEL[item.state]}
          {item.since ? `, no ar desde ${item.since}` : ''}
          {front ? `, ${front.name.toLowerCase()}` : ''}
        </p>
        <p className="measure mt-clearance text-lede">{item.summary}</p>
      </div>

      {simulated ? <ClinicDemo name={item.name} /> : null}
      {!simulated && item.screens ? <ScreenViewer name={item.name} screens={item.screens} /> : null}

      <div className="grid gap-satellite lg:grid-cols-[2fr_3fr] lg:gap-x-core">
        <div>
          {proof && item.screens ? (
            <figure>
              <div className="proof">
                <Image
                  src={proof.src}
                  width={proof.width}
                  height={proof.height}
                  alt={proof.alt}
                  sizes="(min-width: 64rem) 28rem, 100vw"
                  className="block h-auto w-full"
                />
              </div>
              <figcaption className="data mt-margin">
                Tela real da {proof.label.toLowerCase()}, {item.screens.source}, {item.screens.capturedAt}
              </figcaption>
            </figure>
          ) : null}
          <p className="measure mt-clearance text-on-muted">Para quem: {item.forWhom}</p>
          {item.url ? (
            <a href={item.url} className="btn btn-secondary mt-clearance" rel="noopener">
              Abrir {item.name}
            </a>
          ) : null}
        </div>
        <div>
          <p className="text-sm font-medium">O que está construído</p>
          <ul className="mt-margin border-t border-hairline">
            {item.built.map((line) => (
              <li key={line} className="border-b border-hairline py-3">
                {line}
              </li>
            ))}
          </ul>
          <p className="data mt-clearance">{item.stack.join(', ')}</p>
        </div>
      </div>
    </article>
  )
}
