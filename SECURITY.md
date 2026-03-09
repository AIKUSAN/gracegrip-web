# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (`main`) | ✅ Actively maintained |
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
