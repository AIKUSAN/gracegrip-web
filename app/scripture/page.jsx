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
  )
}
