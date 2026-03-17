/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
/**
 * app/api/og/route.js
 *
 * Next.js Serverless Route Handler — screenshots the live GraceGrip homepage.
 * Served at https://gracegrip.app/api/og (1200×630 PNG).
 *
 * Supports ?theme=dark for a dark-mode screenshot + dark fallback card.
 * The og:image in layout.jsx points to /api/og (light, default for social).
 *
 * Primary path  — Puppeteer + @sparticuz/chromium:
 *   Opens https://gracegrip.app in headless Chrome, takes a 1200×630
 *   screenshot. Dark theme: injects the .dark class before render so the
 *   real homepage dark mode is captured.
 *
 * Fallback path — next/og branded card (logo + wordmark + tagline):
 *   If Chrome fails for any reason, renders a clean branded card in-process.
 *   Light fallback: cream/amber gradient, dark ink.
 *   Dark fallback:  deep teal gradient, cream ink, inverted logo.
 *   Short cache TTL (5 min) so crawlers retry the screenshot path soon.
 *
 * Performance (primary path):
 *   • First request after deploy  → ~5–10s (Chrome cold start + render)
 *   • All subsequent requests     → ~50ms  (Vercel CDN cache, 24h TTL)
 *   • Each theme variant cached independently on Vercel's CDN
 */

import chromium from '@sparticuz/chromium'
import { ImageResponse } from 'next/og'
import puppeteer from 'puppeteer-core'

// Must be Node.js serverless — Chrome cannot run in the V8-only edge runtime
export const runtime = 'nodejs'

// Allow up to 30s for Chrome cold start + page render + screenshot
export const maxDuration = 30

// ── Light theme tokens (mirrors app/globals.css) ─────────────────────────────
const LIGHT = {
  outerBg: 'linear-gradient(140deg, #f6f1e9 0%, #fff8ed 40%, #eadcc8 100%)',
  cardBg: 'rgba(255,255,255,0.92)',
  cardShadow: '0 4px 40px rgba(29,43,40,0.08)',
  wordmark: '#1d2b28',
  tagline: '#305f4f',
  logoFilter: 'none',
}

// ── Dark theme tokens (mirrors .dark overrides in app/globals.css) ────────────
const DARK = {
  outerBg: 'linear-gradient(140deg, #0f1c19 0%, #152420 40%, #1a2e28 100%)',
  cardBg: 'rgba(255,255,255,0.07)',
  cardShadow: '0 4px 40px rgba(0,0,0,0.4)',
  wordmark: '#eef4f8',
  tagline: '#6db89e',
  // Invert the dark logo PNG so it reads as light on a dark background
  logoFilter: 'invert(1) hue-rotate(180deg)',
}

/**
 * Fallback card rendered via next/og (Satori, in-process).
 * Shown when Puppeteer fails. Supports both light and dark themes.
 * Uses Georgia (system font) — no external fetch, cannot crash.
 */
function renderFallbackCard(dark = false) {
  const t = dark ? DARK : LIGHT

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: t.outerBg,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: t.cardBg,
            borderRadius: 20,
            padding: '60px 100px',
            boxShadow: t.cardShadow,
          }}
        >
          <img
            src="https://gracegrip.app/favicons/favicon-192x192.png"
            width={120}
            height={120}
            style={{ objectFit: 'contain', marginBottom: 24, filter: t.logoFilter }}
          />
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 72,
              fontWeight: 700,
              color: t.wordmark,
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
              color: t.tagline,
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

export async function GET(request) {
  const dark = new URL(request.url).searchParams.get('theme') === 'dark'
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

    // Pre-seed localStorage: bypass onboarding gate + apply requested theme.
    // evaluateOnNewDocument runs before page scripts so the app boots with
    // the correct theme class already on <html> — no flash of wrong theme.
    await page.evaluateOnNewDocument((isDark) => {
      localStorage.setItem(
        'gracegrip_v1',
        JSON.stringify({
          onboardingComplete: true,
          ...(isDark && { themePreference: 'dark' }),
        }),
      )
      if (isDark) document.documentElement.classList.add('dark')
    }, dark)

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
        // Each theme variant is cached independently on Vercel's CDN
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    })
  } catch {
    // ── Fallback path: themed branded card ──────────────────────────────────
    // Chrome failed — serve a valid PNG so crawlers never see a broken image.
    // Short TTL (5 min) ensures the screenshot path is retried soon.
    const fallback = renderFallbackCard(dark)
    fallback.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60')
    return fallback
  } finally {
    // Always close Chrome — prevents leaked processes regardless of outcome
    if (browser) await browser.close()
  }
}
