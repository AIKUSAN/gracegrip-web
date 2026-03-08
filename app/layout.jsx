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
  title: 'GraceGrip — Faith Over Temptation',
  description:
    'A private, offline-first companion for accountability, scripture, and daily devotion. No account required.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'GraceGrip',
    description: 'Daily faith support — scripture, journaling, and accountability.',
    type: 'website',
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
        {/* Content Security Policy — enforced via meta tag for GitHub Pages static hosting.
            Re-express as an HTTP header in next.config.mjs if deploying to a server. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self' https://*.supabase.co; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; media-src 'self'; worker-src 'none';"
        />
        <meta name="referrer" content="no-referrer" />
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
