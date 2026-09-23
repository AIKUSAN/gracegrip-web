# GraceGrip

**Faith Over Temptation.** GraceGrip is a free, privacy-first recovery web app for people fighting porn and masturbation addiction — built on Scripture, grace, and practical tools that work without an account, a subscription, or recovery-data cloud sync.

[![Latest Release](https://img.shields.io/github/v/release/AIKUSAN/gracegrip-web?display_name=tag&label=release&color=2d6a4f&logo=github)](https://github.com/AIKUSAN/gracegrip-web/releases/latest)
[![Live Site](https://img.shields.io/website?url=https%3A%2F%2Fgracegrip.app&up_message=gracegrip.app&down_message=offline&label=live&color=1d4ed8)](https://gracegrip.app)

---

## Mission

Some people reach for their phone in a moment of temptation and find nothing that respects their privacy or their faith. GraceGrip exists to fill that gap — offering immediate, dignified support through Scripture, breathing exercises, devotionals, and encrypted journaling, without accounts or gatekeeping.

**We believe shame does not produce lasting change. Grace does.**

---

## Privacy Promise

- **No account required** — open the app and it works.
- **Recovery data stays on your device** — progress, journal, and favorites live in your browser only.
- **Sensitive data is encrypted** — journal entries and profile info are AES-encrypted via the Web Crypto API before being written to `localStorage`.
- **No advertising.** Cloudflare Web Analytics is loaded manually on the homepage only, with SPA tracking disabled. The beacon is absent from emergency, journal, and all other inner pages.
- **Optional feedback** sends a rating and optional message to Cloudflare D1. The form does not ask for identity; avoid adding identifying information to a note.

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
| **Optional Feedback** | Send a rating or note without creating an account |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, App Router, static export |
| Runtime | React 19 + Tailwind CSS v4 |
| Animation | Motion (Framer Motion v12) |
| Fonts | Libre Baskerville + Manrope (self-hosted, no CDN) |
| Storage | `localStorage` (sensitive fields AES-encrypted) |
| Feedback | Cloudflare Pages Function + D1; Neon is retained during migration and rollback |
| Deployment | Cloudflare Pages static export (migration branch); Vercel serves the live domain until approved cutover |

---

## Development

```bash
npm install
npm run dev
```

The feedback Function runs under Cloudflare Pages, not `next dev`. See [Cloudflare migration runbook](CLOUDFLARE_MIGRATION.md) for local D1 testing and the protected preview sequence.

## Production Build

```bash
npm run build
```

Static output is written to `out/`. Do not merge this branch to `main` while Vercel still deploys the live site. The current Vercel deployment remains the rollback source for 30 days after cutover.

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
| Cloudflare Pages | Protected preview first; bind separate preview and production D1 databases |
| CI gates | `npm audit` + lint + content + SEO + feedback tests + static build/export verification |
| Search Indexing | IndexNow and Search Console workflows run manually after verified cutover |

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
