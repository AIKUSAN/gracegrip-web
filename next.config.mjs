/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  reactStrictMode: true,
  // NOTE: async headers() is not compatible with output:'export' (static sites).
  // Security headers are enforced via <meta> tags in app/layout.jsx for GitHub Pages.
  // If deploying to a server (Vercel, Netlify), re-add headers() here.
}

export default nextConfig
