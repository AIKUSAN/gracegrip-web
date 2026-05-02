# GraceGrip SEO Audit

Audit date: 2026-05-01
Target: https://gracegrip.app/

## Executive Summary

Overall SEO Health Score: 80/100

GraceGrip has a strong baseline for a small product site: clean indexation controls, a valid sitemap, clear page targeting, canonical tags, and unusually good AI-search preparation through `llms.txt` and `llms-full.txt`. The main weaknesses are not fundamentals like robots or duplicate canonicals. They are discoverability depth and trust of the signals being sent: very thin public landing-page copy, structured data that does not accurately match on-page content, missing Open Graph images on subpages, and mobile performance that is dragged down by unused JavaScript.

## Site Scope Crawled

- `https://gracegrip.app/`
- `https://gracegrip.app/emergency`
- `https://gracegrip.app/scripture`
- `https://gracegrip.app/devotional`
- Verified `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`
- Checked `noindex` handling on `/journal` and `/settings`

## Top Issues

### Critical

None found. The site is indexable, canonicalized, and publicly crawlable.

### High

1. Structured data is over-declared and partly mismatched to visible page content.
   - The root layout injects `FAQPage` schema sitewide, but the audited public pages do not visibly expose those FAQs in the page content.
   - The root layout also injects one `BreadcrumbList` that lists multiple site routes on every page instead of representing the current page's breadcrumb path.
   - Risk: Google may ignore these schema blocks or treat them as low-trust markup.

2. Public content depth is too thin for competitive organic discovery.
   - The four indexed public pages each expose roughly 102 to 115 words in the server-delivered HTML audit pass.
   - Messaging is clear, but each page is closer to a concise landing panel than a search-winning destination page.
   - Risk: weak long-tail coverage, low citation value for AI answers, and limited relevance breadth for queries beyond brand terms.

3. Internal discovery is fragile in the non-JS HTML layer.
   - The public routes are implemented as client pages with a `noscript` fallback. The initial fetched HTML surfaces summary copy, but not a robust internal link graph.
   - Search engines that fully render JavaScript can still discover deeper routes, but the server-delivered layer is doing less work than it could.
   - Risk: weaker crawl resilience and weaker page-to-page relevance flow.

### Medium

1. Secondary pages are missing `og:image`.
   - `/emergency`, `/scripture`, and `/devotional` expose `og:title`, `og:description`, and `og:url`, but no `og:image` in the fetched HTML.
   - `twitter:image` is present, so social previews are only partially configured.

2. Homepage meta description is likely too long.
   - Homepage description length: 228 characters.
   - This will often truncate in search snippets and weakens message control.

3. Mobile performance is acceptable but not strong.
   - Local Lighthouse run on 2026-05-01 scored the homepage at:
   - Mobile: Performance 74, SEO 100, Accessibility 96, Best Practices 73
   - Desktop: Performance 99, SEO 100, Accessibility 96, Best Practices 73
   - Main performance drag: unused JavaScript, estimated savings 105 KiB on mobile.

4. Best-practices issues are hurting trust signals.
   - Lighthouse logged console and DevTools issues tied to CSP behavior and a blocked Cloudflare Insights beacon.
   - One mobile accessibility issue is also present: the `Begin Your Journey` button contrast ratio is 4.02:1 instead of 4.5:1.

### Low

1. Search-result visibility appears very limited today.
   - A live web search on 2026-05-01 did not surface `gracegrip.app` pages prominently for `site:gracegrip.app` or `GraceGrip gracegrip.app`.
   - The strongest surfaced results were for an unrelated `gracegrip.com` brand, which suggests brand-query ambiguity and/or very light index presence.

## Detailed Findings

## Technical SEO

### What is working

- Homepage, `robots.txt`, and `sitemap.xml` all return `200 OK`.
- `robots.txt` allows public crawling and correctly blocks `/api/`.
- Sitemap is declared in `robots.txt`.
- `sitemap.xml` lists the four intended public routes with `lastmod`.
- HTTPS is enforced.
- Strong security headers are present, including HSTS, `x-frame-options`, `x-content-type-options`, `referrer-policy`, and `permissions-policy`.
- Private utility routes behave correctly for search:
  - `/journal` -> `noindex, follow`
  - `/settings` -> `noindex, follow`

### Risks

- The public pages are primarily client-rendered experiences wrapped in `use client` pages with `noscript` fallback content.
- This is not an indexing failure, but it means the non-rendered HTML layer is relatively shallow.

## On-Page SEO

### Strengths

- All four public pages have unique titles and descriptions.
- Canonicals are present and correct on all four pages.
- Each public page exposes a single `h1`.
- Page targeting is clear:
  - Home: addiction recovery app
  - Emergency: urge support
  - Scripture: recovery-oriented Bible verses
  - Devotional: daily devotional for recovery

### Opportunities

- Home description is too long for reliable snippet control.
- The public pages do not yet offer enough body copy to compete for broader intent clusters such as:
  - Christian porn addiction help
  - Bible verses for temptation
  - daily devotional for addiction recovery
  - emergency urge help Christian

## Content Quality

### Strengths

- The value proposition is clear and consistent.
- Trust language is strong: privacy-first, no account, no tracking, encrypted journal.
- Audience alignment is unusually focused, which helps topical clarity.

### Gaps

- Indexed content is thin and repetitive across pages.
- There is limited evidence of supporting topical depth such as:
  - recovery guidance content
  - explanatory FAQ content visible on-page
  - authored devotional examples on crawlable pages
  - page sections that answer adjacent user questions in natural language

## Schema and Structured Data

### Present

- `SoftwareApplication`
- `WebSite`
- `Organization`
- `FAQPage`
- `BreadcrumbList`
- Page-specific `WebPage` or `CollectionPage` schema on the subpages

### Main issue

- The site has more schema than it has matching visible content on the audited public pages.
- The biggest offenders are the sitewide FAQ and breadcrumb blocks.

### Recommended fix

- Keep `SoftwareApplication`, `WebSite`, `Organization`, and page-specific `WebPage` or `CollectionPage`.
- Move `FAQPage` onto a page that visibly renders the same FAQ entries.
- Generate breadcrumbs per route instead of one sitewide list of major pages.

## Performance

Local Lighthouse evidence captured on 2026-05-01:

- Mobile:
  - Performance: 74
  - SEO: 100
  - Accessibility: 96
  - Best Practices: 73
  - FCP: 1.15 s
  - LCP: 4.48 s
  - Speed Index: 4.72 s
  - TBT: 314 ms
  - CLS: 0
- Desktop:
  - Performance: 99
  - SEO: 100
  - Accessibility: 96
  - Best Practices: 73
  - FCP: 0.33 s
  - LCP: 0.92 s
  - Speed Index: 0.76 s
  - TBT: 0 ms
  - CLS: 0

Top performance opportunity:

- Reduce unused JavaScript
  - Estimated savings: 105 KiB on mobile, 139 KiB on desktop

## Images and Social Sharing

### Working

- Homepage exposes `og:image`.
- `twitter:image` is present on the public pages.

### Needs improvement

- Secondary public pages do not expose `og:image`.
- That can lead to inconsistent previews in platforms that rely on Open Graph rather than Twitter card inheritance.

## AI Search Readiness

This is one of GraceGrip's strongest areas.

- `llms.txt` exists and is useful.
- `llms-full.txt` exists and provides route guidance, audience framing, and clear exclusions for utility pages.
- The copy clearly explains purpose, audience, privacy model, and best citation URLs.

Main AI-search limitation:

- The public pages themselves remain thin, so the AI-readability layer is stronger than the indexed landing-page depth behind it.

## Evidence Notes

- Live fetch checks were run directly against `https://gracegrip.app/` on 2026-05-01.
- Public search-result checks were run on 2026-05-01.
- Google PageSpeed API was unavailable due quota exhaustion at audit time, so performance scoring comes from local Lighthouse runs against the live site.
- Playwright visual verification was attempted, but the required local browser extension was not installed in this environment.

## Recommended Priority Order

1. Fix schema accuracy.
2. Expand public page depth, starting with Home and Scripture.
3. Strengthen crawlable internal linking in server-delivered HTML where practical.
4. Add `og:image` to the three secondary public pages.
5. Trim homepage meta description and reduce unused JavaScript.
