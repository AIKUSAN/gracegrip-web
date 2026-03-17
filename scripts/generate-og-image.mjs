/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
/**
 * generate-og-image.mjs
 *
 * Builds public/og-image.png from public/og-image.svg by:
 *   1. Reading the logo.svg mark and stripping its outer <svg> wrapper
 *   2. Injecting the mark centered at the top of the main card
 *      (translate(600,100) scale(0.08528) translate(-1408,-652.5))
 *      with a near-black color filter matching the website's logo rendering
 *   3. Rendering the combined SVG to a 1200×630 PNG via @resvg/resvg-js
 *
 * Run automatically as part of `npm run build` (see package.json).
 * Can also be run standalone: node scripts/generate-og-image.mjs
 *
 * Logo geometry notes:
 *   logo.svg viewBox = "939 140 938 1025"
 *   Source center    = (939 + 469, 140 + 512.5) = (1408, 652.5)
 *   Target size      = 80×87 px  (scale = 80/938 ≈ 0.08528)
 *   Target center    = (600, 100) — horizontally centered, upper main card
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
// Strip the outer <?xml?> declaration and <svg> wrapper tags
const logoInner = logoSvg
  .replace(/<\?xml[^>]*\?>\s*/s, '')
  .replace(/<svg[^>]*>\s*/s, '')
  .replace(/\s*<\/svg>\s*$/, '')

// ── Build the injected logo group ─────────────────────────────────────────────
// Scale: 80px target width / 938px source width = 0.08528
//
// Transform chain (applied right-to-left in SVG):
//   translate(-1408,-652.5)  → shift logo source-center to origin
//   scale(0.08528)           → shrink to 80×87 px
//   translate(600,100)       → position logo center at (600,100) in OG canvas
//
// feFlood+feComposite: fills the logo shape with near-black (#1d2b28) —
// matching how the logo appears on the website (dark mark on light card).
const logoScale = (80 / 938).toFixed(6)
const logoGroup = `
  <defs>
    <filter id="logo-color" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feFlood flood-color="#1d2b28" result="color"/>
      <feComposite in="color" in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>
  <g filter="url(#logo-color)" transform="translate(600,100) scale(${logoScale}) translate(-1408,-652.5)">
    ${logoInner}
  </g>
`

// ── Combine template + logo group ────────────────────────────────────────────
const combinedSvg = ogTemplate.replace('<!-- __LOGO_INJECT__ -->', logoGroup)

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
