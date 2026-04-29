/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { Analytics } from '@vercel/analytics/react'
import { Libre_Baskerville, Manrope } from 'next/font/google'
import { Toaster } from 'sonner'
import { AppProvider } from '../src/context/AppContext'
import { APP_VERSION } from '../src/lib/appVersion'
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
        {/* Schema.org JSON-LD — helps Google identify GraceGrip as a SoftwareApplication
            and enables rich results in search (ratings, category, price). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'GraceGrip',
              url: 'https://gracegrip.app',
              description:
                'A free, privacy-first recovery app helping people overcome porn and masturbation addiction through Scripture, daily devotions, encrypted journaling, and practical urge-management tools. No account required. Your recovery data never leaves your device.',
              applicationCategory: 'HealthApplication',
              operatingSystem: 'Web',
              browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
              inLanguage: 'en',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              softwareVersion: APP_VERSION,
              featureList: [
                'Panic button with guided breathing and Scripture',
                'Daily devotional reader',
                'Clean streak tracker',
                'Emotion-based Scripture library',
                'AES-encrypted private journal',
                'Anonymous feedback channel',
                'QR-based device transfer (no internet required)',
              ],
              author: {
                '@type': 'Organization',
                name: 'AIKUSAN',
                url: 'https://gracegrip.app',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'GraceGrip',
              url: 'https://gracegrip.app',
              description:
                'Private, Scripture-based recovery support for pornography and masturbation addiction.',
              inLanguage: 'en-US',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'GraceGrip',
              url: 'https://gracegrip.app',
              logo: 'https://gracegrip.app/favicons/favicon-192x192.png',
              description:
                'Privacy-first Christian recovery support through Scripture, devotionals, and practical urge-management tools.',
            }),
          }}
        />
        {/* FAQPage JSON-LD — enables expandable Q&A rich snippets in Google search results.
            Recovery apps are frequently searched via questions; this schema surfaces answers
            directly in the SERP without requiring backlinks or domain authority. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Is GraceGrip free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. GraceGrip is completely free — no subscription, no premium tier, no ads. It will always be free.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do I need to create an account to use GraceGrip?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No account is required. GraceGrip stores everything on your device. There is no sign-up, no email, and no password.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is my journal private?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Journal entries are encrypted with AES via the Web Crypto API before being saved. Your entries never leave your device and are never sent to any server.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does GraceGrip work offline?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. All Scripture, devotionals, and tools are bundled into the app at build time. Once loaded, GraceGrip works fully offline — no internet connection needed.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What addictions does GraceGrip support?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'GraceGrip is built primarily for pornography and masturbation addiction recovery, with a Scripture-based, grace-first approach. The tools — urge management, journaling, devotionals — can support any habit or addiction recovery journey.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is GraceGrip only for Christians?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'GraceGrip is rooted in Christian faith and uses Scripture as its primary source of encouragement. It is designed for people who find strength in their faith. Anyone is welcome to use it.',
                  },
                },
              ],
            }),
          }}
        />
        {/* BreadcrumbList JSON-LD — helps Google understand site hierarchy and generates rich snippets. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://gracegrip.app',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Emergency Help',
                  item: 'https://gracegrip.app/emergency',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Scripture Library',
                  item: 'https://gracegrip.app/scripture',
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  name: 'Daily Devotional',
                  item: 'https://gracegrip.app/devotional',
                },
                {
                  '@type': 'ListItem',
                  position: 5,
                  name: 'Encrypted Journal',
                  item: 'https://gracegrip.app/journal',
                },
              ],
            }),
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
