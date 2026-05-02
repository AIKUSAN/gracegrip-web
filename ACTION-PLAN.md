# GraceGrip SEO Action Plan

Audit date: 2026-05-01
Target: https://gracegrip.app/

## Critical

No critical blockers found.

## High

1. Correct the structured data strategy.
   - Remove the sitewide `FAQPage` schema from pages that do not visibly contain those FAQs.
   - Replace the sitewide breadcrumb block with route-specific breadcrumbs.
   - Outcome: higher schema trust and lower risk of Google ignoring rich-result markup.

2. Increase public content depth.
   - Expand the homepage with crawlable sections for who GraceGrip is for, what makes it private, how the tools work, and who should use which route.
   - Expand `/scripture`, `/devotional`, and `/emergency` with question-led sections and more specific recovery-language copy.
   - Outcome: broader keyword coverage and stronger AI-citation value.

3. Strengthen server-delivered internal linking.
   - Ensure public routes expose crawlable anchor links in the initial HTML layer, not only after client rendering.
   - Outcome: more resilient discovery and better page authority flow.

## Medium

1. Add `og:image` to `/emergency`, `/scripture`, and `/devotional`.
   - Reuse the existing preview system or set per-page images.
   - Outcome: more reliable preview cards across social and messaging platforms.

2. Shorten the homepage meta description.
   - Target roughly 145 to 160 characters while preserving the core promise.
   - Outcome: tighter SERP snippet control.

3. Reduce unused JavaScript on the homepage.
   - Audit client bundles and animation dependencies on the public routes.
   - Outcome: better mobile LCP and overall performance score.

4. Resolve Lighthouse best-practice warnings.
   - Review the blocked Cloudflare Insights beacon and the CSP interaction.
   - Confirm whether analytics scripts should be allowed or removed.
   - Outcome: cleaner console, fewer trust warnings, better best-practices score.

5. Fix the CTA contrast issue.
   - Increase contrast on the `Begin Your Journey` button to at least 4.5:1.
   - Outcome: stronger accessibility and cleaner Lighthouse output.

## Low

1. Improve branded search clarity.
   - Publish more crawlable brand-supporting content that clearly associates `GraceGrip` with Christian addiction recovery and the `.app` domain.
   - Outcome: less ambiguity with the unrelated `gracegrip.com` brand in search results.

2. Consider a public FAQ destination page.
   - If FAQ rich results are a priority, publish the FAQ content visibly on a public route and attach `FAQPage` schema there.
   - Outcome: legitimate rich-result eligibility without schema mismatch.
