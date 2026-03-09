# GraceGrip WebApp — Project Manifest

> Master reference document. Last updated: 2026-03-08.  
> Keep this file in sync with any structural, dependency, or routing changes.

---

## 1. Identity

| Field | Value |
|---|---|
| **Product name** | GraceGrip |
| **Tagline** | Faith Over Temptation |
| **Status** | Public Beta |
| **Version** | 0.1.0 |
| **Mission** | Free, privacy-first Christian recovery support. No accounts, no tracking, no paywalls. |
| **Audience** | People fighting porn / masturbation habits — grace-centered, accessible to non-believers too. |
| **Disclaimer** | Spiritual / peer support only. Not professional mental health care. |

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | ^16.1.6 |
| Runtime | React | ^19.2.0 |
| Language | JavaScript (JSX) | — |
| Styling | Tailwind CSS v4 + custom CSS | ^4.2.1 |
| Animation | Motion (Framer Motion v12) | ^12.35.0 |
| Icons | Lucide React + Tabler Icons | 0.577.0 / 3.39.0 |
| Toasts | Sonner | ^2.0.7 |
| Fonts | Libre Baskerville (serif) + Manrope (sans) | Google Fonts via `next/font` |
| Utility | clsx, tailwind-merge, class-variance-authority | — |
| Linting | ESLint + eslint-config-next | ^9.39.1 |
| Build | Turbopack | bundled with Next.js |
| Deployment | Vercel (gracegrip.app + www.gracegrip.app); CI gate via GitHub Actions | — |
| QR Generation | qrcode | ^1.5.x |
| QR Scanning | html5-qrcode (dynamic import) | ^2.3.x |
| Compression | fflate | ^0.8.x |
| Feedback Backend | @supabase/supabase-js | ^2.x |

---

## 3. Commands

```bash
npm run dev              # Dev server (Next.js + Turbopack, hot reload)
npm run build            # Static export → dist/
npm run lint             # ESLint — must pass before commit
npm run validate:content # Validate content JSON schema — run after any content/ edit
```

---

## 4. Project Structure

```
GraceGrip-WebApp/
├── app/                        # Next.js App Router (pages + layout)
│   ├── layout.jsx              # Root layout — fonts, metadata, AppProvider, Toaster
│   ├── page.jsx                # / → HomePage
│   ├── globals.css             # All custom CSS, CSS variables, theme tokens
│   ├── icon.svg                # App icon route
│   ├── not-found.jsx           # 404 page
│   ├── devotional/page.jsx     # /devotional
│   ├── emergency/page.jsx      # /emergency
│   ├── journal/page.jsx        # /journal
│   ├── scripture/page.jsx      # /scripture
│   └── settings/page.jsx       # /settings
│
├── src/
│   ├── components/
│   │   ├── AppShell.jsx        # Root shell — handles onboarding gate + layout
│   │   ├── AppNavigation.jsx   # Sidebar + mobile bottom nav
│   │   ├── HeroSection.jsx     # Top hero bar with logo + panic button
│   │   ├── WelcomeScreen.jsx   # Onboarding screen (shown before appState.onboardingComplete)
│   │   ├── PanicModal.jsx      # Full-screen panic overlay (3-min countdown)
│   │   ├── DailyVerse.jsx      # Scripture card widget
│   │   ├── BreathingExercise.jsx
│   │   ├── GroundingExercise.jsx
│   │   ├── MoodSelector.jsx
│   │   ├── StreakRing.jsx      # Animated streak progress ring
│   │   ├── ThemeDropdown.jsx   # Light / Dark / System picker
│   │   ├── UrgeTimer.jsx
│   │   ├── QRTransfer.jsx       # QR generate/scan for peer-to-peer state transfer (Phase 2)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── EmergencyPage.jsx
│   │   │   ├── ScripturePage.jsx
│   │   │   ├── JournalPage.jsx
│   │   │   ├── DevotionalPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   └── ui/
│   │       ├── DynamicLogo.jsx     # Inline SVG logo — theme-reactive via CSS vars
│   │       ├── button.jsx
│   │       ├── animated-group.jsx
│   │       └── text-effect.jsx
│   │
│   ├── context/
│   │   └── AppContext.jsx      # Global state + all action handlers (React Context)
│   │
│   ├── utils/
│   │   └── storage.js          # localStorage read/write + all state mutations
│   │
│   ├── lib/
│   │   ├── utils.js            # clsx / cn utility
│   │   ├── supabase.js         # Null-safe Supabase client (initializes only when NEXT_PUBLIC_ vars set)
│   │   └── verseArt.js         # Maps verse categories → SVG art paths
│   │
│   ├── data/
│   │   └── encouragements.js   # Daily + emergency encouragement strings
│   │
│   ├── content/
│   │   └── loaders.js          # Imports + re-exports all content JSON as named exports
│   │
│   └── assets/                 # Static assets imported via JS
│
├── content/                    # Content JSON (contributor-editable)
│   ├── verses.json
│   ├── devotionals.json
│   └── emotions.json
│
├── public/                     # Static assets (served at root)
│   ├── favicon.svg
│   ├── logo.svg
│   ├── bmc-button.svg
│   ├── kofi_logo.svg
│   └── verse-art/              # Verse category SVG illustrations
│
├── supabase/
│   └── migrations/
│       ├── 001_user_feedback.sql  # user_feedback table + initial anon_insert RLS policy
│       └── 002_tighten_feedback_policy.sql  # tightened WITH CHECK constraints + column CHECK
│
├── scripts/
│   ├── validate-content.mjs    # JSON schema validator for all content files
│   └── build-logo-assets.ps1
│
├── .github/
│   ├── workflows/deploy.yml    # CI gate only (lint + build + audit); Vercel auto-deploys from main
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
│
├── .env.local                  # (gitignored) NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
├── .env.local.example          # Documented env template
├── PROJECT_MANIFEST.md         # ← THIS FILE
├── BRAIN.md                    # Product philosophy + non-negotiables
├── ROADMAP.md                  # P0 / P1 / P2 feature roadmap
├── TASKS.md                    # Execution task list (AI-optimized)
├── CLAUDE.md                   # AI coding agent instructions
├── AGENTS.md                   # Codex/OpenAI agent conventions (folder map, conventions)
├── HANDOVER_DEVOPS.md          # DevOps handover doc — data flow, deployment, dead code audit
├── CONTRIBUTING.md             # Contributor guide
├── README.md                   # Public-facing readme
├── next.config.mjs
├── jsconfig.json
├── tailwind.config / postcss.config.mjs
├── eslint.config.mjs
├── components.json             # shadcn/ui registry config
└── package.json
```

---

## 5. Routing Map

| Route | File | Component | Notes |
|---|---|---|---|
| `/` | `app/page.jsx` | `HomePage` | Main dashboard |
| `/emergency` | `app/emergency/page.jsx` | `EmergencyPage` | Guided crisis flow |
| `/scripture` | `app/scripture/page.jsx` | `ScripturePage` | Verse library by emotion |
| `/journal` | `app/journal/page.jsx` | `JournalPage` | Private local journal |
| `/devotional` | `app/devotional/page.jsx` | `DevotionalPage` | Daily devotional rotation |
| `/settings` | `app/settings/page.jsx` | `SettingsPage` | Theme, profile, backup |
| `/_not-found` | `app/not-found.jsx` | — | 404 handler |

All routes are **statically prerendered** (9 static pages in production build).

---

## 6. App State & Persistence

**localStorage key:** `gracegrip_v1`  
> ⚠ Renaming this key silently wipes all user data. Only bump deliberately for breaking migrations.

### State Shape (`initialState` in `storage.js`)

```js
{
  streak: {
    count: 0,          // current clean streak (days)
    lastCheckIn: '',   // ISO date string
    longest: 0,        // personal best streak
  },
  streakHistory: [],         // [{ startDate, endDate, days }]
  favoriteVerseIds: [],      // string[]
  journalEntries: [],        // [{ id, content, date, mood }]
  devotionalCompletedDays: [],  // string[] ISO dates
  themePreference: 'system', // 'light' | 'dark' | 'system'
  onboardingComplete: false,
  profileName: '',
  profileCreatedAt: '',
  lastExportDate: '',      // ISO date string — last successful backup export
  backupSelections: {     // which data fields are selected for export
    streak: true,
    streakHistory: true,
    favoriteVerseIds: true,
    journalEntries: true,
    devotionalCompletedDays: true,
    profileName: true,
  },
}
```

### State Mutation Functions (`storage.js`)

| Function | Purpose |
|---|---|
| `loadAppState()` | Read + normalize from localStorage |
| `saveAppState(state)` | Write to localStorage |
| `updateStreak(state)` | Increment if lastCheckIn was yesterday (idempotent same-day) |
| `resetStreak(state)` | Zero out streak, archive to streakHistory |
| `toggleFavoriteVerse(state, id)` | Add/remove verse id from favorites |
| `addJournalEntry(state, content, mood)` | Prepend new entry |
| `deleteJournalEntry(state, id)` | Remove by id |
| `clearJournal(state)` | Wipe all journal entries |
| `exportStateAsJson(state)` | Returns full JSON string blob |
| `importStateFromJson(state, json)` | Merges / replaces from JSON backup |
| `exportAppState(state, selections)` | Returns JSON string of selected data fields only; stamps `lastExportDate` |
| `importAppState(state, json)` | Merges selective backup into current state |
| `toggleDevotionalCompletion(state, date)` | Toggle completion for a day |
| `addStreakHistory(state, entry)` | Append to streakHistory |

---

## 7. Global Context API (`AppContext.jsx`)

`useApp()` hook exposes:

| Value / Handler | Type | Description |
|---|---|---|
| `appState` | object | Full persisted state |
| `verses` | array | All verses from content |
| `encouragementOfDay` | string | Deterministic daily encouragement |
| `panicActive` | boolean | Whether panic modal is open |
| `panicVerse` | object | Current verse shown in panic modal |
| `panicMode` | string | Current phase of panic flow |
| `secondsLeft` | number | Panic countdown (starts at 180) |
| `formatTime(s)` | fn | Formats seconds as MM:SS |
| `panicButtonHandler()` | fn | Opens panic modal + selects verse |
| `setPanicActive(bool)` | fn | Close panic modal |
| `setSecondsLeft(n)` | fn | Reset countdown |
| `sidebarExpanded` | boolean | Sidebar collapse state |
| `setSidebarExpanded(bool)` | fn | Toggle sidebar |
| `currentThemePreference` | string | `'light'` \| `'dark'` \| `'system'` |
| `onThemeChange(pref)` | fn | Set explicit theme |
| `cycleThroughThemes()` | fn | Cycle light → dark → system |
| `welcomeName` | string | Onboarding name input value |
| `setWelcomeName(s)` | fn | Update welcome name input |
| `onBeginJourney()` | fn | Complete onboarding |
| `onStayedClean()` | fn | Check-in handler |
| `onStumbledToday()` | fn | Reset streak handler |
| `profileNameInput` | string | Settings profile name |
| `setProfileNameInput(s)` | fn | Update profile name input |
| `fileInputRef` | ref | Hidden file input for backup import |
| `backupSelections` | object | Which data fields are selected for export |
| `onToggleBackupSelection(key)` | fn | Toggle a backup field on/off |
| `onExportData(selections)` | fn | Trigger download of selected fields as JSON |
| `onShareData(selections)` | fn | Share backup JSON via Web Share API |
| `canShare` | boolean | Whether device supports Web Share API **and** is a mobile device (Android/iOS). Always `false` on desktop. Gated by `isMobileDevice` UA check (`/android|iphone|ipad|ipod/i`) before API capability checks. |
| `daysSinceBackup` | number | Days since `lastExportDate` (or `Infinity` if never) |
| `onQRImport(json)` | fn | Parse + merge state payload received from QR scanner |
| `onToggleReminder()` | fn | Toggle `appState.reminder.enabled` on/off |
| `onChangeReminderTime(time)` | fn | Set `appState.reminder.time` (HH:MM string) |
| `onSubmitFeedback(rating, message)` | fn | Submit anonymous feedback to Supabase (null-safe; shows toast on success/failure) |

---

## 8. Theme System

| Token | Light (`:root`) | Dark (`:root.dark`) |
|---|---|---|
| `--ink` | `#1d2b28` | `#eef4f8` |
| `--bg` | `#f6f1e9` | `#0f1519` |
| `--font-sans` | Manrope | Manrope |
| `--font-serif` | Libre Baskerville | Libre Baskerville |

Theme class (`dark`) is toggled on `<html>` by `AppContext` via `useEffect`. Three modes: `light`, `dark`, `system` (follows `prefers-color-scheme`).

**DynamicLogo** uses inline SVG with `fill="var(--ink)"` and `fill="var(--bg)"` directly — no image swap, no JS logic, instant CSS transition on theme change.

---

## 9. Logo & Brand Assets

| File | Usage |
|---|---|
| `src/components/ui/DynamicLogo.jsx` | Inline SVG component — used everywhere in the app. Theme-reactive. |
| `public/favicon.svg` | Browser favicon / `<head>` icon |
| `public/logo.svg` | Primary logo asset |
| `public/bmc-button.svg` | Buy Me a Coffee support button |
| `public/kofi_logo.svg` | Ko-fi support button |
| `public/verse-art/` | Verse category SVG illustrations |

**Logo placement:**

| Location | Component | Size |
|---|---|---|
| Sidebar (desktop) | `AppNavigation` | `size={34}` |
| Hero bar | `HeroSection` | `size={160}` |
| Welcome / onboarding header | `WelcomeScreen` | `size={44}` |

---

## 10. Content Schemas

All content lives in `content/` as JSON. Run `npm run validate:content` after any edit.

### `verses.json`
```json
{
  "id": "string",
  "reference": "string",
  "text": "string",
  "emotions": ["emotion-id"],
  "panic": true
}
```
Verses with `"panic": true` appear in the Panic Button modal. `emotions[]` values must match `id` fields in `emotions.json`.

### `devotionals.json`
```json
{
  "id": "string",
  "title": "string",
  "body": "string",
  "practice": "string"
}
```
Daily devotional selected by `dayOfYear % devotionals.length` — deterministic, not random.

### `emotions.json`
```json
{
  "id": "string",
  "label": "string",
  "prompt": "string"
}
```

---

## 11. Deployment

### Vercel (Production)

**Project:** `gracegrip-webapp` (team `aikusans-projects`, ID `prj_Ta1AqXQ0hHaKb6Fq5OhJJh7Xt2qe`)
**Trigger:** Vercel auto-deploys on push to `main` (no config required)  
**Live URL:** https://gracegrip.app (+ www.gracegrip.app)  
**Custom domains:** `gracegrip.app` + `www.gracegrip.app` (Cloudflare DNS, proxy OFF, SSL active)  
**Env vars:** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — set in Vercel dashboard only (never in `.env.local` in production)

### GitHub Actions CI Gate

**Workflow file:** `.github/workflows/deploy.yml`  
**Trigger:** Push to `main` or PR  
**Pipeline (gate only — no deploy):**
1. Checkout → Setup Node 20 → `npm ci`
2. `npm audit --audit-level=high`
3. `npm run lint` (runs `eslint .` — note: `next lint` CLI dropped in Next.js 16)
4. `npm run build`

Vercel handles deployment independently. CI only validates code quality.

### Static Output
All 9 routes are statically prerendered at build time. No server required.

---

## 12. Navigation Structure

**Desktop sidebar** (collapsible, left-rail):
```
Logo + "GraceGrip" wordmark
├── Home        /
├── Emergency   /emergency   ← accent color when not active
├── Scripture   /scripture
├── Journal     /journal
├── Devotional  /devotional
└── Settings    /settings
    [collapse toggle]
```

**Mobile bottom bar** (fixed, 6 icons):
Same items, icon-only, no labels.

---

## 13. Non-Negotiables

1. No forced auth or account creation
2. No cloud sync of personal data by default
3. No paid wall on core support features
4. Grace-first language — zero shame-spiral UX
5. Must deploy as a static site (deployed on Vercel at gracegrip.app)
6. `gracegrip_v1` localStorage key must never be silently renamed

---

## 14. Quality Gates

Before merging any change:

```bash
npm run lint          # must pass (0 errors)
npm run build         # must pass (0 compile errors)
npm run validate:content  # must pass after any content/ edit
```

Manual verifications:
- Panic flow (open → countdown → verse)
- Streak check-in and reset
- Backup export and import
- Theme toggle (light / dark / system) — all logos transition smoothly
- Mobile layout on narrow viewport

---

## 15. Roadmap Summary

| Phase | Goal | Status |
|---|---|---|
| **P0** | Beta stabilization — core flow reliability, deploy confidence | In progress |
| **P1** | Content / contribution layer — JSON migration, open-source workflow, a11y | Planned |
| **P2** | Growth — PWA/offline, expanded recovery flows, optional analytics | Future |

See [ROADMAP.md](ROADMAP.md) and [TASKS.md](TASKS.md) for full detail.

---

## 16. Key Gotchas

- Public asset paths: `/logo.svg` and other `/public` refs work correctly — Vercel serves the app from the domain root with no `basePath` configured. No subpath escaping needed.
- Theme: `dark` class lives on `<html>`. Toggling via `AppContext` `useEffect` is the only correct method — do not imperatively mutate elsewhere.
- Streak idempotency: calling `updateStreak` twice on the same day is a safe no-op.
- Panic timer interval is cleared with `window.clearInterval` — clear it on unmount to prevent memory leaks.
- `normalizeState` in `storage.js` guards against malformed localStorage data on every load.
- ESLint rule: `no-unused-vars` ignores names matching `/^[A-Z_]/` — uppercase component names are safe to leave imported without explicit usage warnings.

---

## 17. Tech Debt

> All previously tracked dead code has been resolved.

| Item | File | Resolution |
|------|------|------------|
| `app` mode render branch + `onPanic` prop | `src/components/HeroSection.jsx` | ✅ Removed — dead else block and unused prop deleted. |
