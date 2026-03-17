/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
/**
 * app/api/og/route.js
 *
 * Next.js Serverless Route Handler — screenshots the live GraceGrip homepage.
 * Served at https://gracegrip.app/api/og (1200×630 PNG).
 *
 * Uses @sparticuz/chromium + puppeteer-core to take a real screenshot of
 * https://gracegrip.app at a 1200×630 viewport — no custom JSX card, no
 * manual sync needed. The OG image IS the homepage.
 *
 * Performance:
 *   • First request after deploy  → ~5–10s (Chrome cold start + render)
 *   • All subsequent requests     → ~50ms  (Vercel CDN cache, 24h TTL)
 *   • stale-while-revalidate      → old image served instantly while
 *                                   a fresh screenshot is taken in background
 *
 * When the homepage design changes, the OG image updates automatically
 * within 24 hours of the next deploy — no code changes needed here.
 */

import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

// Must be Node.js serverless — Chrome cannot run in the V8-only edge runtime
export const runtime = 'nodejs'

// Allow up to 30s for Chrome cold start + page render + screenshot
export const maxDuration = 30

export async function GET() {
  let browser = null

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 1 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })

    const page = await browser.newPage()

    // Pre-seed localStorage so the onboarding gate is bypassed and the real
    // homepage renders (not the first-time welcome screen)
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('gracegrip_v1', JSON.stringify({ onboardingComplete: true }))
    })

    await page.goto('https://gracegrip.app', {
      waitUntil: 'networkidle2',
      timeout: 20000,
    })

    // Capture exactly the 1200×630 viewport — standard OG image dimensions
    const screenshot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    })

    return new Response(screenshot, {
      headers: {
        'Content-Type': 'image/png',
        // Vercel CDN: fresh for 24h, then serve stale while regenerating in background
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    })
  } catch {
    // Return 500 so social crawlers retry on the next scrape rather than
    // caching a broken image
    return new Response('OG screenshot unavailable', { status: 500 })
  } finally {
    if (browser) await browser.close()
  }
}
