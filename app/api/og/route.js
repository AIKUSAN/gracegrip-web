/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
/**
 * app/api/og/route.js
 *
 * Next.js Edge Route Handler — renders the GraceGrip OG card at request time.
 * Served at https://gracegrip.app/api/og (1200×630 PNG).
 *
 * Uses next/og (Satori under the hood) to convert React JSX → PNG on each request.
 * No static file to maintain — always reflects the current brand design.
 *
 * Satori constraints (applies to all JSX inside ImageResponse):
 *   - All styles must be inline with absolute values (no CSS variables or Tailwind)
 *   - Every container with children needs display: 'flex'
 *   - <img> tags require absolute URLs (this runs server-side, not in the browser)
 */

import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Brand tokens (mirrors app/globals.css CSS variables)
const BRAND = '#305f4f'
const INK = '#1d2b28'
const CREAM = '#f6f1e9'
const AMBER = '#eadcc8'
const CARD_SHADOW = '0 6px 36px rgba(29,43,40,0.09)'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          // Mirrors body background: linear-gradient(140deg, #f6f1e9, #fff8ed 40%, #eadcc8)
          background: `linear-gradient(140deg, ${CREAM} 0%, #fff8ed 40%, ${AMBER} 100%)`,
          position: 'relative',
        }}
      >
        {/* ── Main card ─────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 28,
            width: 1000,
            height: 382,
            background: 'rgba(255,255,255,0.88)',
            borderRadius: 18,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: CARD_SHADOW,
          }}
        >
          {/* Logo mark — favicon PNG served from same origin */}
          <img
            src="https://gracegrip.app/favicons/favicon-192x192.png"
            width={64}
            height={64}
            style={{ objectFit: 'contain', marginBottom: 8 }}
          />

          {/* Wordmark */}
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 64,
              fontWeight: 700,
              color: INK,
              letterSpacing: 8,
              lineHeight: 1.1,
              display: 'flex',
            }}
          >
            GRACEGRIP
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: 17,
              color: BRAND,
              marginTop: 6,
              display: 'flex',
            }}
          >
            A private, grace-first companion for the hard days.
          </div>

          {/* Divider */}
          <div
            style={{
              width: 136,
              height: 2,
              background: 'rgba(48,95,79,0.2)',
              borderRadius: 1,
              margin: '16px 0',
              display: 'flex',
            }}
          />

          {/* Headline */}
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 38,
              fontWeight: 700,
              color: INK,
              textAlign: 'center',
              display: 'flex',
            }}
          >
            You don't have to fight alone
          </div>

          {/* CTA Button */}
          <div
            style={{
              display: 'flex',
              background: BRAND,
              borderRadius: 26,
              padding: '14px 48px',
              color: '#ffffff',
              fontFamily: 'Arial, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              marginTop: 18,
            }}
          >
            Begin Your Journey
          </div>
        </div>

        {/* ── Feature cards row ─────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 432,
            width: 1020,
            height: 170,
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
          }}
        >
          {/* Card 1 — Privacy-First */}
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.88)',
              borderRadius: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 20px',
              boxShadow: CARD_SHADOW,
            }}
          >
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 17, fontWeight: 600, color: BRAND, display: 'flex' }}>
              Privacy-First
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: BRAND, opacity: 0.65, marginTop: 6, display: 'flex' }}>
              Your data stays on this device.
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: BRAND, opacity: 0.65, marginTop: 2, display: 'flex' }}>
              No account, no tracking.
            </div>
          </div>

          {/* Card 2 — Scripture-Powered */}
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.88)',
              borderRadius: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 20px',
              boxShadow: CARD_SHADOW,
            }}
          >
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 17, fontWeight: 600, color: BRAND, display: 'flex' }}>
              Scripture-Powered
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: BRAND, opacity: 0.65, marginTop: 6, display: 'flex' }}>
              Verses and devotionals to
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: BRAND, opacity: 0.65, marginTop: 2, display: 'flex' }}>
              steady your thoughts.
            </div>
          </div>

          {/* Card 3 — Practical Tools */}
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.88)',
              borderRadius: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 20px',
              boxShadow: CARD_SHADOW,
            }}
          >
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 17, fontWeight: 600, color: BRAND, display: 'flex' }}>
              Practical Tools
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: BRAND, opacity: 0.65, marginTop: 6, display: 'flex' }}>
              Breathing, grounding and
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: BRAND, opacity: 0.65, marginTop: 2, display: 'flex' }}>
              emergency actions.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
