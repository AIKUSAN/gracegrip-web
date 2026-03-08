# GraceGrip WebApp — CLAUDE.md

> **Mission**: GraceGrip is a privacy-focused, grace-first recovery web app.
> All data stays on-device. No accounts, no tracking, no cloud sync.

## Commands

```bash
npm run dev              # Next.js dev server (hot reload)
npm run build            # Static export → dist/
npm run lint             # ESLint — must pass before commit
npm run validate:content # JSON schema check — run after any content/ edit
```

## Architecture

**Next.js 16 App Router** with static export (`output: 'export'`, `distDir: 'dist'`).
No server — the entire app deploys as static files to GitHub Pages.

- **Routing**: File-based via `app/` directory. 6 routes (see table below).
- **State**: Single global React Context (`src/context/AppContext.jsx`) via `AppProvider` + `useApp()` hook. No Redux/Zustand.
- **Storage**: localStorage under key `gracegrip_v1`. Sensitive fields (journal, profile, streakHistory) encrypted with AES via Web Crypto API (`src/utils/crypto.js`).
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`. CSS variables in `app/globals.css`. Dark mode via `.dark` class on `<html>`.
- **Fonts**: Libre Baskerville (serif) + Manrope (sans) via `next/font/google` — self-hosted at build time, no runtime CDN.

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.jsx` | Root layout — fonts, metadata, CSP meta tag, Toaster (sonner), AppProvider |
| `app/page.jsx` | Home route — renders HomePage component |
| `app/*/page.jsx` | Route pages (emergency, scripture, devotional, journal, settings) |
| `src/components/AppShell.jsx` | App chrome — navigation, welcome gate, panic modal |
| `src/components/pages/*.jsx` | Page-level components (HomePage, EmergencyPage, etc.) |
| `src/components/ui/*.jsx` | Reusable UI primitives (button, DynamicLogo, text-effect, animated-group) |
| `src/context/AppContext.jsx` | Global state provider — all app state + daily content memos |
| `src/utils/storage.js` | localStorage read/write helpers |
| `src/utils/crypto.js` | AES encrypt/decrypt via Web Crypto API |
| `src/content/loaders.js` | Imports and validates content JSON |
| `src/lib/utils.js` | `cn()` class merge helper (clsx + tailwind-merge) |
| `src/lib/verseArt.js` | Maps verse categories to SVG art in `public/verse-art/` |
| `src/lib/supabase.js` | Null-safe Supabase client — only initializes when env vars are set |
| `src/components/QRTransfer.jsx` | QR code generate/scan for peer-to-peer state transfer (Phase 2) |
| `supabase/migrations/001_user_feedback.sql` | Supabase migration — `user_feedback` table + RLS anon insert policy |
| `supabase/migrations/002_tighten_feedback_policy.sql` | Tightens `anon_insert` RLS policy — enforces rating range, message length cap, null user_id/category; adds column-level CHECK constraint |
| `src/data/encouragements.js` | Static encouragement strings |
| `content/verses.json` | Verse library (text, reference, emotions[], panic flag) |
| `content/devotionals.json` | Daily devotionals (id, title, body, practice) |
| `content/emotions.json` | Emotion categories (id, label, prompt) |
| `scripts/validate-content.mjs` | Schema validator for content/*.json |
| `next.config.mjs` | Static export config, distDir, reactStrictMode |
| `components.json` | shadcn/ui config (style: maia, JSX, Tabler icons) |
| `.github/workflows/deploy.yml` | CI/CD — builds and deploys to GitHub Pages on push to main |

## Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.jsx` | Home — streak ring, greeting, daily verse |
| `/emergency` | `app/emergency/page.jsx` | Urge timer, breathing, grounding, panic verse |
| `/scripture` | `app/scripture/page.jsx` | Category-based verse browser |
| `/devotional` | `app/devotional/page.jsx` | Daily devotional |
| `/journal` | `app/journal/page.jsx` | Private encrypted journal |
| `/settings` | `app/settings/page.jsx` | Theme, profile, backup export/import |

## Content Schemas

**verses.json** — each entry:
```json
{ "id": "string", "reference": "string", "text": "string",
  "emotions": ["emotion-id"], "panic": true }
```
Verses with `"panic": true` appear in the Panic Button modal and Emergency flow step 4.

**devotionals.json** — each entry:
```json
{ "id": "string", "title": "string", "body": "string", "practice": "string" }
```
Daily devotional is selected by `dayOfYear % devotionals.length` — not random.

**emotions.json** — each entry:
```json
{ "id": "string", "label": "string", "prompt": "string" }
```
Emotion `id` values must match strings used in `verses.emotions[]`.

Always run `npm run validate:content` after editing any `content/` file.

## Gotchas

- **localStorage key**: stored under `gracegrip_v1`. Renaming this key silently wipes all user data. Bump deliberately for breaking migrations only.
- **Fonts**: `next/font/google` self-hosts fonts at build. No runtime Google Fonts request. The CSP (`font-src 'self'`) enforces this.
- **CSP**: Enforced via `<meta httpEquiv>` in `app/layout.jsx` (required for static GitHub Pages). If migrating to a server host, move to `next.config.mjs` `headers()`.
- **Theme**: dark mode toggles `.dark` class on `<html>`. Three modes: `light`, `dark`, `system`.
- **Streak logic**: `updateStreak` only increments if `lastCheckIn` was yesterday. Same-day calls are no-ops (idempotent).
- **Daily content**: `todayDevotional`, `encouragementOfDay`, `emergencyEncouragement`, and `greeting` all derive from a single `today` date state in AppContext. Auto-rolls at local midnight via `setTimeout` + `visibilitychange`/`focus` listener.
- **Path alias**: `@/*` resolves to `./src/*` (configured in `jsconfig.json`).
- **ESLint rule**: `no-unused-vars` ignores names matching `/^[A-Z_]/`.
- **Supabase feedback**: Env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are optional — `onSubmitFeedback` silently no-ops if missing. Migrations at `supabase/migrations/001_user_feedback.sql` (table + initial policy) and `002_tighten_feedback_policy.sql` (tightened `WITH CHECK` + column constraint). CSP `connect-src https://*.supabase.co` already set in `app/layout.jsx`.
- **Share button (`canShare`)**: Hidden on all desktop browsers. Gated first by `isMobileDevice` UA check (`/android|iphone|ipad|ipod/i`) so it only appears on Android and iOS/iPadOS, regardless of Web Share API availability.

## Non-Negotiables

1. No forced auth or account creation.
2. No cloud sync of personal data by default.
3. No paid wall on core support features.
4. Grace-first language — never shame-spiral UX.
5. Must deploy as a static site (GitHub Pages compatible).

## Rules

See `.claude/rules/` for detailed standards:
- `security.md` — OWASP checklist, CSP, encryption, privacy constraints
- `deployment.md` — build pipeline, deploy gates, verification checklist
- `ui-standards.md` — palette, fonts, animation, design philosophy

## Quality Gates

Before merging any change:
```bash
npm run lint      # must pass
npm run build     # must pass
```
Also manually verify: panic flow, streak check-in/reset, backup export/import,
and mobile layout.

## Deployment

- GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys on push to `main`.
- Live URL pattern: `https://<username>.github.io/GraceGrip-WebApp/`
- **Custom domain or rename**: Update `basePath` in `next.config.mjs` to match the new path.
