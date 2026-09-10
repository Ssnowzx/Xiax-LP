import { Container } from '@/components/layout/container'
import { CtaRail } from '@/components/ui/cta-rail'
import { OperationAssembly } from '@/components/motion/operation-assembly'
import { COMPANY } from '@/content/company'
import { COMPARISON } from '@/content/comparison'
import { CTAS } from '@/content/ctas'

/**
 * What the service is, in plain words: the operation before, the system
 * after, and the table of what changes in the way of working.
 */
export function Service() {
  const { title, lede, columns } = COMPANY.service

  return (
    <section className="py-satellite lg:py-core" aria-labelledby="servico">
      <Container>
        <div className="grid gap-satellite lg:grid-cols-[3fr_2fr] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-core">
          <div className="lg:col-start-1 lg:row-start-1">
            <h2 id="servico" className="reveal text-3xl lg:text-4xl">
              {title}
            </h2>
            <p className="measure mt-clearance text-lede text-on-muted">{lede}</p>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-core">
            <OperationAssembly />
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <table className="comparison w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-on">
                  <th scope="col" className="w-1/2 pr-clearance pb-margin align-bottom text-sm font-medium text-on-muted">
                    {columns.market}
                  </th>
                  <th scope="col" className="w-1/2 pb-margin align-bottom text-sm font-medium">
                    {columns.xiax}
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.businessHouse} className="comparison-row border-b border-hairline align-top">
                    <td data-label={columns.market} className="pr-clearance py-clearance text-sm text-on-muted">
                      <span className="struck">{row.softwareHouse}</span>
                    </td>
                    <td data-label={columns.xiax} className="py-clearance">
                      <span className="stepping">
                        <i aria-hidden="true" />
                        {row.businessHouse}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <CtaRail cta={CTAS.service} slot="service-cta" />
      </Container>
    </section>
  )
}
