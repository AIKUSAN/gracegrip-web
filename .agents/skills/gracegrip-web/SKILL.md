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

## Skill Loading Map

Use these skill bundles by task type.

### SEO / Search

- `seo-expert`
- `SEO Optimizer`

### Deploy / Infra / Release

- `senior-devops`

### Backend / Data / App Logic

- `senior-backend`

### Frontend / UI / Design

- `senior-frontend`
- `frontend-design`
- `ui-ux-pro-max`

### Component System / shadcn

- `build-web-apps:shadcn`

### Security

- `senior-security`

### Architecture

- `senior-architect`

### Full-Stack Delivery

- `senior-fullstack`

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

## Frontend Priorities

- Keep GraceGrip UI intentional and clean
- Preserve established UX unless user asks for redesign
- Keep desktop and mobile both strong
- Do not let SEO work degrade hero sections or core flows

## Security / Architecture Priorities

- Protect secrets, domain config, auth, and private data paths
- Favor simple, durable architecture over flashy complexity
- Treat release, deploy, search, and data work as full-stack changes
