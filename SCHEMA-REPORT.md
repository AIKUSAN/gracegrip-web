# GraceGrip Schema Audit

Audit date: 2026-05-02
Target: https://gracegrip.app/

Using cached site metadata from 2026-05-01T23:58:00Z and fresh live schema verification on 2026-05-02.

## Summary

Schema score: 66/100

GraceGrip is doing the hard part correctly: it ships valid JSON-LD in the initial HTML on all tested routes, and the core `SoftwareApplication`, `WebSite`, `Organization`, and route-level page schemas are syntactically sound. The main problems are strategic, not parsing-level:

- `FAQPage` is emitted sitewide even though the audited public pages do not visibly render those FAQs.
- `FAQPage` rich results are currently limited by Google to well-known authoritative government and health sites.
- `BreadcrumbList` is emitted sitewide as a list of major routes instead of a breadcrumb trail for the current page.
- The noindex utility routes still emit the same sitewide schema set, which adds noise without search benefit.

## Detection

- Primary format detected: JSON-LD
- Meaningful Microdata detected: No
- Meaningful RDFa detected: No
- Live JSON-LD blocks found:
  - Homepage: 5
  - `/emergency`: 6
  - `/scripture`: 6
  - `/devotional`: 6
  - `/journal`: 5
  - `/settings`: 5

## Validation Results

| Schema | Type | Status | Issues |
|--------|------|--------|--------|
| Home block 1 | `SoftwareApplication` | ✅ | Valid and appropriate |
| Home block 2 | `WebSite` | ✅ | Valid |
| Home block 3 | `Organization` | ✅ | Valid, though lightweight |
| Home block 4 | `FAQPage` | ⚠️ | Not visibly represented on the audited public pages and not likely eligible for GraceGrip under Google's current FAQ feature limits |
| Home block 5 | `BreadcrumbList` | ⚠️ | Represents a list of site routes, not the breadcrumb path for the current page |
| Emergency block 6 | `WebPage` | ✅ | Appropriate route-level page schema |
| Scripture block 6 | `CollectionPage` | ✅ | Appropriate route-level page schema |
| Devotional block 6 | `CollectionPage` | ✅ | Appropriate route-level page schema |

## What Is Good

- All detected JSON-LD blocks parsed successfully in the live HTML.
- `@context` and `@type` were present on the tested blocks.
- URLs in the tested JSON-LD were absolute.
- The most important app-level entity, `SoftwareApplication`, is present in the initial HTML rather than injected later.
- Route-level page schemas on `/emergency`, `/scripture`, and `/devotional` are directionally correct.

## Problems

### High Priority

1. `FAQPage` is misapplied for Google's current feature rules.
   - Google documents FAQ rich results as available only for well-known, authoritative government and health sites.
   - GraceGrip is a Christian recovery app, not a government or recognized health-authority publisher.
   - Even aside from eligibility, the audited public pages did not visibly present the FAQ questions and answers that the JSON-LD declares.

2. Breadcrumb markup is not route-accurate.
   - The sitewide `BreadcrumbList` names multiple routes on every page instead of describing the current page's path.
   - Google recommends breadcrumbs that represent a typical user path to a page.
   - Example: `/scripture` should look like `Home > Scripture Library`, not `Home > Emergency > Scripture > Devotional`.

### Medium Priority

1. Sitewide schema is duplicated onto noindex utility pages.
   - `/journal` and `/settings` are correctly marked `noindex, follow`, but they still emit the same sitewide `FAQPage` and `BreadcrumbList`.
   - This is not dangerous, but it adds markup noise without practical return.

2. The `Organization` entity is minimal.
   - It is valid, but it could be stronger with `sameAs` if there are canonical public profiles, or a clearer relationship to `AIKUSAN` if that is the publisher/creator identity you want engines to associate with GraceGrip.

3. The schema strategy is split instead of consolidated.
   - The current blocks work, but using a route-level `@graph` per page would make ownership and maintenance clearer.

## Recommended Schema Set

Keep:

- `SoftwareApplication`
- `WebSite`
- `Organization`
- Route-level `WebPage` or `CollectionPage`
- Route-accurate `BreadcrumbList` on pages where a breadcrumb trail makes sense

Remove or relocate:

- Sitewide `FAQPage`

### Best path for FAQ

If you want FAQ markup at all:

- Publish a visible FAQ section or dedicated FAQ page.
- Only mark up the exact visible questions and answers.
- Treat it as schema for understanding, not as something likely to generate a Google FAQ rich result for this site.

## Recommended Implementation Notes

1. Keep `SoftwareApplication` on the homepage and optionally on the public product routes.
2. Generate breadcrumb JSON-LD per route, not globally.
3. Keep route-level page schema:
   - `/emergency` -> `WebPage`
   - `/scripture` -> `CollectionPage`
   - `/devotional` -> `CollectionPage`
4. Do not emit `FAQPage` on pages that do not visibly contain the FAQs.
5. Consider dropping nonessential schema from `/journal` and `/settings` since those pages are intentionally `noindex`.

## Files and Evidence

- Current JSON-LD source is primarily defined in [app/layout.jsx](</C:/Users/IKE/Documents/My Professional Projects/GraceGrip-WebApp/app/layout.jsx>).
- Route metadata reviewed in:
  - [app/emergency/layout.jsx](</C:/Users/IKE/Documents/My Professional Projects/GraceGrip-WebApp/app/emergency/layout.jsx>)
  - [app/scripture/layout.jsx](</C:/Users/IKE/Documents/My Professional Projects/GraceGrip-WebApp/app/scripture/layout.jsx>)
  - [app/devotional/layout.jsx](</C:/Users/IKE/Documents/My Professional Projects/GraceGrip-WebApp/app/devotional/layout.jsx>)
  - [app/journal/layout.jsx](</C:/Users/IKE/Documents/My Professional Projects/GraceGrip-WebApp/app/journal/layout.jsx>)
  - [app/settings/layout.jsx](</C:/Users/IKE/Documents/My Professional Projects/GraceGrip-WebApp/app/settings/layout.jsx>)

## External Guidance Used

- Google general structured data guidelines
- Google breadcrumb structured data documentation
- Google FAQ structured data documentation

Those current docs are linked in the final summary below.
