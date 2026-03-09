# GraceGrip

GraceGrip is a free, privacy-first recovery web app built to help people fight porn and masturbation habits through Scripture, encouragement, and practical urge-management tools.

Status: Public Beta

## Mission

Provide immediate support without requiring a login, subscription, or credit card.

## Privacy Promise

- No account required.
- No personal data sent to a backend.
- No tracking by default.
- Progress and favorites are stored only in the browser with `localStorage`.

## MVP Features

- Panic Button with a high-impact verse and 3-minute breathing/prayer exercise.
- Daily Bread short devotional reader.
- Clean Streak tracker (local only).
- Library of Truth grouped by emotions.
- Favorite verses saved locally.

## Tech Stack

- Next.js 16 (App Router, static export)
- React 19 + Tailwind CSS v4
- Deployed on Vercel (https://gracegrip.app)

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

Static output is written to `dist/` and deployed automatically by Vercel.

## Content Validation

```bash
npm run validate:content
```

Run this after editing files in `content/` to verify schema and emotion references before opening a PR.

## Deploying

The app is deployed on **Vercel** and auto-deploys on every push to `main`.

- **Live URL**: https://gracegrip.app
- **Vercel project**: `gracegrip-webapp` (team `aikusans-projects`)
- **CI gates** (`.github/workflows/deploy.yml`): audit + lint + build — no deploy steps

## Access Anywhere

Push to `main` — Vercel deploys automatically. Open https://gracegrip.app from any device.

## Content Notes

Core app content lives in contributor-friendly JSON files:

- `content/verses.json`
- `content/devotionals.json`
- `content/emotions.json`

The app loads these through `src/content/loaders.js`.

## Disclaimer

GraceGrip provides spiritual and peer support content. It is not professional mental health care.
If you are in crisis, contact local emergency services or a trusted crisis hotline in your region.
