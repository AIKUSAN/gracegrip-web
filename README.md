# GraceGrip

**Faith Over Temptation.** GraceGrip is a free Christian self-help app. The live 1.2.3 release serves people seeking support with pornography and sexual habits. The 1.3.0 maintenance changes are in a preview branch. GraceGrip 2.0 is being built for adults worldwide who choose to change a habit or seek help around substance use, with practical tools and prayer or Scripture by choice.

[![Latest Release](https://img.shields.io/github/v/release/AIKUSAN/gracegrip-web?display_name=tag&label=release&color=2d6a4f&logo=github)](https://github.com/AIKUSAN/gracegrip-web/releases/latest)
[![Live Site](https://img.shields.io/website?url=https%3A%2F%2Fgracegrip.app&up_message=gracegrip.app&down_message=offline&label=live&color=1d4ed8)](https://gracegrip.app)

---

## Mission

Some people reach for their phone in a difficult moment and need a private, useful next step. GraceGrip offers immediate support without an account or gatekeeping. The 2.0 direction adds seven self-chosen paths: alcohol, pornography and sexual habits, anger and conflict, nicotine and vaping, gambling, gaming and digital habits, and other drug use. Choosing a path does not label someone with an addiction. Stress, loneliness, grief, and relationship pressure are related support topics.

**We believe shame does not produce lasting change. Grace does.**

---

## Privacy Promise

- **No account required for public help** — Help Now and public guidance work without signing in.
- **The journal stays on your device** — 2.0 membership may sync only goals, check-ins, and emblems that you explicitly choose.
- **Sensitive data is encrypted** — journal entries and profile info are AES-encrypted via the Web Crypto API before being written to `localStorage`.
- **No advertising.** Cloudflare Web Analytics is loaded manually on the homepage only, with SPA tracking disabled. The beacon is absent from emergency, journal, and all other inner pages.
- **Optional anonymous feedback** sends a rating and optional message to Cloudflare D1. The form cannot receive a reply. Daily cleanup clears notes once they are older than 90 days; ratings remain. Avoid adding identifying information.
- **Contact email** is separate from the form. `contact@gracegrip.app` forwards through Cloudflare to a private inbox for product questions and feedback. Replies may come from that inbox's address. It is not an urgent help channel.

---

## Live 1.3 features

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

## GraceGrip 2.0 development branch

This branch prepares the Clear Current redesign, seven focus guides, an optional daily plan, private progress and botanical emblems, a Help Now puzzle, static Resources drafts, passkey membership, hosted community controls, a limited AI reflection pilot, and a private article editor. **These are not live features.** The seven guides and nine article pages are drafts awaiting qualified and owner review. Account, community, email, AI, and editorial services fail closed until their separate Cloudflare bindings and secrets are verified. The Android Trusted Web Activity still needs a Play developer account, signing identity, Digital Asset Links, and closed testing.

`npm run verify:v2-release` is intentionally failing until the evidence in `docs/v2-release-evidence.json` is complete. The protected `main` build must pass it before a 2.0 merge. The current Cloudflare 1.3 app remains public throughout this work.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, App Router, static export |
| Runtime | React 19 + Tailwind CSS v4 |
| Animation | Motion (Framer Motion v12) |
| Fonts | Libre Baskerville + Manrope (self-hosted, no CDN) |
| Live storage | `localStorage` (sensitive fields AES-encrypted) |
| Feedback | Cloudflare Pages Function + D1; a scheduled Worker clears note text after 90 days |
| 2.0 private services | Separate account, community, and editorial D1 stores; a hosted-session Durable Object; Workers AI fallback; model artifacts on R2 after verification |
| Deployment | Cloudflare Pages static export from `main`; Vercel and Neon are retained only for rollback through October 23, 2026 |

---

## Development

```bash
npm install
npm run dev
```

Pages Functions do not run under `next dev`. See [Cloudflare migration runbook](CLOUDFLARE_MIGRATION.md) for the live feedback Function and [2.0 release runbook](docs/V2_RELEASE_RUNBOOK.md) for the private services and protected preview gates.

## Production Build

```bash
npm run build
```

Static output is written to `out/`. Cloudflare Pages deploys protected `main`. The last Vercel deployment remains a rollback source through October 23, 2026; its Git deployment is disconnected.

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
| Cloudflare Pages | `main` is production; protected preview uses a separate D1 database |
| Feedback retention | Daily scheduled Worker clears D1 note text older than 90 days; review notes weekly |
| Contact | Cloudflare Email Routing forwards `contact@gracegrip.app` to a verified private inbox |
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

GraceGrip provides self-guided spiritual encouragement. It is **not** professional mental health care or a monitored crisis service.
If you are in crisis, contact your local emergency services or a trusted crisis hotline in your region.
