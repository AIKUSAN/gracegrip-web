/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
import Script from 'next/script'
import { JsonLd } from '@/components/JsonLd'
import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { HomePage } from '@/components/pages/HomePage'

export default function Page() {
  const { appState, encouragementOfDay, greeting, verses, onStayedClean, onStumbledToday, checkedInToday } = useApp()
  const analyticsToken = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN

  return (
    <>
      {analyticsToken && (
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon={JSON.stringify({ token: analyticsToken, spa: false })}
        />
      )}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://gracegrip.app/#webpage',
          url: 'https://gracegrip.app/',
          name: 'GraceGrip — Private Support for the Change You Choose',
          description:
            'Free, private support for adults changing a habit or substance use. Practical Help Now tools, optional Christian encouragement, and a device-local journal.',
          inLanguage: 'en-US',
          isPartOf: {
            '@id': 'https://gracegrip.app/#website',
          },
          about: {
            '@id': 'https://gracegrip.app/#app',
          },
        }}
      />
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>GraceGrip — Private Support for the Change You Choose</h1>
          <p>
            GraceGrip offers free, private support for adults who want to change a habit or substance use.
            Explore seven focus areas, open Help Now without setup, and choose whether to use Scripture and prayer.
            Your journal stays on your device.
          </p>
          <h2>Features</h2>
          <ul>
            <li>Self-chosen private goals and check-ins</li>
            <li>Daily Scripture verses matched to your emotions</li>
            <li>Daily devotional reader with reflection and practice</li>
            <li>Help Now safety choices, breathing, grounding, and optional Scripture</li>
            <li>AES-encrypted private journal — stays on your device</li>
              <li>Core help is free without an account.</li>
          </ul>
          <h2>Why GraceGrip Helps</h2>
          <p>
            GraceGrip is a Christian mission open to adults of any belief. Prayer and Scripture are optional.
            This is nonclinical self-help, not diagnosis or emergency care.
          </p>
          <h2>Explore GraceGrip</h2>
          <ul>
            <li><Link href="/emergency">Help Now</Link> for safety choices and immediate tools.</li>
            <li><Link href="/focus">Focus areas</Link> for topic-specific starting points.</li>
            <li><Link href="/scripture">Scripture Library</Link> organized by temptation, shame, identity, peace, and strength.</li>
            <li><Link href="/devotional">Daily Devotional</Link> for reflection, encouragement, and practical next steps.</li>
          </ul>
        </main>
      </noscript>
      <AppShell allowBeforeOnboarding>
        <HomePage
          profileName={appState.profileName}
          encouragementOfDay={encouragementOfDay}
          greeting={greeting}
          streak={appState.streak}
          verses={verses}
          onStayedClean={onStayedClean}
          onStumbledToday={onStumbledToday}
          checkedInToday={checkedInToday}
        />
      </AppShell>
    </>
  )
}
