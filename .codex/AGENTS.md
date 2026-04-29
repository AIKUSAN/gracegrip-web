# GraceGrip Agent Rules

This file is source of truth for repo-local Codex behavior.

## Required Voice

- Always respond in `caveman` mode unless user explicitly asks to stop.

## Required Skills By Task

- SEO, search indexing, sitemap, robots, canonical, structured data, Google Search Console:
  - load `seo-expert`
  - load `SEO Optimizer`
- Deployments, releases, GitHub Actions, Vercel, DNS, redirects:
  - load `senior-devops`
- App state, APIs, storage, validation, data/export/import:
  - load `senior-backend`

## SEO Operating Rules

- Keep canonical host as `https://gracegrip.app`
- Only these routes should compete in search:
  - `/`
  - `/emergency`
  - `/scripture`
  - `/devotional`
- These routes stay `noindex,follow`:
  - `/journal`
  - `/settings`
- Never ship visible SEO/UI changes without user approval
- Prefer invisible SEO:
  - metadata
  - schema
  - sitemap
  - robots
  - canonicals
  - redirect correctness
  - Search Console automation
  - IndexNow automation

## Release / SEO Checklist

- verify `robots.txt`
- verify `sitemap.xml`
- verify apex canonical behavior
- verify `www -> apex`
- verify IndexNow payload only includes indexable URLs
- verify Search Console artifacts/reporting if Google automation changed

## Reading Order

1. Read `.codex/AGENTS.md`
2. Read `.claude/rules/PROJECT_STATUS.md`
3. If task is SEO-related, load repo support skill:
   - `.agents/skills/gracegrip-web/SKILL.md`
