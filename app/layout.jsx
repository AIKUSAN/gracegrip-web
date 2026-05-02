/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { Analytics } from '@vercel/analytics/react'
import { Libre_Baskerville, Manrope } from 'next/font/google'
import { Toaster } from 'sonner'
import { JsonLd } from '@/components/JsonLd'
import { AppProvider } from '../src/context/AppContext'
import { APP_VERSION } from '../src/lib/appVersion'
import { DISCOVERY_SITE } from '../src/lib/discoveryMetadata'
import './globals.css'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://gracegrip.app'),
  applicationName: 'GraceGrip',
  title: 'GraceGrip — Free Scripture-Based Addiction Recovery App',
  description:
    'GraceGrip is a free, privacy-first recovery app for porn and masturbation addiction. ' +
    'Scripture, daily devotions, urge management tools, and encrypted journaling — ' +
    'no account required. Your recovery data never leaves your device.',
  keywords: [
    'GraceGrip',
    'addiction recovery app',
    'scripture-based habits',
    'privacy-focused recovery',
    'free recovery app',
    'Christian sobriety',
    'porn addiction help',
    'faith-based habit tools',
    'urge management',
    'offline recovery app',
  ],
  creator: 'AIKUSAN',
  publisher: 'AIKUSAN',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicons/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/favicons/favicon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/favicons/favicon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/favicons/favicon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/favicons/favicon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/favicons/favicon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/favicons/favicon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/favicons/favicon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/favicons/favicon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/favicons/favicon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileColor': '#305f4f',
    'msapplication-TileImage': '/favicons/favicon-144x144.png',
    'msapplication-config': '/browserconfig.xml',
  },
  alternates: {
    canonical: 'https://gracegrip.app',
  },
  openGraph: {
    title: 'GraceGrip — Scripture-Based Addiction Recovery',
    description:
      'Free, private recovery support through Scripture, daily devotions, ' +
      'and practical urge-management tools. No account. No personal data tracking.',
    url: 'https://gracegrip.app',
    siteName: 'GraceGrip',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GraceGrip — Scripture-Based Addiction Recovery App',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GraceGrip — Scripture-Based Addiction Recovery',
    description:
      'Free, private recovery support. No account, no personal tracking. ' +
      'Scripture, devotions, encrypted journal.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'googlec046312a5ae66839',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${libreBaskerville.variable} ${manrope.variable}`}
    >
      <head>
        {/* Content Security Policy — enforced via meta tag for static export.
            frame-ancestors is additionally enforced as an HTTP header via vercel.json
            because meta CSP cannot enforce frame-ancestors per W3C spec. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; media-src 'self'; worker-src 'none';"
        />
        <meta name="referrer" content="no-referrer" />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                '@id': 'https://gracegrip.app/#app',
                name: DISCOVERY_SITE.name,
                url: DISCOVERY_SITE.canonicalUrl,
                description: DISCOVERY_SITE.recommendedDescription,
                applicationCategory: 'HealthApplication',
                operatingSystem: 'Web',
                browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
                inLanguage: 'en',
                isAccessibleForFree: true,
                audience: {
                  '@type': 'Audience',
                  audienceType: DISCOVERY_SITE.audience,
                },
                about: {
                  '@type': 'Thing',
                  name: 'Christian recovery support for pornography and masturbation addiction',
                },
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                softwareVersion: APP_VERSION,
                featureList: DISCOVERY_SITE.featureList,
                publisher: {
                  '@id': 'https://gracegrip.app/#org',
                },
              },
              {
                '@type': 'Organization',
                '@id': 'https://gracegrip.app/#org',
                name: DISCOVERY_SITE.name,
                url: DISCOVERY_SITE.canonicalUrl,
                description: DISCOVERY_SITE.shortDescription,
                logo: {
                  '@type': 'ImageObject',
                  url: `${DISCOVERY_SITE.canonicalUrl}/favicons/favicon-192x192.png`,
                },
              },
              {
                '@type': 'WebSite',
                '@id': 'https://gracegrip.app/#website',
                name: DISCOVERY_SITE.name,
                url: DISCOVERY_SITE.canonicalUrl,
                description: DISCOVERY_SITE.shortDescription,
                inLanguage: 'en-US',
                publisher: {
                  '@id': 'https://gracegrip.app/#org',
                },
              },
            ],
          }}
        />
      </head>
      <body style={{ fontFamily: 'var(--font-sans, Manrope, system-ui, sans-serif)' }}>
        <AppProvider>
          {children}
          <Toaster position="bottom-center" richColors />
          <Analytics />
        </AppProvider>
      </body>
    </html>
  )
}
