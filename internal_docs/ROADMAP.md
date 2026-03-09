# GraceGrip Roadmap (Public Beta)

## Settings Enhancement Track ✅ / 🔜

### Phase 1 — Selective Backup ✅ DONE
Goal: replace single-shot export with checkbox-driven selective backup + Web Share + backup age reminder.
- Selective export by data field (streak, journal, favorites, devotionals, profile)
- Web Share API (`canShare` flag, mobile-native sharing)
- Backup reminder banner (shown after 7 days since last export)
- `lastExportDate` tracked in localStorage

### Phase 2 — QR Device Transfer ✅ DONE
Goal: peer-to-peer app state transfer via QR code — no internet, no server.
- `QRTransfer.jsx` generate + scan modes
- `fflate` compression to fit state within QR density limits
- `html5-qrcode` camera scanner (dynamic import, SSR-safe)
- Graceful "too large" warning if payload exceeds QR limits
- UI/UX polish pass: amber warning color, class-based visibility toggle, responsive canvas

### Phase 3 — Anonymous Feedback ✅ DONE
Goal: privacy-respecting feedback channel so users can share thoughts without accounts.
- Supabase anonymous feedback table (insert-only RLS)
- Rating + optional short message
- Works offline-gracefully (error toast if no network)
- `connect-src` CSP updated for Supabase
- GitHub Actions deploy.yml: SUPABASE env secrets wired

### Settings UI Polish ✅ DONE (2026-03-07)
Goal: fix layout defects and elevate UI quality in SettingsPage.
- Removed duplicate Send Feedback section (bug)
- Data & Backup: added subtitle, divider rule, Lucide icons on action buttons
- QR Transfer: tabs redesigned from full-width bars to segmented pill control

### Emergency & Scripture UI Polish ✅ DONE (2026-03-08)
Goal: fix layout defects on the Emergency and Scripture pages.
- Scripture page: pill-tab navigation → category card grid with per-category color tokens (6 categories)
- "View Saved Verses" button constrained to fit-content width
- Breathing Exercise: `breathing-active` class toggle; `margin-bottom: 6rem` clears Pause/Reset buttons during active session
- Breathing circle top-clip fix: `margin-top: 3rem` clears 28.5px upward overflow of `scale(1.3)`; `transition: margin 500ms ease` smooths both directions
- Grounding Exercise card: `max-width: 580px; margin: 0 auto` constrains width

---

## P0 - Beta Stabilization (Now)
Goal: public, stable, trustworthy beta.

1. Core flow reliability
- Panic Button modal and countdown stable
- Streak update/reset reliable
- Favorites and backup import/export reliable

2. Public beta polish
- Clear beta messaging
- Clear privacy language
- Strong disclaimer visibility

3. Deployment reliability ✅ DONE (2026-03-08)
- Vercel deployment live at https://gracegrip.app (auto-deploys on push to `main`)
- Custom domains `gracegrip.app` + `www.gracegrip.app` (Cloudflare DNS, SSL active)
- CI-only GitHub Actions workflow: `npm audit` + `npm run lint` + `npm run build` gates
- `npm run lint` runs `eslint .` (Next.js 16 dropped `next lint` CLI)
- Stale GitHub Pages deployments + environments cleaned up from GitHub

Exit Criteria: ✅ MET (2026-03-08)
- Build/lint pass ✅ (`npm run lint` zero errors; `npm run build` 9/9 routes)
- Public URL works ✅ (https://gracegrip.app live)
- Core flows manually verified ✅

## P1 - Content and Contribution Layer (Next)
Goal: scale content safely without backend complexity.

1. Content structure migration
- Move content to contributor-friendly JSON/Markdown
- Add content validation scripts

2. Open-source workflow
- `CONTRIBUTING.md`
- issue/PR templates
- review checklist for tone/theology/safety

3. Accessibility/UX pass
- keyboard and screen-reader support
- contrast and focus improvements

Exit Criteria:
- Non-dev contributors can submit content safely
- Accessibility baseline improved

## P2 - Growth Features (Later)
Goal: improve retention while preserving privacy-first constraints.

1. Better offline/PWA behavior
2. Expanded guided recovery flows
3. Optional privacy-respecting feedback channel → **Phase 3 above**
4. Optional analytics only if explicitly approved

Exit Criteria:
- Higher engagement without forced account creation
- Privacy guarantees unchanged
