/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { ScripturePage } from '@/components/pages/ScripturePage'

function ScriptureShellPlaceholder() {
  return (
    <div className="screen-stack">
      <section className="panel panel-wide">
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Loading your Scripture library</h2>
        <p style={{ margin: 0 }}>
          GraceGrip is preparing recovery verses, emotion categories, and saved highlights from this device.
        </p>
      </section>
    </div>
  )
}

export function ScriptureRouteClient() {
  const {
    stateLoaded,
    activeScriptureTab,
    setActiveScriptureTab,
    filteredVerses,
    appState,
    onFavoriteToggle,
    verses,
  } = useApp()

  return (
    <AppShell>
      {stateLoaded ? (
        <ScripturePage
          activeScriptureTab={activeScriptureTab}
          onChangeScriptureTab={setActiveScriptureTab}
          filteredVerses={filteredVerses}
          favoriteVerseIds={appState.favoriteVerseIds || []}
          onFavoriteToggle={onFavoriteToggle}
          verses={verses}
        />
      ) : (
        <ScriptureShellPlaceholder />
      )}
    </AppShell>
  )
}
