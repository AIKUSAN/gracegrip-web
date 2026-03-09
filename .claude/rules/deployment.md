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

**Vercel** — auto-deploys from `main` branch.
- CI workflow (`.github/workflows/deploy.yml`) runs lint + build gate on every push/PR.
- Vercel picks up the push and deploys the static export.
- Live URL: `https://gracegrip.app`
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'` CSP) are injected by `vercel.json`.

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

## CSP Note

The full CSP is enforced via `<meta httpEquiv>` in `app/layout.jsx`. This covers all resource loading directives.

`frame-ancestors 'none'` is additionally injected as an HTTP header by `vercel.json` (meta CSP cannot enforce `frame-ancestors` per W3C spec — browsers ignore it there).

Do NOT duplicate the full CSP in `vercel.json` headers — having two CSP policies (HTTP header + meta) causes both to apply simultaneously, which can unexpectedly block legitimate resources.

## Custom Domain

- Live at `https://gracegrip.app` (Vercel custom domain).
- DNS is configured and SSL is active.
- No `basePath` needed — app serves at the root.

## Package Lock

- `package-lock.json` pins exact dependency versions.
- Always use `npm ci` (not `npm install`) in CI workflows to ensure reproducible builds.
- Run `npm audit` before deploying to catch known vulnerabilities.
