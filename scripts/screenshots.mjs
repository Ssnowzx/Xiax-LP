#!/usr/bin/env node
/**
 * Captures the site for design review: desktop and phone, light and dark,
 * plus two instants of the hero so the load-in can be checked frame by frame.
 * Needs a running server (pnpm start) and Playwright's Chromium.
 *
 *   SHOTS_OUT=./screenshots node scripts/screenshots.mjs
 */
import { mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const BASE = process.env.SHOTS_BASE ?? 'http://localhost:3000'
const OUT = process.env.SHOTS_OUT ?? 'screenshots'
mkdirSync(OUT, { recursive: true })

const DESKTOP = { width: 1440, height: 900 }
const PHONE = { width: 390, height: 844 }
const TABLET = { width: 834, height: 1112 }

const browser = await chromium.launch()

async function capture(name, { viewport, colorScheme = 'light', route = '/', fullPage = true, settle = 1800, beforeShot, keepSplash = false }) {
  // Full-page captures cannot scroll, so scroll-driven motion would freeze at its
  // first frame; they emulate reduced motion and show the static site instead.
  const context = await browser.newContext({
    viewport,
    colorScheme,
    deviceScaleFactor: 1,
    locale: 'pt-BR',
    reducedMotion: fullPage ? 'reduce' : 'no-preference',
  })
  if (!keepSplash) await context.addInitScript(() => sessionStorage.setItem('xiax-seen', '1'))
  const page = await context.newPage()
  await page.goto(BASE + route, { waitUntil: 'networkidle' })
  if (beforeShot) await beforeShot(page)
  await page.waitForTimeout(settle)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage })
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const overflow = scrollWidth > viewport.width ? `  OVERFLOW ${scrollWidth}px > ${viewport.width}px` : ''
  await context.close()
  console.log(`${OUT}/${name}.png${overflow}`)
}

await capture('home-desktop-light', { viewport: DESKTOP })
await capture('home-desktop-dark', { viewport: DESKTOP, colorScheme: 'dark' })
await capture('home-phone-light', { viewport: PHONE })
await capture('home-phone-dark', { viewport: PHONE, colorScheme: 'dark' })
await capture('home-tablet-light', { viewport: TABLET })
await capture('portfolio-desktop-light', { viewport: DESKTOP, route: '/portfolio' })
await capture('contato-desktop-dark', { viewport: DESKTOP, route: '/contato', colorScheme: 'dark' })
await capture('contato-phone-light', { viewport: PHONE, route: '/contato' })
await capture('privacidade-desktop-light', { viewport: DESKTOP, route: '/privacidade' })
await capture('splash-t400', { viewport: DESKTOP, fullPage: false, settle: 400, keepSplash: true })
await capture('hero-t150', { viewport: DESKTOP, fullPage: false, settle: 150 })
await capture('hero-t700', { viewport: DESKTOP, fullPage: false, settle: 700 })
await capture('contato-validation', {
  viewport: DESKTOP,
  route: '/contato',
  settle: 800,
  beforeShot: async (page) => {
    await page.getByLabel('Nome').fill('A')
    await page.getByLabel('E-mail').fill('errado')
    await page.getByLabel('Empresa').fill('Xi')
    await page.getByLabel('O que trava hoje').fill('curto')
    await page.getByRole('button', { name: 'Enviar mensagem' }).click()
    await page.waitForTimeout(1200)
  },
})

// The travelling core: viewport frames along the page, one caught mid-flight,
// and one with the pointer over the hero (grid, blueprint, satellites leaning).
async function journey() {
  const context = await browser.newContext({ viewport: DESKTOP, colorScheme: 'light', deviceScaleFactor: 1, locale: 'pt-BR' })
  await context.addInitScript(() => sessionStorage.setItem('xiax-seen', '1'))
  const page = await context.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2200)
  await page.screenshot({ path: `${OUT}/journey-0-docked.png` })
  await page.mouse.move(1100, 620)
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/journey-1-hover.png` })
  await page.mouse.move(-10, -10)
  const stops = [
    { y: 2200, wait: 260, name: 'midflight-to-method' },
    { y: 2200, wait: 900, name: 'method-docked' },
    { y: 3100, wait: 300, name: 'midflight-to-fronts' },
    { y: 3100, wait: 1000, name: 'fronts-docked' },
    { y: 4000, wait: 260, name: 'midflight-to-portfolio' },
    { y: 4300, wait: 900, name: 'portfolio-docked' },
    { y: 6300, wait: 900, name: 'engine-docked' },
    { y: 7100, wait: 900, name: 'contact-docked' },
    { y: 900, wait: 1600, name: 'service-assembled' },
  ]
  for (const [index, stop] of stops.entries()) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), stop.y)
    await page.waitForTimeout(stop.wait)
    await page.screenshot({ path: `${OUT}/journey-${index + 2}-${stop.name}.png` })
  }
  // The grid under the pointer in the sections at the end of the page.
  for (const [name, selector] of [['engine', '#motor-secao'], ['contact', '#contato']]) {
    const section = page.locator(selector).first()
    if (!(await section.count())) continue
    await section.scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    const box = await section.boundingBox()
    if (!box) continue
    await page.mouse.move(box.x + box.width * 0.55, Math.min(box.y + box.height * 0.5, 700))
    await page.waitForTimeout(450)
    await page.screenshot({ path: `${OUT}/journey-10-${name}-hover.png` })
  }
  // The simulated system: the core at work, then a person taking over.
  const demo = page.locator('.demo').first()
  if (await demo.count()) {
    await demo.scrollIntoViewIfNeeded()
    await page.waitForTimeout(4200)
    await page.screenshot({ path: `${OUT}/journey-11-demo-autoplay.png` })
    await page.waitForTimeout(6000)
    await page.screenshot({ path: `${OUT}/journey-12-demo-later.png` })
    await page.getByRole('button', { name: /^Indicadores/ }).click()
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${OUT}/journey-13-demo-manual.png` })
  }
  const flagged = await page.evaluate(() => document.documentElement.classList.contains('core-travels'))
  console.log(`journey: core-travels=${flagged}`)
  await context.close()
}
await journey()

await browser.close()
