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

- React + Vite
- Static hosting on GitHub Pages

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Content Validation

```bash
npm run validate:content
```

Run this after editing files in `content/` to verify schema and emotion references before opening a PR.

## Deploying to GitHub Pages

1. Keep repository name as `GraceGrip-WebApp` or update `basePath` in `next.config.mjs`.
2. Build app with `npm run build`.
3. Publish with the GitHub Actions workflow in `.github/workflows/deploy.yml`.
4. Access URL pattern: `https://<your-github-username>.github.io/GraceGrip-WebApp/`

## Access Anywhere

1. Push this project to GitHub on branch `main`.
2. In repository settings, set GitHub Pages source to `GitHub Actions`.
3. Open `https://<your-github-username>.github.io/GraceGrip-WebApp/` from any device.

## Content Notes

Core app content lives in contributor-friendly JSON files:

- `content/verses.json`
- `content/devotionals.json`
- `content/emotions.json`

The app loads these through `src/content/loaders.js`.

## Disclaimer

GraceGrip provides spiritual and peer support content. It is not professional mental health care.
If you are in crisis, contact local emergency services or a trusted crisis hotline in your region.
