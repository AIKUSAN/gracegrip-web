# SECOPS_READY.md — GraceGrip WebApp Security Handover

> **Purpose:** Summarize all data flows, secrets management, and security posture for operational handover.
> **Date:** 2026-03-08
> **Scope:** Static Next.js client app deployed to GitHub Pages. No server runtime.

---

## 1. Data Flows

### 1A. Feedback Submission (only network-bound data flow)

```
User fills feedback form (rating 1–5, optional message)
  → SettingsPage.jsx calls onSubmitFeedback(rating, message)
  → AppContext.jsx: onSubmitFeedback()
      ├── null-guard: if (!supabase) return { ok: false, error: 'Feedback not configured.' }
      └── supabase.from('user_feedback').insert({ rating, message })
            → HTTPS/TLS POST to https://gddjygjydwjjgdlcwbhh.supabase.co
```

**What is stored in Supabase `user_feedback`:**

| Column | Type | Source | Notes |
|---|---|---|---|
| `id` | UUID | Auto (Supabase) | Never sent by client |
| `rating` | SMALLINT | User input (1–5) | |
| `message` | TEXT | User input | Optional, nullable |
| `created_at` | TIMESTAMPTZ | Auto (Supabase) | `now()` default |

**What is NOT stored:** profile name, journal entries, streak data, mood selections, IP address (no server-side logging), session tokens, device info.

### 1B. Local-Only Data (never leaves device)

All other app state lives in localStorage under key `gracegrip_v1`.

Sensitive fields are AES-GCM encrypted via Web Crypto API before write:
- `journalEntries`
- `profileName`
- `streakHistory`

Non-sensitive fields stored plaintext (no PII):
- `themePreference`, `streakCount`, `lastCheckIn`, `reminder.enabled`, `reminder.time`, `lastExportDate`, `favoriteVerseIds`, `moodHistory`

---

## 2. Credentials & Secrets

### Environment Variables

| Variable | Scope | Exposure | Safe? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side | In JS bundle (by design) | ✅ Yes — public project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side | In JS bundle (by design) | ✅ Yes — anon key only |

`NEXT_PUBLIC_` prefix is a Next.js convention that intentionally inlines the value into the client bundle. **This is expected and correct.** Anon keys are designed to be public.

**No `service_role` key exists anywhere in the codebase or build output. Confirmed by scan.**

### Where Credentials Are Set

- **Local dev:** `.env.local` (gitignored via `.gitignore`)
- **CI/CD:** GitHub Actions Secrets → `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Template:** `.env.local.example` (committed, no real values)

### What Happens Without Credentials

`src/lib/supabase.js` initializes the client only when both env vars are set:

```js
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
```

`onSubmitFeedback` has a null guard — silently returns `{ ok: false }` if `supabase` is null. No crash, no data loss.

---

## 3. Supabase Configuration

| Setting | Value |
|---|---|
| Project ref | `gddjygjydwjjgdlcwbhh` |
| Region | `us-east-2` |
| Table | `user_feedback` |
| RLS | Enabled |
| Anon policy | `anon_insert` — INSERT only for `anon` role |
| Read/Update/Delete | **Blocked for `anon` role** |

**Migrations:**
- `supabase/migrations/001_user_feedback.sql` — creates `user_feedback` table + initial `anon_insert` RLS policy
- `supabase/migrations/002_tighten_feedback_policy.sql` — replaces `anon_insert` policy with tightened `WITH CHECK` constraints; adds column-level `CHECK` constraint

**`anon_insert` RLS `WITH CHECK` (migration 002):**

| Column | Constraint |
|---|---|
| `rating` | `BETWEEN 1 AND 5` |
| `message` | `IS NULL OR char_length(message) <= 2000` |
| `user_id` | `IS NULL` (anon submissions only) |
| `category` | `IS NULL` (reserved field, blocked) |

**Column constraint:** `user_feedback_message_length CHECK (message IS NULL OR char_length(message) <= 2000)` — enforced at DB level independent of RLS.

---

## 4. Content Security Policy

Enforced via `<meta httpEquiv>` in `app/layout.jsx` (required for GitHub Pages — no HTTP header support):

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
font-src 'self';
img-src 'self' data: blob:;
connect-src 'self' https://*.supabase.co;
frame-src 'none';
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
worker-src 'none';
```

`connect-src https://*.supabase.co` permits the feedback POST. All other outbound requests are blocked.

---

## 5. OWASP Top 10 Status

| Risk | Status | Evidence |
|---|---|---|
| A01 Broken Access Control | N/A | No server, no auth, no user accounts |
| A02 Cryptographic Failures | Mitigated | Journal/profile/streakHistory encrypted AES-GCM via Web Crypto API |
| A03 Injection (XSS) | Mitigated | React escapes all interpolated values; `dangerouslySetInnerHTML` prohibited by rule |
| A04 Insecure Design | By design | Offline-first; only anonymous aggregated feedback hits network |
| A05 Security Misconfiguration | Mitigated | CSP active; `referrer: no-referrer`; `frame-ancestors: none`; Supabase RLS INSERT-only |
| A06 Vulnerable Components | Monitor | All deps current as of 2026-03-08; run `npm audit` pre-deploy |
| A07 Auth Failures | N/A | No authentication surface |
| A08 Software Integrity | Mitigated | `package-lock.json` pins exact versions; GitHub Actions builds from lock file |
| A09 Logging Failures | N/A | No server-side logging; no client telemetry |
| A10 SSRF | N/A | No server; no server-side requests |

---

## 6. Build Audit Results (2026-03-08)

| Check | Result |
|---|---|
| `npm run build` — 9/9 static routes | ✅ Pass |
| `service_role` / `apikey` in `dist/` | ✅ None found |
| `SUPABASE_SERVICE` in `dist/` | ✅ None found |
| `NEXT_PUBLIC_SUPABASE_URL` in bundle | ✅ Expected — anon URL only |
| Anon key (`eyJ…`) in bundle | ✅ Expected — `NEXT_PUBLIC_` by design |
| `supabase` / `createClient` in bundle | ✅ Present — feedback feature live |

---

## 7. QR Transfer (Peer-to-Peer State Export)

`src/components/QRTransfer.jsx` — no network calls. Pure browser-to-browser via QR code.

- **Export path:** `onExportData()` serializes localStorage state → QR code rendered client-side
- **Import path:** `onQRImport(stateJson)` → `importStateFromJson()` validates + merges → `setAppState()`
- **Network:** None. `html5-qrcode` loaded via dynamic `import()` (SSR-safe), camera access only.
- **Risk:** User could scan a malicious QR; `importStateFromJson` in `storage.js` is the validation boundary. Ensure it rejects malformed payloads (currently returns `null` on parse failure — safe).

---

## 8. GitHub Actions CI/CD

Workflow: `.github/workflows/deploy.yml`
- Triggers on push to `main`
- Uses `npm ci` (lock-pinned install)
- Injects `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` from GitHub Secrets
- Uploads `./dist` as GitHub Pages artifact
- No `service_role` key required or used at build time

---

## 9. Pre-Deploy Checklist

```bash
npm ci                    # Reproducible install from lock file
npm audit                 # No high/critical vulnerabilities
npm run lint              # ESLint — zero warnings
npm run build             # Static export — 9/9 routes
npm run validate:content  # Content schema check
```

Manual: verify panic flow, streak, backup export/import, mobile layout, dark mode.
