# Deployment Rules — GraceGrip WebApp

## Build Configuration

| Setting | Value | File |
|---------|-------|------|
| `output` | `'export'` | `next.config.mjs` |
| `distDir` | `'dist'` | `next.config.mjs` |
| `reactStrictMode` | `true` | `next.config.mjs` |

Build command: `npm run build` → generates fully static files in `dist/`.
No server runtime — the entire app is static HTML/CSS/JS.

## Deploy Target

**GitHub Pages** via `.github/workflows/deploy.yml`.
- Triggers on push to `main`.
- Uploads `./dist` as the Pages artifact.
- Live URL pattern: `https://<username>.github.io/GraceGrip-WebApp/`

## Pre-Deploy Quality Gates

All must pass before any push to `main`:

```bash
npm run lint              # ESLint — zero warnings
npm run build             # Static export succeeds, all routes generate
npm run validate:content  # JSON schema check for content/*.json
npm audit                 # No high/critical vulnerabilities
```

## Manual Verification Checklist

Before merging any significant change, manually verify:
- [ ] Panic flow (emergency page → urge timer → breathing → grounding → panic verse)
- [ ] Streak check-in and reset
- [ ] Backup export and import (settings page)
- [ ] Mobile layout (responsive, no overflow)
- [ ] Dark mode toggle (light → dark → system)
- [ ] Welcome screen gate (first visit)

## CSP Migration Note

The CSP is currently enforced via `<meta httpEquiv>` in `app/layout.jsx` because GitHub Pages does not support custom HTTP headers.

If deploying to a server host (Vercel, Netlify, Cloudflare Pages):
1. Move the CSP to `next.config.mjs` `headers()` for stronger enforcement.
2. Remove the `<meta>` tag from `app/layout.jsx`.
3. The layout file contains a comment documenting this explicitly.

## Custom Domain

- Domain `gracegrip.app` is planned but not yet active.
- When ready: create `public/CNAME` with the domain value and configure DNS.
- Update `basePath` in `next.config.mjs` if switching from subpath to root domain.

## Package Lock

- `package-lock.json` pins exact dependency versions.
- Always use `npm ci` (not `npm install`) in CI workflows to ensure reproducible builds.
- Run `npm audit` before deploying to catch known vulnerabilities.
