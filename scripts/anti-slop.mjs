#!/usr/bin/env node
/**
 * Anti-slop guard.
 *
 * Fails the build when the source drifts toward the visual and verbal
 * defaults of generated pages, or breaks the brand's own prohibitions.
 * Rules come from docs/design-brief.md §3–§4 and the brand manual.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const EXTENSIONS = new Set(['.ts', '.tsx', '.css'])

const RULES = [
  {
    id: 'cream-and-clay',
    test: /#f4f1ea|#d97757/i,
    why: 'Cream background + clay accent is the most common AI-generated palette.',
  },
  {
    id: 'gradient',
    test: /\bbg-(?:gradient|linear|radial|conic)|background(?:-image|-color)?:\s*[^;]*gradient\(/,
    why: 'The brand allows no gradient as colour. Colour appears only in the core. (Masks are geometry, not colour.)',
    /* One colour twice is a paintable box, not a gradient: the highlighter sweep. */
    allow: /linear-gradient\(var\(--accent\), var\(--accent\)\)/,
  },
  // The simulated product (src/components/demo) carries the product's own
  // design: rounded corners, soft shadows, its own separators. Umbrella rule.
  {
    id: 'shadow',
    exclude: /components\/demo\//,
    test: /\bshadow-(?!none)[a-z0-9-]*|box-shadow:/,
    why: 'The brand forbids shadow on the mark; the site carries none anywhere.',
  },
  {
    id: 'radius',
    exclude: /components\/demo\//,
    test: /\brounded(?!-none)(-[a-z0-9-]+)?\b|border-radius:(?!\s*(?:0|var\(--radius-none\)))/,
    why: 'The mark is made of squares. Radius is zero everywhere.',
  },
  {
    id: 'arrow-in-text',
    test: /→/,
    why: 'An arrow appended to link or button text is a generated-page tell.',
  },
  {
    id: 'middle-dot-meta',
    test: /·/,
    why: 'Meta strings joined with middle dots read as template chrome. Separate with commas.',
    only: /\.tsx$/,
    exclude: /components\/demo\//,
  },
  {
    id: 'eyebrow',
    test: /uppercase[^"'`]*tracking-(?!wordmark)|tracking-(?!wordmark|display)[a-z-]*[^"'`]*uppercase/,
    why: 'Tracked-out uppercase labels are template chrome. Only the wordmark is uppercase.',
    exclude: /components\/brand\//,
  },
  {
    id: 'forbidden-trope',
    test: /\b(brain|neural|circuit|particle|robot(?!s\b)|rocket|globe|hexagon|network-graph|hologra)\w*/i,
    why: 'Brand manual: no brain, neural net, circuit, particles, robot, rocket, globe, hexagon, holographic gradient.',
  },
  {
    id: 'hype',
    test: /revolucion[áa]ri|disruptiv|m[áa]gic[oa]\b|game changer|solu[çc][ãa]o inovadora|transforma[çc][ãa]o digital|potencializ|alavanc|empoder/i,
    why: 'Voice rule: no hype words. If the sentence fits any AI company, rewrite it.',
    exclude: /forbidden-claims\.ts$/,
  },
  {
    id: 'console',
    test: /console\.(log|debug|info)\(/,
    why: 'No console output in production code.',
  },
  {
    id: 'build-slot',
    test: /<BuildSlot\b/,
    why: 'A reserved-but-unbuilt section cannot ship.',
  },
]

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (EXTENSIONS.has(extname(full)) && !/\.test\.tsx?$/.test(full)) out.push(full)
  }
  return out
}

const findings = []
for (const file of walk(SRC)) {
  const rel = relative(ROOT, file)
  const lines = readFileSync(file, 'utf8').split('\n')
  for (const rule of RULES) {
    if (rule.only && !rule.only.test(rel)) continue
    if (rule.exclude && rule.exclude.test(rel)) continue
    lines.forEach((line, index) => {
      if (rule.allow && rule.allow.test(line)) return
      if (rule.test.test(line)) findings.push({ rule, rel, line: index + 1, text: line.trim() })
    })
  }
}

if (findings.length === 0) {
  console.log('anti-slop: nada encontrado.')
  process.exit(0)
}

for (const finding of findings) {
  console.error(`${finding.rel}:${finding.line}  [${finding.rule.id}]  ${finding.text.slice(0, 100)}`)
  console.error(`    ${finding.rule.why}`)
}
console.error(`\nanti-slop: ${findings.length} ocorrência(s).`)
process.exit(1)
