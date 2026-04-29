/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import packageJson from './package.json' with { type: 'json' }

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  // output: 'export' removed — Vercel hybrid mode:
  //   • All app/* pages are still statically generated at build time (no dynamic data)
  //   • app/api/* route handlers run as Vercel edge/serverless functions
  //   • End-user experience is identical; Vercel CDN-caches all static pages
  //   • Unlocks next/og at /api/og for live social card rendering
  //
  // Security headers are enforced via <meta> tags in app/layout.jsx (CSP)
  // and via vercel.json HTTP headers (X-Frame-Options, Referrer-Policy, etc.).
  // Deployment: Vercel (gracegrip.app) — no basePath needed.
}

export default nextConfig
