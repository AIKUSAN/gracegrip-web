# GraceGrip WebApp — CLAUDE.md

> **The Rules of the House** — Read this first. Always.

This app serves people in vulnerable moments — many fighting addiction, shame, or crisis.
Every line of code is a pastoral act. Write with care.

## Mission

GraceGrip is a **privacy-focused, grace-first recovery web app**.  
All data stays on-device. No accounts, no tracking, no cloud sync.

---

## Development Workflow & Quality Gates

- **Branching:** Never work directly on `main`. Always create a feature branch (e.g., `feat/ui-update`).
- **Pre-Push Checklist:** Before proposing a merge to `main`, Claude must:
    1. Run `npm run build` to ensure no breaks.
    2. Provide a 'Visual Impact Summary' of UI changes.
    3. Verify that the 'Grace-First' color palette (Sage/Cream) is maintained.
- **IKE's Approval:** Claude is authorized to `git commit`, but **strictly forbidden** from running `git push`. Only the user (IKE) will execute the final push after a manual review of the Vercel Preview URL.

---

## Commands

```bash
npm run dev              # Next.js dev server (hot reload)
npm run build            # Static export → dist/
npm run lint             # ESLint — must pass before commit
npm run validate:content # JSON schema check — run after any content/ edit
```

---

## Architecture

**Next.js 16 App Router** with static export (`output: 'export'`, `distDir: 'dist'`).  
No server — the entire app deploys as static files to Vercel.

- **Routing**: File-based via `app/` directory. 6 routes (see table below).
- **State**: Single global React Context (`src/context/AppContext.jsx`) via `AppProvider` + `useApp()` hook. No Redux/Zustand.
- **Storage**: localStorage under key `gracegrip_v1`. Sensitive fields (`journalEntries`, `profileName`, `streakHistory`) encrypted with AES via Web Crypto API (`src/utils/crypto.js`).
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`. CSS variables in `app/globals.css`. Dark mode via `.dark` class on `<html>`.
- **Fonts**: Libre Baskerville (serif) + Manrope (sans) via `next/font/google` — self-hosted at build time, no runtime CDN.

---

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.jsx` | Root layout — fonts, metadata, CSP meta tag, Toaster (sonner), AppProvider |
| `app/page.jsx` | Home route — renders `HomePage` component |
| `app/*/page.jsx` | Route pages (emergency, scripture, devotional, journal, settings) |
| `src/components/AppShell.jsx` | App chrome — navigation, welcome gate, panic modal |
| `src/components/AppNavigation.jsx` | Bottom navigation bar |
| `src/components/pages/*.jsx` | Page-level components (HomePage, EmergencyPage, etc.) |
| `src/components/ui/*.jsx` | Reusable UI primitives (button, DynamicLogo, text-effect, animated-group) |
| `src/context/AppContext.jsx` | Global state provider — all app state + daily content memos |
| `src/utils/storage.js` | localStorage read/write helpers |
| `src/utils/crypto.js` | AES encrypt/decrypt via Web Crypto API |
| `src/content/loaders.js` | Imports and validates content JSON |
| `src/lib/utils.js` | `cn()` class merge helper (clsx + tailwind-merge) |
| `src/lib/verseArt.js` | Maps verse categories to SVG art in `public/verse-art/` |
| `src/lib/supabase.js` | Null-safe Supabase client — only initializes when env vars are set |
| `content/verses.json` | Verse library (text, reference, emotions[], panic flag) |
| `content/devotionals.json` | Daily devotionals (id, title, body, practice) |
| `content/emotions.json` | Emotion categories (id, label, prompt) |
| `scripts/validate-content.mjs` | Schema validator for content/*.json |
| `next.config.mjs` | Static export config, distDir, reactStrictMode |
| `components.json` | shadcn/ui config (style: maia, JSX, Tabler icons) |
| `.github/workflows/main.yml` | CI — lint + validate:content + build gate on every push/PR |

---

## Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.jsx` | Home — streak ring, greeting, daily verse |
| `/emergency` | `app/emergency/page.jsx` | Urge timer, breathing, grounding, panic verse |
| `/scripture` | `app/scripture/page.jsx` | Category-based verse browser |
| `/devotional` | `app/devotional/page.jsx` | Daily devotional reader |
| `/journal` | `app/journal/page.jsx` | Private encrypted journal |
| `/settings` | `app/settings/page.jsx` | Theme, profile, backup export/import, feedback |

---

## UI Standards (Non-Negotiable)

- **Color palette**: Warm teal `#305f4f` (primary/`--brand`), Amber `#eadcc8` (secondary/`--bg-strong`), Cream `#f6f1e9` (background/`--bg`).
- **Never** use shame-spiral language ("streak broken", "you failed", "days wasted").
- **Always** frame setbacks with grace ("Every new moment is a fresh start").
- **Dark mode**: Three modes — `light`, `dark`, `system`. `.dark` class on `<html>`.
- **Animations**: Motion (Framer Motion v12). Subtle and purposeful. Respect `prefers-reduced-motion`.
- **Toasts**: Sonner only (`toast()`, `toast.success()`, `toast.error()`). No browser `alert()`.

---

## Security Rules (Non-Negotiable)

- **Zero `fetch()` in production source** — no runtime API calls except the optional Supabase feedback submit via `src/lib/supabase.js`.
- **No `dangerouslySetInnerHTML`** outside `app/layout.jsx` (JSON-LD only, reviewed and static).
- **No `console.log` / `console.warn` / `console.error`** in production code.
- **CSP enforced** via `<meta httpEquiv>` in `app/layout.jsx` — do NOT add external scripts, CDN links, or `<link>` tags pointing off-origin.
- **Sensitive localStorage**: Any new sensitive field MUST route through `src/utils/crypto.js`.
- **No `dangerouslySetInnerHTML`** anywhere else — React's default escaping is our XSS barrier.

---

## Content Schema Quick Reference

**verses.json** entry:
```json
{ "id": "string", "reference": "string", "text": "string", "emotions": ["emotion-id"], "panic": true }
```
Verses with `"panic": true` appear in the Panic Button modal and Emergency flow step 4.

**devotionals.json** entry:
```json
{ "id": "string", "title": "string", "body": "string", "practice": "string" }
```
Daily devotional selected by `dayOfYear % devotionals.length` — deterministic, not random.

---

## Deployment

- `npm run build` → fully static files in `dist/`
- **Vercel** auto-deploys from `main` branch (`gracegrip-webapp` project)
- Live: `https://gracegrip.app`
- CI (`.github/workflows/main.yml`): `npm ci` → `npm audit` → `npm run lint` → `npm run validate:content` → `npm run build`
- **Never push to main without CI passing.** Never skip `npm run build` locally before committing.
