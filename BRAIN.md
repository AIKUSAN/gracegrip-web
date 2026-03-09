# GraceGrip Blueprint (BRAIN.md)

## Product
GraceGrip is a free, privacy-first Christian recovery support web app for users fighting porn and masturbation habits. It is grace-centered and also accessible to non-believers through practical emotional regulation and habit support.

## Status
Public Beta

## Mission
Deliver immediate support with Scripture and practical tools, without requiring accounts, subscriptions, or tracking.

## Core Features (Current Beta)
1. Panic Button (3-minute guided breathing/prayer and verse)
2. Clean Streak tracker (check-in/reset)
3. Daily Bread devotional rotation
4. Library of Truth by emotion
5. Saved verses
6. Selective backup export/import (choose which data fields to export)
7. QR code device transfer (share app state peer-to-peer, no internet required)
8. Anonymous feedback channel (Supabase, insert-only RLS, no accounts, offline-graceful)

## Non-Negotiables
1. No forced auth
2. No paid wall for core support
3. No personal-data selling/tracking
4. Grace-first language (no shame spiral UX)
5. Static-host compatible architecture (Vercel, custom domain `gracegrip.app`)

## Technical Foundation
- Next.js 16 (App Router, static export) + React 19
- Tailwind CSS v4 + custom CSS design tokens
- localStorage persistence (sensitive fields AES-encrypted via Web Crypto API)
- Deployed on Vercel (`gracegrip.app` + `www.gracegrip.app`); CI-only GitHub Actions workflow (lint + build, no Pages deploy)
- QR transfer stack: `qrcode` (canvas render) + `html5-qrcode` (scanner, dynamic import) + `fflate` (compression)

## Key Files
- `app/layout.jsx` — root layout, CSP meta, AppProvider, Toaster
- `app/globals.css` — all custom CSS, design tokens (backup + QR CSS included)
- `src/context/AppContext.jsx` — global state + all action handlers
- `src/utils/storage.js` — localStorage read/write + state mutations
- `src/components/pages/SettingsPage.jsx` — settings UI (backup + QR + feedback sections)
- `src/components/QRTransfer.jsx` — QR generate/scan component (Phase 2)
- `src/lib/supabase.js` — null-safe Supabase client (env-var-driven, Phase 3)
- `src/content/loaders.js` — content JSON loaders
- `.github/workflows/deploy.yml` — CI only (lint + build); Vercel auto-deploys from `main` (Supabase env secrets wired in both)
- `README.md`

## Patterns
- **Scanner callback stability**: `onQRImportRef` pattern — `useRef` stores the callback so the html5-qrcode scanner closure always calls the latest version without re-mounting
- **SSR-safe dynamic import**: `html5-qrcode` loaded only inside `useEffect` via `import('html5-qrcode')` to avoid server-side issues
- **Visibility toggle**: Feature elements hidden via CSS class (`qr-canvas--hidden`) not inline styles

## Quality Gates
- `npm run lint` passes (`eslint .` — `next lint` was dropped in Next.js 16)
- `npm run build` passes (9/9 static pages)
- Mobile and desktop UX validated
- Panic flow works reliably

## Deployment
- **Live URL**: https://gracegrip.app (Vercel, SSL active)
- **Aliases**: https://www.gracegrip.app, https://gracegrip-webapp.vercel.app
- **GitHub repo**: `AIKUSAN/gracegrip-web` (private, `main` branch)
- **Vercel project**: `gracegrip-webapp` (team: `aikusans-projects`)
- **Supabase**: project `gddjygjydwjjgdlcwbhh`; env vars in Vercel only (not in repo)
- **CI workflow**: `.github/workflows/deploy.yml` — triggers on push to `main`; runs `npm audit`, `npm run lint`, `npm run build`

## Commit History
| Commit | Description |
|--------|-------------|
| `d5987cd` | feat: initial production-ready commit |
| `f1f7a0e` | fix: add greeting useMemo to AppContext |
| `1e4be4d` | ci: replace GitHub Pages deploy with Vercel CI workflow |
| `9d1b34c` | fix: replace next lint with eslint and fix Date.now purity error |

## Disclaimer
GraceGrip is spiritual/peer support content and not professional mental health care. If in crisis, contact emergency services or local crisis hotlines.
