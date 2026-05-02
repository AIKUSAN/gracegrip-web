# GraceGrip Technical SEO Audit

Audit date: 2026-05-02
Target: https://gracegrip.app/

Using cached site metadata from 2026-05-01T23:58:00Z and fresh live verification on 2026-05-02.

## Technical Score

85/100

## Category Breakdown

| Category | Status | Score |
|----------|--------|-------|
| Crawlability | warn | 86/100 |
| Indexability | pass | 89/100 |
| Security | warn | 84/100 |
| URL Structure | warn | 83/100 |
| Mobile | warn | 85/100 |
| Core Web Vitals | warn | 74/100 |
| Structured Data | warn | 66/100 |
| JavaScript Rendering | warn | 76/100 |
| IndexNow | pass | 96/100 |

## What Passed

- `robots.txt` is live, accessible, and allows public crawling while blocking `/api/`.
- `sitemap.xml` is live and lists the four intended public URLs.
- Public routes return `200` and expose canonical tags and `index, follow`.
- Private utility routes `/journal` and `/settings` correctly expose `noindex, follow`.
- HTTPS is enforced with HSTS.
- Security headers are present:
  - `Strict-Transport-Security`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
- Viewport metadata is present on all tested pages.
- IndexNow is implemented in the repo and the verification key is live at:
  - `https://gracegrip.app/1a497fa5-7965-4791-b2a9-46aa47c55114.txt`

## High Priority Issues

1. JavaScript rendering is still doing too much of the SEO work.
   - The public routes are `use client` pages with `noscript` fallbacks.
   - In the fetched raw HTML for `/`, `/emergency`, `/scripture`, and `/devotional`, `rawAnchorCount` was `0`.
   - That means internal linking and richer page content depend heavily on client rendering, which weakens crawl resilience.

2. Structured data is broader than the visible page content.
   - Sitewide `FAQPage` and `BreadcrumbList` JSON-LD are emitted from the root layout on pages where the visible route content does not fully match that schema.
   - This is unlikely to help technical SEO and may reduce trust in the markup.

3. Mobile Core Web Vitals need work.
   - Local Lighthouse evidence captured on 2026-05-01T23:48Z:
   - Mobile performance `74`
   - LCP `4.48s`
   - TBT `314ms`
   - CLS `0`
   - Largest gap: unused JavaScript, estimated savings `105 KiB`

## Medium Priority Issues

1. Redirect normalization has one avoidable chain.
   - `http://gracegrip.app/` -> `301` -> `https://gracegrip.app/`
   - `https://www.gracegrip.app/` -> `308` -> `https://gracegrip.app/`
   - `http://www.gracegrip.app/` -> `308` -> `https://www.gracegrip.app/` -> `308` -> `https://gracegrip.app/`
   - The `http://www` variant should ideally land on the canonical destination in one hop.

2. CSP delivery is internally inconsistent.
   - The live HTTP `Content-Security-Policy` header is only `frame-ancestors 'none'`.
   - The broader CSP is delivered via `<meta http-equiv="Content-Security-Policy">`.
   - Lighthouse logged security warnings because `frame-ancestors` inside meta CSP is ignored by browsers, and the active policy also blocked the Cloudflare Insights beacon.

3. AI crawler preferences are only partly explicit.
   - `robots.txt` includes `Content-Signal: search=yes, ai-input=yes, ai-train=no`.
   - This is a Cloudflare content-signals pattern, but there are no explicit crawler-specific `User-agent` rules such as `GPTBot`, `ClaudeBot`, or `Google-Extended`.
   - If stricter AI crawler control is desired, explicit agent rules or Cloudflare AI Crawl Control should be added.

## Low Priority Issues

1. Root canonical formatting is slightly inconsistent with the fetched final URL.
   - Final homepage URL resolved to `https://gracegrip.app/`
   - Canonical is `https://gracegrip.app`
   - This is usually treated as equivalent, so it is only a cleanup item.

2. Field CWV data was not available in this run.
   - Google PageSpeed API quota was exhausted at audit time.
   - Current CWV conclusions are based on local Lighthouse lab data against the live site, not CrUX field data.

## Recommended Fix Order

1. Move more public-route content and internal links into the initial server-delivered HTML.
2. Fix schema accuracy by removing sitewide FAQ and breadcrumb overreach.
3. Cut unused JavaScript on the public pages to improve mobile LCP.
4. Collapse the `http://www` redirect chain to a single hop.
5. Move the full CSP to response headers if possible and align it with analytics usage.
6. Decide whether AI crawler restrictions should stay signal-based or become crawler-specific.

## Evidence Notes

- Live verification was performed against:
  - `https://gracegrip.app/`
  - `https://gracegrip.app/emergency`
  - `https://gracegrip.app/scripture`
  - `https://gracegrip.app/devotional`
  - `https://gracegrip.app/journal`
  - `https://gracegrip.app/settings`
  - `https://gracegrip.app/robots.txt`
  - `https://gracegrip.app/sitemap.xml`
- Local Lighthouse artifacts were read from `.seo-cache/lighthouse/`.
- IndexNow key verification was checked live.
