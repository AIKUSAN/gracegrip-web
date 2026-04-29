/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

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
            Browse a curated library of Bible verses organized by emotion and need.
            Find Scripture for temptation, shame, fear, identity, peace, and strength —
            each verse selected to speak directly into the struggles of addiction recovery.
          </p>
          <h2>Scripture Categories</h2>
          <ul>
            <li>Temptation — verses for moments of urge and craving</li>
            <li>Shame — grace-first Scripture to combat shame and guilt</li>
            <li>Identity — who you are in Christ, not what you have done</li>
            <li>Peace — verses for anxiety, racing thoughts, and restlessness</li>
            <li>Strength — encouragement for the hard days of recovery</li>
            <li>Favorites — save the verses that speak most to you</li>
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
