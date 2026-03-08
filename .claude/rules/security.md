# Security Rules — GraceGrip WebApp

## Privacy-First Constraints

- **Zero runtime API calls.** No `fetch()`, `axios`, or `XMLHttpRequest` in app source. All content is bundled locally from `content/*.json` at build time.
- **No third-party tracking.** No analytics, telemetry, or crash-reporting SDKs.
- **No external script/CDN loads.** All fonts self-hosted via `next/font/google` at build time. No runtime Google Fonts requests.
- **No `console.log` / `console.warn` / `console.error` in production source.** Nothing may accidentally expose user state to the browser console.

## Content Security Policy

Enforced via `<meta httpEquiv>` in `app/layout.jsx` (required for static GitHub Pages — no HTTP header support):

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
font-src 'self';
img-src 'self' data: blob:;
connect-src 'self';
frame-src 'none';
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
worker-src 'none';
```

If migrating to a server host (Vercel/Netlify), move CSP to `next.config.mjs` `headers()` for stronger enforcement (meta CSP can be bypassed by injected content).

## Encrypted Storage

Sensitive localStorage fields are encrypted with AES via Web Crypto API (`src/utils/crypto.js`) before writing:
- `journalEntries`
- `profileName`
- `streakHistory`

Non-sensitive preferences (theme, streak count, reminder time) are stored in plaintext — acceptable, no PII.

**Rules:**
- Never store sensitive data in plaintext localStorage.
- Never add new sensitive fields without routing them through `crypto.js`.
- Storage key is `gracegrip_v1` — never rename without a deliberate migration path.

## Prohibited Patterns

- **No `dangerouslySetInnerHTML`.** React's default escaping prevents XSS. Never bypass it.
- **No external `<script>` or `<link>` tags.** Everything must be bundled or self-hosted.
- **No `eval()` or `new Function()`.** No dynamic code execution.
- **No `referrer` leakage.** `no-referrer` meta tag is set globally in `app/layout.jsx`.

## OWASP Top 10 (Static Client App)

| Risk | Status | Notes |
|------|--------|-------|
| A01 Broken Access Control | N/A | No server, no auth, no user accounts |
| A02 Cryptographic Failures | Mitigated | Journal/profile encrypted with AES (Web Crypto) |
| A03 Injection (XSS) | Mitigated | React escapes all interpolated values; no `dangerouslySetInnerHTML` |
| A04 Insecure Design | By design | Offline-first, no cloud sync, no account creation |
| A05 Security Misconfiguration | Mitigated | CSP active; `referrer: no-referrer`; `frame-ancestors: none` |
| A06 Vulnerable Components | Monitor | All deps current as of build date; run `npm audit` pre-deploy |
| A07 Auth Failures | N/A | No authentication surface |
| A08 Software Integrity | Mitigated | `package-lock.json` pins exact versions; GitHub Actions builds from lock |
| A09 Logging Failures | N/A | No server-side logging; no client telemetry |
| A10 SSRF | N/A | No server; no server-side requests |
