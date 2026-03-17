/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
/**
 * app/api/og/route.js
 *
 * Next.js Serverless Route Handler — screenshots the live GraceGrip homepage.
 * Served at https://gracegrip.app/api/og (1200×630 PNG).
 *
 * Primary path  — Puppeteer + @sparticuz/chromium:
 *   Opens https://gracegrip.app in headless Chrome, takes a 1200×630
 *   screenshot, and returns it. The OG image IS the real homepage —
 *   zero maintenance, auto-updates with every design change.
 *
 * Fallback path — next/og logo-only card:
 *   If Chrome fails for any reason (cold start timeout, network blip),
 *   renders a clean branded card in-process using next/og (Satori).
 *   Short cache TTL (5 min) so crawlers retry the screenshot path soon.
 *
 * Performance (primary path):
 *   • First request after deploy  → ~5–10s (Chrome cold start + render)
 *   • All subsequent requests     → ~50ms  (Vercel CDN cache, 24h TTL)
 *   • stale-while-revalidate      → stale image served instantly while
 *                                   a fresh screenshot generates in background
 */

import chromium from '@sparticuz/chromium'
import { ImageResponse } from 'next/og'
import puppeteer from 'puppeteer-core'

// Must be Node.js serverless — Chrome cannot run in the V8-only edge runtime
export const runtime = 'nodejs'

// Allow up to 30s for Chrome cold start + page render + screenshot
export const maxDuration = 30

// Brand tokens (mirrors app/globals.css) — used by the fallback card only
const BRAND = '#305f4f'
const INK = '#1d2b28'
const CREAM = '#f6f1e9'
const AMBER = '#eadcc8'

/**
 * Fallback card rendered via next/og (Satori, in-process).
 * Shown when the Puppeteer screenshot fails for any reason.
 * Logo mark + wordmark + tagline on the brand gradient — zero external deps.
 * Cached for only 5 min so crawlers retry the screenshot path soon.
 */
function renderFallbackCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(140deg, ${CREAM} 0%, #fff8ed 40%, ${AMBER} 100%)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 20,
            padding: '60px 100px',
            boxShadow: '0 4px 40px rgba(29,43,40,0.08)',
          }}
        >
          <img
            src="https://gracegrip.app/favicons/favicon-192x192.png"
            width={120}
            height={120}
            style={{ objectFit: 'contain', marginBottom: 24 }}
          />
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 72,
              fontWeight: 700,
              color: INK,
              letterSpacing: 6,
              lineHeight: 1,
              display: 'flex',
            }}
          >
            GRACEGRIP
          </div>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 22,
              fontStyle: 'italic',
              color: BRAND,
              marginTop: 18,
              display: 'flex',
            }}
          >
            A private, grace-first companion for the hard days.
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}

export async function GET() {
  let browser = null

  try {
    // ── Primary path: real homepage screenshot ──────────────────────────────
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
        // CDN: fresh for 24h, serve stale while regenerating in background
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    })
  } catch {
    // ── Fallback path: branded card with logo + wordmark ────────────────────
    // Chrome failed — return a valid branded PNG so crawlers never see a broken
    // image. Short TTL (5 min) ensures the screenshot path is retried soon.
    const fallback = renderFallbackCard()
    fallback.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60')
    return fallback
  } finally {
    // Always close Chrome — prevents leaked processes regardless of outcome
    if (browser) await browser.close()
  }
}
