# GraceGrip Execution Tasks (AI-Optimized)

## Usage
- Status: `todo | in-progress | blocked | done`
- Every task must include verification (`npm run lint`, `npm run build`, and manual checks where relevant).
- Keep commits scoped to one task when possible.

## Settings Enhancement Track

### GG-SET-01 Selective Backup (Phase 1)
Status: done
Goal: replace monolithic export/import with checkbox-driven selective backup, Web Share API support, and backup age tracking.

Files changed:
- `src/utils/storage.js` — `exportAppState(state, selections)`, `importAppState(state, json)`, `lastExportDate` field
- `src/context/AppContext.jsx` — `backupSelections`, `onToggleBackupSelection`, `onExportData`, `onShareData`, `canShare`, `daysSinceBackup`, `fileInputRef` wiring
- `src/components/pages/SettingsPage.jsx` — backup section with reminder banner + 4 checkboxes + 3 action buttons
- `app/settings/page.jsx` — destructure + forward all new props
- `app/globals.css` — `.backup-*` CSS block

Definition of Done: ✅
- Selective export downloads a JSON subset
- Web Share works on supported devices (`canShare` flag)
- Reminder banner appears after 7 days since last backup
- Lint/build pass

---

### GG-SET-02 QR Device Transfer (Phase 2)
Status: done
Goal: peer-to-peer app-state transfer via QR code — no internet, no server, no accounts.

Files changed / created:
- `src/components/QRTransfer.jsx` — new component; generate + scan modes; fflate compression; SSR-safe dynamic import of html5-qrcode
- `src/context/AppContext.jsx` — `onQRImport` handler
- `src/components/pages/SettingsPage.jsx` — QR Transfer section with `<QRTransfer>` wired
- `app/settings/page.jsx` — `onQRImport` prop forwarded
- `app/globals.css` — `.qr-*` CSS block (Phase 2); `.legacy-settings-screen {}` defined
- `app/layout.jsx` — CSP updated: `media-src 'self'`

Dependencies added:
- `qrcode` — canvas-based QR generation
- `html5-qrcode` — camera scanner (dynamic import, SSR-safe)
- `fflate` — zlib compression to keep QR data within density limits

UI/UX polish fixes applied (ESLint 0 / Build 9/9):
1. `.backup-selections` margin-top
2. `.qr-tabs` gap 0.5 → 0.6rem
3. `.qr-canvas` width: 100%
4. `.qr-warning` changed amber color-mix (was --danger red)
5. `.qr-canvas--hidden` class + mobile `@media (max-width: 520px)` breakpoint
6. `.legacy-settings-screen {}` defined in CSS (was ghost class)
7. QRTransfer.jsx inline style → `qr-canvas--hidden` class toggle

Definition of Done: ✅
- QR code renders from compressed state payload
- Camera scan parses + imports state
- Too-large payload shows graceful warning (not crash)
- Inline style replaced with CSS class toggle
- Lint/build pass

---

### GG-SET-03 Anonymous Feedback Channel (Phase 3)
Status: done
Goal: let users submit brief anonymous feedback without accounts; store via Supabase with insert-only RLS.

Planned files:
- `src/lib/supabase.js` — null-safe Supabase client (env-var-driven)
- `.env.local.example` — env vars template
- `src/context/AppContext.jsx` — `onSubmitFeedback` handler
- `src/components/pages/SettingsPage.jsx` — Feedback section
- `app/settings/page.jsx` — `onSubmitFeedback` prop
- `app/layout.jsx` — CSP `connect-src` updated for Supabase URL
- `.github/workflows/deploy.yml` — `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` secrets wired

Supabase setup:
1. Create project (region: us-east-1)
2. Apply migration — `feedback` table with `insert_feedback` RLS policy
3. Install `@supabase/supabase-js`

Definition of Done: ✅
- Submit feedback with rating + optional message
- Fully anonymous (no user ID, no fingerprint)
- Works offline-gracefully (shows error toast if network unavailable)
- Lint/build pass

---

### GG-SET-04 Settings UI Polish
Status: done
Goal: fix duplicate Send Feedback section bug and improve Data & Backup and QR Transfer layouts.

Changes made:
- `src/components/pages/SettingsPage.jsx` — removed duplicate Send Feedback `<section>` block; added subtitle + `<hr className="backup-divider" />` to Data & Backup; added Lucide icons (`Download`, `Share2`, `Upload`) to action buttons
- `app/globals.css` — added `.backup-divider` and `.settings-section-subtitle` rules; redesigned `.qr-tabs` / `.qr-tab` / `.qr-tab--active` from full-width flex bars to inline segmented pill control

Definition of Done: ✅
- Duplicate section removed
- Data & Backup enriched with subtitle, divider, and icons
- QR Transfer tabs render as compact segmented pill (not full-width bars)
- Build passes: 9/9 static pages (2026-03-07)

---

## UI Polish Tasks

### GG-UI-01 Scripture Page Overhaul
Status: done
Goal: Replace pill-tab navigation with a card-grid layout with per-category color tokens.

Changes made:
- `src/components/pages/ScripturePage.jsx` — restructured from pill-tab layout to category card grid
- `app/globals.css` — added `.scripture-card-grid`, `.scripture-category-card`, per-category color tokens (6 categories); `.view-saved-btn { width: fit-content; align-self: center }`

Definition of Done: ✅
- Scripture page renders as a card grid with category-colored headers
- "View Saved Verses" button is correctly sized (fit-content)
- Build passes: 9/9 static pages (2026-03-07)

---

### GG-UI-02 Emergency Page Layout Fixes
Status: done
Goal: Fix three layout issues on the Emergency page during breathing and grounding flows.

Changes made:
- `src/components/BreathingExercise.jsx` — added `breathing-active` class to `<section>` when `running === true`
- `app/globals.css` — `.breathing-active .breathing-circle-wrap { margin-bottom: 6rem }` — clears Pause/Reset buttons below the circle during active breathing
- `app/globals.css` — `.grounding-card { max-width: 580px; margin: 0 auto }` — constrains grounding card width

Definition of Done: ✅
- Breathing circle no longer overlaps Pause/Reset buttons during active session
- Grounding Exercise card is properly constrained in width
- Build passes: 9/9 static pages (2026-03-08)

---

### GG-UI-03 Breathing Circle Top-Clip Fix
Status: done
Goal: Fix breathing circle clipping into description text above when scale(1.3) expansion activates.

Root Cause: `transform: scale(1.3)` is visual-only — does not affect layout flow. At 190px base, scale(1.3) produces 247px visual = 28.5px upward overflow. Original `margin-top: 1.25rem` (~20px) was insufficient.

Changes made:
- `app/globals.css` — `.breathing-active .breathing-circle-wrap { margin-top: 3rem }` — provides 48px clearance (28.5px overflow + ~19.5px breathing room)
- `app/globals.css` — `.breathing-circle-wrap { transition: margin 500ms ease }` — updated from `margin-bottom 500ms ease` to cover both directions

Definition of Done: ✅
- Breathing circle enters/exits active state without clipping text above or overlapping buttons below
- Transition animates smoothly in both directions
- Build passes: 9/9 static pages (2026-03-08)

---

## DevOps & CI Tasks

### GG-DEVOPS-01 Vercel Migration
Status: done
Goal: migrate from GitHub Pages to Vercel with custom domain, SSL, and env vars.

Changes made:
- Vercel project `gracegrip-webapp` created (team `aikusans-projects`, ID `prj_Ta1AqXQ0hHaKb6Fq5OhJJh7Xt2qe`)
- Custom domains `gracegrip.app` + `www.gracegrip.app` configured (Cloudflare DNS, proxy OFF)
- SSL certificate force-issued via Vercel
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` added to Vercel dashboard
- All stale GitHub Pages deployments (4) and environments (2: `github-pages`, `Production`) deleted from GitHub

Definition of Done: ✅
- https://gracegrip.app live and SSL-valid
- Vercel auto-deploys on push to `main`

---

### GG-CI-01 CI-Only GitHub Actions Workflow
Status: done
Goal: replace GitHub Pages deploy workflow with lint + build CI gates only.

Changes made:
- `.github/workflows/deploy.yml` — removed GitHub Pages deploy steps; kept `npm audit`, `npm run lint`, `npm run build`
- Commit: `1e4be4d`

Definition of Done: ✅
- Workflow runs on push to `main` — audit + lint + build only
- No GitHub Pages artifacts created

---

### GG-CI-02 ESLint Fix — next lint → eslint + purity
Status: done
Goal: fix CI failure caused by Next.js 16 dropping `next lint` CLI and secondary react-hooks/purity violation.

Root Cause: `next lint` CLI removed from Next.js 16. Running `eslint .` directly exposed a `react-hooks/purity` error: `Date.now()` called at render time in `daysSinceBackup` in `AppContext.jsx`.

Changes made:
- `package.json` — `"lint": "next lint"` → `"lint": "eslint ."`
- `src/context/AppContext.jsx` — `Date.now()` → `today.getTime()` (uses stable `useState` value initialized once at mount)
- Commit: `9d1b34c`

Definition of Done: ✅
- `npm run lint` — zero errors/warnings
- `npm run build` — 9/9 static pages
- CI passes on `main`

---

## P0 Tasks (Beta Stabilization)

### GG-P0-01 Core Flow QA
Status: todo
Goal: verify panic, streak, favorites, and backup flows are reliable.

Files:
- `app/layout.jsx`
- `src/utils/storage.js`

Definition of Done:
- All core flows pass manual checks
- No console errors during manual testing
- Lint/build pass

### GG-P0-02 Beta Messaging Consistency
Status: todo
Goal: ensure UI/docs show public beta consistently.

Files:
- `src/components/pages/HomePage.jsx`
- `README.md`

Definition of Done:
- Wording is consistent
- Lint/build pass

### GG-P0-03 Deploy Confidence
Status: done
Goal: guarantee automated deployment with working live URL and passing CI.

Changes made:
- Migrated from GitHub Pages to Vercel (project `gracegrip-webapp`, team `aikusans-projects`)
- Custom domains `gracegrip.app` + `www.gracegrip.app` configured; SSL active
- CI-only GitHub Actions workflow (`.github/workflows/deploy.yml`) — lint + build gates
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured in Vercel dashboard
- Fixed `next lint` → `eslint .` (Next.js 16 dropped `next lint` CLI)

Definition of Done: ✅
- `npm run lint` zero errors
- `npm run build` 9/9 static routes
- Live URL https://gracegrip.app accessible; Vercel auto-deploys on push to `main`

## P1 Tasks

### GG-P1-01 Content Format Migration
Status: todo
Goal: move hardcoded content to JSON/Markdown and add validation.

Files:
- `content/*`
- `scripts/validate-content.mjs`

Definition of Done:
- App renders from new content files
- Validation script catches malformed content
- Lint/build pass

### GG-P1-02 Contributor Onboarding
Status: todo
Goal: make content contribution straightforward.

Files:
- `CONTRIBUTING.md`
- `.github/ISSUE_TEMPLATE/*`
- `.github/pull_request_template.md`

Definition of Done:
- New contributor can submit content without code changes

## P2 Tasks

### GG-P2-01 PWA Hardening
Status: todo
Goal: improve installability and offline behavior.

Files:
- `public/manifest.json`
- service worker setup files

Definition of Done:
- Install prompt works on supported browsers
- Core reading pages work offline

### GG-P2-02 Recovery Flow Expansion
Status: todo
Goal: add structured urge-response plans.

Files:
- `src/components/pages/EmergencyPage.jsx`
- `src/content/*`

Definition of Done:
- Users can complete a full urge plan from trigger to stabilization
- Accessibility checks pass for the flow

Files:
- `CONTRIBUTING.md`
- `.github/ISSUE_TEMPLATE/*`
- `.github/pull_request_template.md`

Definition of Done:
- New contributor can submit content without code changes

## P2 Tasks

### GG-P2-01 PWA Hardening
Status: todo
Goal: improve installability and offline behavior.

Files:
- `public/manifest.json`
- service worker setup files

Definition of Done:
- Install prompt works on supported browsers
- Core reading pages work offline

### GG-P2-02 Recovery Flow Expansion
Status: todo
Goal: add structured urge-response plans.

Files:
- `src/components/pages/EmergencyPage.jsx`
- `src/content/*`

Definition of Done:
- Users can complete a full urge plan from trigger to stabilization
- Accessibility checks pass for the flow
