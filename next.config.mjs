/** @type {import('next').NextConfig} */
// GitHub Actions sets GITHUB_ACTIONS=true; used to enable the basePath needed
// for GitHub Pages subpath deployment (https://<user>.github.io/gracegrip-web/).
// Local dev keeps basePath empty so the dev server still works at /.
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

const nextConfig = {
  output: 'export',
  distDir: 'dist',
  reactStrictMode: true,
  // Subpath required for GitHub Pages project site.
  // Remove or update if deploying to a custom root domain.
  ...(isGitHubActions && { basePath: '/gracegrip-web' }),
  // NOTE: async headers() is not compatible with output:'export' (static sites).
  // Security headers are enforced via <meta> tags in app/layout.jsx for GitHub Pages.
  // If deploying to a server (Vercel, Netlify), re-add headers() here.
}

export default nextConfig
