/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import packageJson from './package.json' with { type: 'json' }

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
}

export default nextConfig
