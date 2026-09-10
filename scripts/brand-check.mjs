#!/usr/bin/env node
/**
 * Brand guard.
 *
 * Checks that the source uses only the brand's colours, fonts and geometry.
 * Values come from public/brand/LEIA-ME.txt and the brand manual.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')

const APPROVED_HEX = new Set(['#0b0b0c', '#ffffff', '#7b57d4', '#8e6fe0', '#6e6e72', '#8e8e93'])
const APPROVED_OKLCH = [
  'oklch(0.52 0.17 295)',
  'oklch(0.6 0.18 295)',
  'oklch(0.91 0.004 295)',
  'oklch(0.28 0.008 295)',
]
const APPROVED_FONTS = new Set(['Archivo', 'IBM_Plex_Mono'])

const MARK_GEOMETRY = [
  /\{\s*x:\s*6,\s*y:\s*6\s*\}/,
  /\{\s*x:\s*72,\s*y:\s*6\s*\}/,
  /\{\s*x:\s*72,\s*y:\s*72\s*\}/,
  /\{\s*x:\s*6,\s*y:\s*72\s*\}/,
  /width=\{22\}/,
  /x=\{35\}\s+y=\{35\}\s+width=\{30\}\s+height=\{30\}/,
]

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (['.ts', '.tsx', '.css'].includes(extname(full))) out.push(full)
  }
  return out
}

const problems = []

/** A product signed by Xiax carries its own colours (umbrella rule). */
const PRODUCT_PALETTES = ['src/components/demo/palette.css', 'src/components/demo/demo.css']

for (const file of walk(SRC)) {
  const rel = relative(ROOT, file)
  if (PRODUCT_PALETTES.includes(rel)) continue
  const text = readFileSync(file, 'utf8')

  for (const match of text.matchAll(/#[0-9a-f]{6}\b/gi)) {
    if (!APPROVED_HEX.has(match[0].toLowerCase())) problems.push(`${rel}: cor fora da marca ${match[0]}`)
  }
  for (const match of text.matchAll(/oklch\([^)]*\)/g)) {
    if (!APPROVED_OKLCH.includes(match[0])) problems.push(`${rel}: oklch fora da marca ${match[0]}`)
  }
  for (const match of text.matchAll(/import\s*\{([^}]*)\}\s*from\s*'next\/font\/google'/g)) {
    const names = match[1] ?? ''
    for (const name of names.split(',').map((item) => item.trim()).filter(Boolean)) {
      if (!APPROVED_FONTS.has(name)) problems.push(`${rel}: fonte fora da marca ${name}`)
    }
  }
}

const mark = readFileSync(join(SRC, 'components/brand/mark.tsx'), 'utf8')
for (const pattern of MARK_GEOMETRY) {
  if (!pattern.test(mark)) problems.push(`components/brand/mark.tsx: geometria alterada (${pattern})`)
}
if (/rotate|skew|drop-shadow|filter:/.test(mark)) problems.push('components/brand/mark.tsx: símbolo com rotação, distorção ou sombra')

if (problems.length === 0) {
  console.log('brand-check: marca íntegra.')
  process.exit(0)
}
for (const problem of problems) console.error(problem)
console.error(`\nbrand-check: ${problems.length} problema(s).`)
process.exit(1)
