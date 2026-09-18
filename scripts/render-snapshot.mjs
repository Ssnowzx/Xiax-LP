#!/usr/bin/env node
/**
 * Renders an anonymised snapshot (from snapshot-chrome-tab.applescript) in
 * Chromium at 2x and proves the substitution: every name-like or long-number
 * token of the original text must be absent from the render. Publish only at
 * zero leaks; the remaining tokens are checked by eye and must be UI labels.
 *
 *   node scripts/render-snapshot.mjs page.html page.png [width] [height]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const [input, out, width = '1600', height = '1000'] = process.argv.slice(2)
if (!input || !out) {
  console.error('uso: node scripts/render-snapshot.mjs <snapshot.html> <saida.png> [largura] [altura]')
  process.exit(1)
}
const raw = readFileSync(input, 'utf8')
const [html, original = ''] = raw.split('\n<!--ORIGINAL-INNERTEXT-->\n')

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: Number(width), height: Number(height) }, deviceScaleFactor: 2, locale: 'pt-BR' })
const page = await context.newPage()
await page.setContent(html, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(600)
await page.screenshot({ path: out })
const rendered = await page.evaluate(() => document.body.innerText)
await browser.close()

const CAP = '[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç]+'
const NAME = new RegExp(`\\b${CAP}(?:[ \\t]+(?:de|da|do|dos|das|e|${CAP}))+\\b`, 'g')
const UPPER = /\b[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]{3,}(?:[ \t]+(?:DE|DA|DO|DOS|DAS|E|[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]{3,}))+\b/g
const NUMBER = /\b\d{8,11}\b|\b\d{4} \d{4} \d{6} \d{2} \d\b/g
const tokens = new Set([...(original.match(NAME) ?? []), ...(original.match(UPPER) ?? []), ...(original.match(NUMBER) ?? [])])
const leaks = [...tokens].filter((token) => rendered.includes(token))
writeFileSync(out.replace(/\.png$/, '.leaks.json'), JSON.stringify(leaks, null, 1))
console.log(`${out}: ${leaks.length} token(s) do texto original ainda visíveis`)
if (leaks.length) console.log(leaks.join(' | '))
