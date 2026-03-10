# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| v1.0.0 (`main`) | ✅ Actively maintained |
| Any prior release | ❌ Not supported |

GraceGrip is a continuously deployed static web app. Only the current `main` branch receives security fixes.

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

To report a vulnerability, open a [GitHub Security Advisory](https://github.com/AIKUSAN/gracegrip-web/security/advisories/new) (private — visible only to maintainers). Include:

- A description of the vulnerability and its potential impact
- Steps to reproduce (URL, request/response, screenshots if applicable)
- Any suggested mitigations

**Response SLA:**
- Acknowledgement within **3 business days**
- Triage and status update within **7 business days**
- Fix or mitigation target within **30 days** for high/critical issues

## Scope

GraceGrip is a **privacy-first, offline-capable static web app**. There is no backend server, no user accounts, and no personal data stored remotely. The only external data surface is anonymous feedback submission (rating + optional message) stored in Supabase.

In-scope for this repo:

- Client-side XSS or injection vulnerabilities
- Content Security Policy bypasses
- Insecure localStorage handling
- Dependency vulnerabilities with client-side impact
- Logic flaws in the panic/recovery flows that could cause harm

Out-of-scope:

- Brute-force, rate limiting, or DDoS (no auth surface)
- Self-XSS requiring the user to run code in their own browser
- Vulnerabilities requiring physical device access

## Disclosure Policy

We follow **coordinated disclosure**. Please allow adequate time for a fix before any public disclosure. We will credit researchers who report valid, in-scope issues (if desired).

---

## Vulnerability Disclosure Policy (VDP)

### Our Commitment

GraceGrip is committed to the security of the people who use it — many of whom are in a vulnerable time in their lives. We take every good-faith security report seriously. We will work transparently with researchers to understand, reproduce, and fix any valid finding.

### Safe Harbor

If you conduct security research in good faith in accordance with this policy, we will:

- Not pursue civil or criminal action against you.
- Not file a complaint with law enforcement.
- Work with you to understand and reproduce the issue.
- Provide credit in our changelog or security advisories (if you want it).

Safe harbor applies when you:

1. Avoid accessing, modifying, or storing user data beyond what is necessary to demonstrate the vulnerability.
2. Do not perform denial-of-service testing or automated scanning at a volume that degrades the service.
3. Do not exploit a vulnerability beyond the minimum required to confirm it exists.
4. Report the vulnerability to us before disclosing it publicly.

### How to Report

Open a [GitHub Security Advisory](https://github.com/AIKUSAN/gracegrip-web/security/advisories/new) — this is private and visible only to maintainers. Include:

- **Summary:** A clear description of the vulnerability and its potential impact.
- **Steps to reproduce:** URL, request/response payloads, screenshots or screen recordings where applicable.
- **Suggested mitigation** (optional but appreciated).
- **Your preferred credit** (name, handle, or anonymous).

### Response Timeline

| Milestone | Target |
|-----------|--------|
| Acknowledgement | Within **3 business days** |
| Triage and severity assessment | Within **7 business days** |
| Fix or mitigation (high/critical) | Within **30 days** |
| Fix or mitigation (medium/low) | Within **90 days** |
| Public disclosure (coordinated) | After fix is deployed to `main` |

### Severity Guidance

We use a simplified severity scale based on real-world impact to users:

| Severity | Example |
|----------|---------|
| **Critical** | User data exfiltration; CSP bypass enabling remote code execution |
| **High** | XSS that can read encrypted localStorage keys; Supabase RLS bypass enabling unauthorized reads |
| **Medium** | Logic flaw in the panic/recovery flow; clickjacking (despite `frame-ancestors: none`) |
| **Low** | Missing security header; informational disclosure |

### What We Ask

- **Do not** open a public GitHub issue for security vulnerabilities.
- **Do not** disclose the issue publicly before we have had a reasonable opportunity to fix it.
- **Do not** access data belonging to other users (there are no user accounts, but Supabase feedback rows belong to the service).

### Acknowledgements

We are grateful to all researchers who have responsibly disclosed issues to us. A public list will be maintained here as the project matures.
