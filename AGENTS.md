# AGENTS.md — GraceGrip WebApp

> **Stack**: Next.js 16 (App Router, static export) · React 19 · Tailwind CSS v4 · Vercel
> **Language**: JavaScript (JSX) — no TypeScript

## Folder Structure

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router — `layout.jsx` (root layout, fonts, CSP, provider), `page.jsx` (home), route directories (`emergency/`, `scripture/`, `devotional/`, `journal/`, `settings/`) |
| `src/components/` | React components — `AppShell.jsx` (app chrome, nav, panic modal), `AppNavigation.jsx`, standalone features (`BreathingExercise`, `GroundingExercise`, `UrgeTimer`, `StreakRing`, `DailyVerse`, `MoodSelector`, `HeroSection`, `WelcomeScreen`, `PanicModal`, `ThemeDropdown`, `QRTransfer`) |
| `src/components/pages/` | Page-level components rendered by `app/*/page.jsx` routes (`HomePage`, `EmergencyPage`, `ScripturePage`, `DevotionalPage`, `JournalPage`, `SettingsPage`) |
| `src/components/ui/` | Reusable UI primitives — `button.jsx` (shadcn), `DynamicLogo.jsx`, `animated-group.jsx`, `text-effect.jsx` |
| `src/context/` | Single global React Context — `AppContext.jsx` (`AppProvider` + `useApp()` hook). No Redux/Zustand. |
| `src/utils/` | `storage.js` (localStorage read/write), `crypto.js` (AES encrypt/decrypt via Web Crypto API) |
| `src/lib/` | `utils.js` (`cn()` class merge helper), `verseArt.js` (maps verse categories → SVG art) |
| `src/content/` | Content loader modules — `loaders.js`, `devotionals.js`, `emotions.js`, `verses.js` |
| `src/data/` | Static data — `encouragements.js` |
| `content/` | Source JSON data — `verses.json`, `devotionals.json`, `emotions.json` (validated by `scripts/validate-content.mjs`) |
| `public/` | Static SVG assets — `logo.svg`, `favicon.svg`, `bmc-button.svg`, `kofi_logo.svg`, `verse-art/*.svg` |
| `scripts/` | Build tooling — `validate-content.mjs` (JSON schema validator) |
| `.github/workflows/` | CI/CD — `deploy.yml` (lint + build gate on every push/PR; Vercel auto-deploys from `main`) |
| `.claude/rules/` | AI agent rules — `security.md`, `deployment.md`, `ui-standards.md` |

## Key Conventions

- **Path alias**: `@/*` resolves to `./src/*` (configured in `jsconfig.json`)
- **Static export**: `output: 'export'`, `distDir: 'dist'` in `next.config.mjs` — no server runtime
- **CSS**: Tailwind CSS v4 via `@tailwindcss/postcss`, custom properties in `app/globals.css`
- **Fonts**: Self-hosted at build via `next/font/google` — no runtime CDN
- **State**: Single `AppContext` provider wraps the app in `app/layout.jsx`
- **Encryption**: Sensitive localStorage fields encrypted with AES (Web Crypto API)
- **Content edits**: Always run `npm run validate:content` after modifying `content/*.json`
- **New AppContext values (Phase 1+2)**: `backupSelections`, `onToggleBackupSelection`, `onExportData`, `onShareData`, `canShare`, `daysSinceBackup`, `onQRImport`
- **QRTransfer patterns**: `onQRImportRef` (useRef for scanner callback stability); html5-qrcode loaded via dynamic `import()` in useEffect only (SSR safety); visibility via `.qr-canvas--hidden` class, not inline style
- **Dead code in `HeroSection.jsx`**: The `app` mode branch (lines 122–157) and `onPanic` prop (line 43) are confirmed dead — never called. Do not add new callers against these paths. See `PROJECT_MANIFEST.md §17` and `HANDOVER_DEVOPS.md §1` for the full cleanup verification checklist.
- **Deploy target**: Vercel (auto-deploys from `main`). Live at `https://gracegrip.app`. Security headers injected via `vercel.json`.

## Quality Gates

```bash
npm run lint              # ESLint — must pass
npm run build             # Static export — must succeed
npm run validate:content  # JSON schema — must pass
npm audit                 # No high/critical vulnerabilities
```

## Rules

See `.claude/rules/` for detailed standards on security, deployment, and UI design.
See `CLAUDE.md` for architecture details, content schemas, and gotchas.
