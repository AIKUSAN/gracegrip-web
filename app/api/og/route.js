/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
/**
 * app/api/og/route.js
 *
 * Next.js Edge Route Handler — renders the GraceGrip OG card at request time.
 * Served at https://gracegrip.app/api/og (1200×630 PNG).
 *
 * Design mirrors the homepage welcome screen at 1200×630 viewport:
 *   • Libre Baskerville served from /public/fonts/ (TTF — Satori cannot parse wOFF2)
 *   • Large logo mark, bold GRACEGRIP wordmark, tagline, headline, body, CTA
 *   • Feature cards peeking at the bottom — matching the real homepage layout
 *
 * When the site's copy, headline, or brand colors change, update this file
 * once — the OG image refreshes on every request automatically.
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Brand tokens (mirrors app/globals.css)
const BRAND = '#305f4f'
const INK = '#1d2b28'
const CREAM = '#f6f1e9'
const AMBER = '#eadcc8'

/**
 * Fetches a Libre Baskerville TTF binary from our own origin (/public/fonts/).
 * Self-hosted TTF is required — Satori (next/og) only parses raw TrueType/OpenType.
 * wOFF2 from Google Fonts CDN causes "Unsupported OpenType signature wOF2" errors.
 * Returns null on any failure — caller falls back to Georgia.
 */
async function loadLibreBaskerville(weight) {
  try {
    return fetch(`https://gracegrip.app/fonts/libre-baskerville-${weight}.ttf`, {
      signal: AbortSignal.timeout(5000),
    }).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

export async function GET() {
  // Load Libre Baskerville Bold + Regular in parallel from our own CDN
  // Falls back gracefully to Georgia if the fetch fails
  const [fontBold, fontRegular] = await Promise.all([
    loadLibreBaskerville(700),
    loadLibreBaskerville(400),
  ])

  const fonts = []
  if (fontBold)
    fonts.push({ name: 'Libre Baskerville', data: fontBold, weight: 700, style: 'normal' })
  if (fontRegular)
    fonts.push({ name: 'Libre Baskerville', data: fontRegular, weight: 400, style: 'normal' })

  // Use loaded font if available, otherwise fall back to Georgia
  const SERIF = 'Libre Baskerville, Georgia, serif'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          // Matches body: linear-gradient(140deg, #f6f1e9, #fff8ed 40%, #eadcc8)
          background: `linear-gradient(140deg, ${CREAM} 0%, #fff8ed 40%, ${AMBER} 100%)`,
          position: 'relative',
        }}
      >
        {/* ── Main card — mirrors the homepage welcome card ─────────
            Positioned to match the 1200×630 homepage viewport:
            the card fills most of the frame, feature cards peek below */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 22,
            width: 1100,
            height: 535,
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 40px rgba(29,43,40,0.08)',
          }}
        >
          {/* Logo mark — large, matching homepage proportions */}
          <img
            src="https://gracegrip.app/favicons/favicon-192x192.png"
            width={100}
            height={100}
            style={{ objectFit: 'contain', marginBottom: 14 }}
          />

          {/* GRACEGRIP wordmark */}
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 76,
              fontWeight: 700,
              color: INK,
              letterSpacing: 6,
              lineHeight: 1,
              display: 'flex',
            }}
          >
            GRACEGRIP
          </div>

          {/* Tagline — italic, teal, matches homepage */}
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 18,
              fontWeight: 400,
              fontStyle: 'italic',
              color: BRAND,
              marginTop: 10,
              display: 'flex',
            }}
          >
            A private, grace-first companion for the hard days.
          </div>

          {/* Headline */}
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 50,
              fontWeight: 700,
              color: INK,
              textAlign: 'center',
              marginTop: 22,
              lineHeight: 1.2,
              display: 'flex',
            }}
          >
            You don't have to fight alone
          </div>

          {/* Description — matches homepage body copy */}
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: 15,
              color: '#4a5e5a',
              textAlign: 'center',
              marginTop: 16,
              lineHeight: 1.55,
              maxWidth: 720,
              display: 'flex',
            }}
          >
            GraceGrip helps men and women break free through the power of Christ,
            Scripture, and grace-filled accountability tools. No shame. No judgment.
            Just freedom.
          </div>

          {/* CTA Button */}
          <div
            style={{
              display: 'flex',
              background: BRAND,
              borderRadius: 28,
              padding: '15px 52px',
              color: '#ffffff',
              fontFamily: 'Arial, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              marginTop: 26,
              letterSpacing: 0.3,
            }}
          >
            Begin Your Journey
          </div>
        </div>

        {/* ── Feature cards — peeking at the bottom of the frame ───
            Matches how the homepage shows them at 630px height: only
            the titles are visible, cards cut off by the viewport edge */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 572,
            width: 1100,
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
          }}
        >
          {/* Privacy-First */}
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.88)',
              borderRadius: '14px 14px 0 0',
              padding: '16px 20px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 -2px 16px rgba(29,43,40,0.05)',
            }}
          >
            <div
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: 15,
                fontWeight: 600,
                color: BRAND,
                display: 'flex',
              }}
            >
              Privacy-First
            </div>
          </div>

          {/* Scripture-Powered */}
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.88)',
              borderRadius: '14px 14px 0 0',
              padding: '16px 20px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 -2px 16px rgba(29,43,40,0.05)',
            }}
          >
            <div
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: 15,
                fontWeight: 600,
                color: BRAND,
                display: 'flex',
              }}
            >
              Scripture-Powered
            </div>
          </div>

          {/* Practical Tools */}
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.88)',
              borderRadius: '14px 14px 0 0',
              padding: '16px 20px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 -2px 16px rgba(29,43,40,0.05)',
            }}
          >
            <div
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: 15,
                fontWeight: 600,
                color: BRAND,
                display: 'flex',
              }}
            >
              Practical Tools
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    },
  )
}
