#!/usr/bin/env node
/**
 * Captures a live page for the portfolio: full page plus the position of
 * every large image on it, so a real screen can be cropped, never mocked.
 *
 *   node scripts/capture-url.mjs https://xclinicas.xiax.com.br ./tmp/xclinicas
 */
import { mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const [url, out] = process.argv.slice(2)
if (!url || !out) {
  console.error('uso: node scripts/capture-url.mjs <url> <pasta-de-saida>')
  process.exit(1)
}
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'pt-BR', colorScheme: 'light' })
const page = await context.newPage()
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(2500)
await page.screenshot({ path: `${out}/full.png`, fullPage: true })
console.log('altura total', await page.evaluate(() => document.documentElement.scrollHeight))

const media = await page.evaluate(() =>
  Array.from(document.querySelectorAll('img, picture, video, canvas, figure'))
    .map((el) => {
      const r = el.getBoundingClientRect()
      return { tag: el.tagName, x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), alt: (el.getAttribute('alt') ?? '').slice(0, 60) }
    })
    .filter((m) => m.w > 400 && m.h > 200),
)
console.log(JSON.stringify(media, null, 1))
await browser.close()
