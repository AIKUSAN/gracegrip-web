# GraceGrip — Live Security Certificate

> **Production URL**: https://gracegrip.app  
> **Audit Date**: 2026-03-09  
> **Audited By**: GitHub Copilot (Claude Sonnet 4.6) — live browser + response header verification  
> **Status**: ✅ ALL CONTROLS PASSED

---

## Transport & Protocol

| Control | Status | Evidence |
|---------|--------|----------|
| HTTPS enforced | ✅ PASS | `location.protocol === 'https:'` — confirmed in live browser |
| HTTP Strict Transport Security (HSTS) | ✅ PASS | `strict-transport-security: max-age=63072000` (2 years) |
| No mixed content | ✅ PASS | 0 HTTP resources loaded across 19 total resources |

---

## HTTP Security Headers (live — verified via HEAD request)

| Header | Status | Value |
|--------|--------|-------|
| `X-Frame-Options` | ✅ PASS | `DENY` |
| `X-Content-Type-Options` | ✅ PASS | `nosniff` |
| `Referrer-Policy` | ✅ PASS | `no-referrer` |
| `Permissions-Policy` | ✅ PASS | `camera=(), microphone=(), geolocation=(), payment=()` |
| `Content-Security-Policy` (HTTP) | ✅ PASS | `frame-ancestors 'none'` |

All 5 headers injected by `vercel.json` on every route (`/(.*)`).

> **CSP Design Note**: `frame-ancestors 'none'` is enforced at the HTTP header level (W3C spec prohibits `frame-ancestors` in `<meta>` CSP). The full resource-loading CSP policy (`default-src`, `script-src`, `font-src`, etc.) is enforced via `<meta httpEquiv>` in `app/layout.jsx`. Only `frame-ancestors` lives in the HTTP header to avoid additive CSP enforcement conflicts.

---

## Content Security Policy (meta tag — app/layout.jsx)

| Directive | Value |
|-----------|-------|
| `default-src` | `'self'` |
| `script-src` | `'self' 'unsafe-inline'` |
| `style-src` | `'self' 'unsafe-inline'` |
| `font-src` | `'self'` |
| `img-src` | `'self' data: blob:` |
| `connect-src` | `'self' https://*.supabase.co` |
| `frame-src` | `'none'` |
| `object-src` | `'none'` |
| `base-uri` | `'self'` |
| `form-action` | `'self'` |
| `worker-src` | `'none'` |

---

## Network Privacy

| Control | Status | Evidence |
|---------|--------|----------|
| Zero external domains | ✅ PASS | `externalDomains: []` across all 19 loaded resources |
| Zero trackers | ✅ PASS | `trackers: []` — no analytics, telemetry, or crash-reporting SDKs |
| No runtime CDN loads | ✅ PASS | Fonts self-hosted at build via `next/font/google`; CSP `font-src 'self'` enforces |
| No third-party scripts | ✅ PASS | All JS bundled locally; no external `<script>` tags |

---

## Encryption at Rest

| Field | Status | Evidence |
|-------|--------|----------|
| `journalEntries` | ✅ ENCRYPTED | `{"__enc":true,"iv":"tkIIKx5SJs/s1M4x","ct":"08GySovrRqIa87GR8LlIjdw8"}` |
| `profileName` | ✅ ENCRYPTED | `{"__enc":true,"iv":"vMu6tvf6Q7EZijzK","ct":"g+bjfI1u0cpjDDWH..."}` |
| `streakHistory` | ✅ ENCRYPTED | `{"__enc":true,"iv":"...","ct":"..."}` |
| `streak` (count) | ✅ PLAINTEXT OK | Non-PII integer — no encryption required |
| `themePreference` | ✅ PLAINTEXT OK | Non-PII string — no encryption required |

Encryption algorithm: **AES-GCM 256-bit** via Web Crypto API (`src/utils/crypto.js`).

---

## localStorage Isolation

| Control | Status | Evidence |
|---------|--------|----------|
| Keys present | ✅ PASS | `gracegrip_v1`, `gracegrip_ek_v1` only |
| Zero third-party keys | ✅ PASS | No analytics, session, or tracking keys found |

---

## OWASP Top 10 (Static Client Application)

| Risk | Status | Notes |
|------|--------|-------|
| A01 Broken Access Control | ✅ N/A | No server, no auth, no user accounts |
| A02 Cryptographic Failures | ✅ PASS | AES-GCM 256 on all sensitive fields; HTTPS + HSTS enforced |
| A03 Injection (XSS) | ✅ PASS | React escapes all output; no `dangerouslySetInnerHTML`; no `eval()` |
| A04 Insecure Design | ✅ PASS | Offline-first, privacy-by-design; no cloud sync of personal data |
| A05 Security Misconfiguration | ✅ PASS | All 5 HTTP security headers live; CSP active; `referrer: no-referrer`; `frame-ancestors: none` |
| A06 Vulnerable Components | ✅ PASS | `npm audit` → 0 vulnerabilities |
| A07 Auth Failures | ✅ N/A | No authentication surface |
| A08 Software Integrity | ✅ PASS | `package-lock.json` pins exact versions; `npm ci` in CI |
| A09 Logging Failures | ✅ PASS | Zero `console.log/warn/error` in production source; no client telemetry |
| A10 SSRF | ✅ N/A | No server; no server-side requests |

---

## Supabase (Feedback Feature)

| Control | Status | Notes |
|---------|--------|-------|
| Row-Level Security | ✅ PASS | Migration 002 — INSERT-only `WITH CHECK` (rating range, message length cap, null user_id/category enforced) |
| Column constraints | ✅ PASS | DB-level CHECK constraint on feedback table |
| Client initialization | ✅ PASS | Null-safe — only initializes when env vars present; no-ops silently otherwise |

---

## Dependency Audit

```
npm audit — 0 vulnerabilities found
```

Audit run: 2026-03-09 as part of CI gate (`.github/workflows/deploy.yml`).

---

## Deployment Configuration

- **Platform**: Vercel — auto-deploys from `main` branch
- **Build**: `next build` → static export (`output: 'export'`, `distDir: 'dist'`)
- **Security headers**: `vercel.json` — injected on all routes
- **CI gate**: Lint + build + `npm audit` must pass before Vercel deploys
- **Commit with headers**: `a902d8b` — "feat(security): add vercel.json security headers; update docs to Vercel/gracegrip.app"

---

*This certificate reflects the live state of https://gracegrip.app as verified on 2026-03-09. Re-audit after any dependency upgrade, CSP policy change, or new feature that adds external network requests.*
