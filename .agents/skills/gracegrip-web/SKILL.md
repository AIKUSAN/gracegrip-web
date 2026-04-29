---
name: gracegrip-web
description: GraceGrip repo support skill for SEO-safe work, deploy hygiene, and caveman communication defaults.
---

# GraceGrip Repo Skill

Use with `.codex/AGENTS.md`.

## Defaults

- Talk caveman.
- Do not change GraceGrip UI/UX during SEO work unless user asks.
- Treat apex `https://gracegrip.app` as only canonical host.

## Search Surface

Indexable public routes:
- `/`
- `/emergency`
- `/scripture`
- `/devotional`

Non-indexable utility routes:
- `/journal`
- `/settings`

## SEO Priorities

1. Crawlability
2. Canonical correctness
3. Structured data correctness
4. Sitemap and robots alignment
5. Search Console and IndexNow automation

## Deploy Priorities

- Keep GitHub Actions green
- Keep Vercel production stable
- Prefer invisible SEO changes over visible marketing content
