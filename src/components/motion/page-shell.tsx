/**
 * The mark at page scale: four outlined satellites fixed to the corners of
 * the viewport, behind everything. As the page scrolls they open outwards and
 * close again at the end, so the whole page reads as the mark — structure at
 * the edges, the travelling core inside. CSS-only, scroll-driven; browsers
 * without scroll timelines get the still frame.
 */
export function PageShell() {
  return (
    <div aria-hidden="true" className="page-shell">
      <span data-shell="tl" />
      <span data-shell="tr" />
      <span data-shell="br" />
      <span data-shell="bl" />
    </div>
  )
}
