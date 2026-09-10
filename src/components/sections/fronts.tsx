import { Loader } from '@/components/brand/loader'
import { Container } from '@/components/layout/container'
import { COMPANY } from '@/content/company'
import { FRONTS } from '@/content/fronts'

const CELLS = ['tl', 'tr', 'br', 'bl'] as const

/**
 * The core as a 10×10 mosaic: 40% of the cells are violet (transparent, so
 * the travelling core paints them when it docks), the rest white. The middle
 * band is always white so the words read in either state.
 */
const MOSAIC = 10
const VIOLET_SHARE = 0.4
const MOSAIC_CELLS = Array.from({ length: MOSAIC * MOSAIC }, (_, index) => index)
const PLATE_ROWS = [3, 4, 5, 6] as const
const PLATE_COLS = [1, 8] as const
const MOSAIC_SEED = 101

function isPlate(index: number): boolean {
  const row = Math.floor(index / MOSAIC)
  const col = index % MOSAIC
  return PLATE_ROWS.includes(row as 3) && col >= PLATE_COLS[0] && col <= PLATE_COLS[1]
}

/** Small seeded generator (mulberry32) so server and client agree on the pattern. */
function seeded(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state)
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

function shuffled(values: readonly number[], random: () => number): number[] {
  const out = [...values]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    const a = out[i]
    const b = out[j]
    if (a !== undefined && b !== undefined) {
      out[i] = b
      out[j] = a
    }
  }
  return out
}

const OUTSIDE_PLATE = MOSAIC_CELLS.filter((index) => !isPlate(index))
const VIOLET_CELLS = new Set(
  shuffled(OUTSIDE_PLATE, seeded(MOSAIC_SEED)).slice(0, Math.round(MOSAIC * MOSAIC * VIOLET_SHARE)),
)

/** The manual's reason for each loader, shown to people who use a screen reader. */
const LOADER_MEANING = {
  grow: 'sistema sendo montado',
  sequence: 'progresso',
  trail: 'órbita com rastro',
  orbit: 'trabalho contínuo',
  'orbit-step': 'processo com fases',
  dots: 'espera curta',
  pulse: 'núcleo em espera',
} as const

/**
 * The four fronts laid out as the mark, on the mark's own construction lines.
 * Each front carries the loader whose meaning in the manual matches it. The
 * core in the centre is the travelling core's slot; the signature lives inside.
 */
export function Fronts() {
  return (
    <section className="fronts-section py-satellite" aria-labelledby="frentes">
      <Container>
        <h2 id="frentes" className="sr-only">
          Quatro frentes, um núcleo
        </h2>
        <div className="orbit-grid blueprint">
          <span aria-hidden="true" className="blueprint-line" style={{ left: '25%' }} />
          <span aria-hidden="true" className="blueprint-line" style={{ left: 'calc(100% * 29 / 88)' }} />
          <span aria-hidden="true" className="blueprint-line" style={{ left: 'calc(100% * 59 / 88)' }} />
          <span aria-hidden="true" className="blueprint-line" style={{ left: '75%' }} />

          <div data-cell="core" className="order-first lg:order-none">
            <div data-core-slot="fronts" className="core-slot slot-core mosaic">
              {MOSAIC_CELLS.map((index) => (
                <i
                  key={index}
                  aria-hidden="true"
                  className={VIOLET_CELLS.has(index) ? 'mosaic-cell' : 'mosaic-cell is-white'}
                />
              ))}
              <div className="slot-text">
                <p className="slot-caption">{COMPANY.signature}</p>
                <p className="slot-note">Quatro frentes. Um jeito de construir.</p>
              </div>
            </div>
          </div>

          <div className="front-rail">
            {FRONTS.map((front, index) => (
              <div key={front.slug} data-cell={CELLS[index] ?? 'tl'} className="front-cell">
                <Loader variant={front.loader} size={48} title={`Loader ${LOADER_MEANING[front.loader]}`} />
                <h3 className="mt-clearance text-xl">{front.name}</h3>
                <p className="mt-2 text-sm text-on-muted">{front.promise}</p>
                <p className="data mt-margin">{front.examples.join(', ')}</p>
              </div>
            ))}
          </div>
          <p className="data front-hint lg:hidden">deslize para ver as quatro frentes</p>
        </div>
      </Container>
    </section>
  )
}
