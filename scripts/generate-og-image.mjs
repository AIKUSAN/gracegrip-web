/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
/**
 * generate-og-image.mjs
 *
 * Builds public/og-image.png from public/og-image.svg by:
 *   1. Reading the logo.svg mark and stripping its outer <svg> wrapper
 *   2. Injecting the mark (with a brand-teal color filter + scale transform)
 *      into the og-image.svg template
 *   3. Rendering the combined SVG to a 1200×630 PNG via @resvg/resvg-js
 *
 * Run automatically as part of `npm run build` (see package.json).
 * Can also be run standalone: node scripts/generate-og-image.mjs
 */

import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// ── Read source files ────────────────────────────────────────────────────────
const logoSvg = readFileSync(resolve(root, 'public/logo.svg'), 'utf-8')
const ogTemplate = readFileSync(resolve(root, 'public/og-image.svg'), 'utf-8')

// ── Extract inner path content from logo.svg ─────────────────────────────────
// logo.svg viewBox="939 140 938 1025" — strip outer XML declaration and <svg> tags
const logoInner = logoSvg
  .replace(/<\?xml[^>]*\?>\s*/s, '')
  .replace(/<svg[^>]*>\s*/s, '')
  .replace(/\s*<\/svg>\s*$/, '')

// ── Build the injected logo group ─────────────────────────────────────────────
// Scale: 140px target width / 938px source width = 0.14925
// Transform chain (applied right-to-left in SVG):
//   translate(-939,-140)  → shift logo origin to (0,0)
//   scale(0.14925)        → shrink to 140×153 px
//   translate(60,35)      → position top-left at (60, 35) in the OG card
//
// feFlood+feComposite filter: fills the logo shape with brand teal (#305f4f),
// overriding all explicit fill attributes on individual paths.
const logoGroup = `
  <defs>
    <filter id="brand-color" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feFlood flood-color="#305f4f" result="color"/>
      <feComposite in="color" in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>
  <g filter="url(#brand-color)" transform="translate(60,35) scale(0.14925) translate(-939,-140)">
    ${logoInner}
  </g>
`

// ── Combine template + logo group ────────────────────────────────────────────
const combinedSvg = ogTemplate.replace(
  '<!-- ═══════════════════════════════════════════════════\n       Logo mark injected here by scripts/generate-og-image.mjs\n       at transform="translate(60,35) scale(0.14925) translate(-939,-140)"\n       with feFlood+feComposite filter to recolor to brand teal #305f4f\n       ═══════════════════════════════════════════════════ -->',
  logoGroup,
)

// ── Render SVG → PNG ─────────────────────────────────────────────────────────
const resvg = new Resvg(combinedSvg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
})

const pngData = resvg.render()
const pngBuffer = pngData.asPng()

writeFileSync(resolve(root, 'public/og-image.png'), pngBuffer)
// eslint-disable-next-line no-console
console.log('✓ og-image.png generated (1200×630)')
