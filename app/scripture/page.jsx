/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
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
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>Scripture Library — GraceGrip</h1>
          <p>
            GraceGrip&apos;s Scripture Library is a curated collection of Bible verses organized
            by the emotional landscape of addiction recovery. Every verse is selected for its direct
            relevance to pornography and masturbation addiction — not generic devotional content.
            Categories cover the full recovery experience: temptation (verses for moments of urge and
            craving), shame (grace-first Scripture that addresses guilt without condemnation), identity
            (reminders of who you are in Christ apart from your struggle), peace (verses for anxiety
            and restlessness), strength (encouragement for hard days), and forgiveness (Scripture on
            grace, restoration, and starting again). Users can save individual verses as favorites for
            quick access during difficult moments. The full library is available offline once loaded,
            requires no account, and stores no browsing history. It is the same verse set used in
            GraceGrip&apos;s emergency panic flow.
          </p>
          <h2>Scripture Categories</h2>
          <ul>
            <li>Temptation — verses for moments of urge and craving</li>
            <li>Shame — grace-first Scripture to combat shame and guilt</li>
            <li>Identity — who you are in Christ, not what you have done</li>
            <li>Peace — verses for anxiety, racing thoughts, and restlessness</li>
            <li>Strength — encouragement for the hard days of recovery</li>
            <li>Forgiveness — Scripture on grace, restoration, and fresh starts</li>
            <li>Favorites — save the verses that speak most to you</li>
          </ul>
          <h2>Related GraceGrip Resources</h2>
          <ul>
            <li><Link href="/">Home</Link> for daily progress and the main recovery tools.</li>
            <li><Link href="/emergency">Emergency Urge Support</Link> for immediate guided help during cravings.</li>
            <li><Link href="/devotional">Daily Devotional</Link> for reflection and practice rooted in Scripture.</li>
          </ul>
          <p>Free, private Scripture library. No account. No tracking.</p>
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
