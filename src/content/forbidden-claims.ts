/**
 * Claims the site may never make. Kept in its own file so the anti-slop
 * scanner can skip the list itself while still checking everything else.
 * Enforced by src/content/content.test.ts and scripts/anti-slop.mjs.
 */
export const FORBIDDEN_CLAIMS: readonly string[] = [
  'revolucionário',
  'disruptivo',
  'mágico',
  'game changer',
  'solução inovadora',
  'transformação digital',
  'potencializar',
  'alavancar',
  'empoderar',
]
