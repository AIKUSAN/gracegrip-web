/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { ScripturePage } from '@/components/pages/ScripturePage'

export default function Page() {
  const {
    activeScriptureTab,
    setActiveScriptureTab,
    filteredVerses,
    appState,
    onFavoriteToggle,
    verses,
  } = useApp()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://gracegrip.app/scripture#page',
          url: 'https://gracegrip.app/scripture',
          name: 'Scripture Library — GraceGrip',
          description:
            'Optional Bible verses for temptation, identity, peace, strength, forgiveness, and freedom.',
          isPartOf: { '@id': 'https://gracegrip.app/#app' },
        }}
      />
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>Scripture Library — GraceGrip</h1>
          <p>
            GraceGrip&apos;s Scripture Library offers optional Christian reflection across temptation,
            identity, forgiveness, strength, peace, and freedom. You can save a verse on this device.
            Prayer and Scripture are not required to use Help Now or any practical focus guide.
          </p>
          <h2>Scripture Categories</h2>
          <ul>
            <li>Temptation — verses for moments of urge and craving</li>
            <li>Identity — who you are in Christ, not what you have done</li>
            <li>Peace — verses for anxiety, racing thoughts, and restlessness</li>
            <li>Strength — encouragement for the hard days of recovery</li>
            <li>Forgiveness — Scripture on grace, restoration, and fresh starts</li>
            <li>Favorites — save the verses that speak most to you</li>
          </ul>
          <h2>Related GraceGrip Resources</h2>
          <ul>
            <li><Link href="/">Home</Link> for daily progress and the main recovery tools.</li>
            <li><Link href="/emergency">Help Now</Link> for a safety choice and immediate tools.</li>
            <li><Link href="/devotional">Daily Devotional</Link> for reflection and practice rooted in Scripture.</li>
          </ul>
          <p>Free, private Scripture library. No account required.</p>
        </main>
      </noscript>
      <AppShell>
        <ScripturePage
          activeScriptureTab={activeScriptureTab}
          onChangeScriptureTab={setActiveScriptureTab}
          filteredVerses={filteredVerses}
          favoriteVerseIds={appState.favoriteVerseIds || []}
          onFavoriteToggle={onFavoriteToggle}
          verses={verses}
        />
      </AppShell>
    </>
  )
}
