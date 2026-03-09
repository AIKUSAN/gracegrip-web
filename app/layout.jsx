import { Libre_Baskerville, Manrope } from 'next/font/google'
import { Toaster } from 'sonner'
import { AppProvider } from '../src/context/AppContext'
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
  title: 'GraceGrip — Free Scripture-Based Addiction Recovery App',
  description:
    'GraceGrip is a free, privacy-first recovery app for porn and masturbation addiction. ' +
    'Scripture, daily devotions, urge management tools, and encrypted journaling — ' +
    'no account required, no data sent to servers.',
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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://gracegrip.app',
  },
  openGraph: {
    title: 'GraceGrip — Scripture-Based Addiction Recovery',
    description:
      'Free, private recovery support through Scripture, daily devotions, ' +
      'and practical urge-management tools. No account. No tracking.',
    url: 'https://gracegrip.app',
    siteName: 'GraceGrip',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'GraceGrip — Scripture-Based Addiction Recovery',
    description:
      'Free, private recovery support. No account, no tracking. ' +
      'Scripture, devotions, encrypted journal.',
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
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self' https://*.supabase.co; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; media-src 'self'; worker-src 'none';"
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
                'A free, privacy-first recovery app helping people overcome porn and masturbation addiction through Scripture, daily devotions, encrypted journaling, and practical urge-management tools. No account required.',
              applicationCategory: 'HealthApplication',
              operatingSystem: 'Web',
              browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
              inLanguage: 'en',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
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
      </head>
      <body style={{ fontFamily: 'var(--font-sans, Manrope, system-ui, sans-serif)' }}>
        <AppProvider>
          {children}
          <Toaster position="bottom-center" richColors />
        </AppProvider>
      </body>
    </html>
  )
}
