# GraceGrip

**Faith Over Temptation.** GraceGrip is a free, privacy-first recovery web app for people fighting porn and masturbation addiction — built on Scripture, grace, and practical tools that work without an account, a subscription, or a server.

> **Status:** v1.1.0 — Live at [gracegrip.app](https://gracegrip.app)

---

## Mission

Some people reach for their phone in a moment of temptation and find nothing that respects their privacy or their faith. GraceGrip exists to fill that gap — offering immediate, dignified support through Scripture, breathing exercises, devotionals, and encrypted journaling, with zero tracking and zero gatekeeping.

**We believe shame does not produce lasting change. Grace does.**

---

## Privacy Promise

- **No account required** — open the app and it works.
- **No personal data sent to a server** — progress, journal, and favorites live in your browser only.
- **Sensitive data is encrypted** — journal entries and profile info are AES-encrypted via the Web Crypto API before being written to `localStorage`.
- **No tracking, no analytics, no advertising** — ever.
- The only cloud feature is an **optional, anonymous feedback form** (rating + message). No identity is captured.

---

## Features

| Feature | Description |
|---------|-------------|
| **Panic Button** | Instant high-impact Scripture verse + 3-minute guided breathing/prayer session |
| **Daily Bread** | Short rotating devotional updated each day |
| **Clean Streak** | Track days clean — the counter celebrates wins, never punishes setbacks |
| **Library of Truth** | Scripture organized by emotion (anxiety, shame, temptation, loneliness, and more) |
| **Encrypted Journal** | Private notes — AES-encrypted, never leaves your device |
| **QR Device Transfer** | Move your app state to another device via QR code — no internet required |
| **Selective Backup** | Export only the data you choose; import on any device |
| **Anonymous Feedback** | One-tap star rating to help us improve — completely anonymous |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, App Router, static export |
| Runtime | React 19 + Tailwind CSS v4 |
| Animation | Motion (Framer Motion v12) |
| Fonts | Libre Baskerville + Manrope (self-hosted, no CDN) |
| Storage | `localStorage` (sensitive fields AES-encrypted) |
| Feedback | Supabase (insert-only, no auth, graceful offline degradation) |
| Deployment | Vercel (`gracegrip.app`) |

---

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

Static output is written to `dist/` and deployed automatically by Vercel on every push to `main`.

## Content Validation

```bash
npm run validate:content
```

Run this after editing files in `content/` to verify schema and emotion references before opening a PR.

---

## Deployment

| Setting | Value |
|---------|-------|
| Live URL | https://gracegrip.app |
| Vercel project | `gracegrip-webapp` (team `aikusans-projects`) |
| CI gates | `npm audit` + `npm run lint` + `npm run build` (GitHub Actions) |
| Deploy trigger | Auto-deploy on push to `main` via Vercel Git integration |
| Search Indexing | Auto-pings Bing, DuckDuckGo, Yandex post-deploy via IndexNow |

---

## Content Notes

All app content lives in contributor-friendly JSON files:

- `content/verses.json` — Scripture library with emotion tags
- `content/devotionals.json` — Daily devotionals
- `content/emotions.json` — Emotion categories and prompts

Loaded via `src/content/loaders.js`.

---

## Contributing

See [CONTRIBUTING.md](internal_docs/CONTRIBUTING.md) for the review checklist, tone guidelines, and theology/safety standards.

---

## 🛡️ Branding & Forking

See [NOTICE.md](NOTICE.md) for the full attribution and forking policy.

**tl;dr:**
- **Code (MIT):** Free to fork, clone, and modify for personal or community use.
- **Brand (Protected):** "GraceGrip", the logo, and the "Walk in Freedom" tagline are IP of IKE / AIKUSAN. Forks must use a different name and visual identity.
- **Mission (Non-Negotiable):** No paywalls. No shame triggers. No privacy violations.
- **Attribution:** Retain the `© 2026 GraceGrip` copyright header in all source files.

---

## Disclaimer

GraceGrip provides spiritual and peer support content. It is **not** professional mental health care.
If you are in crisis, contact your local emergency services or a trusted crisis hotline in your region.
