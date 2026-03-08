'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { HomePage } from '@/components/pages/HomePage'

export default function Page() {
  const { appState, encouragementOfDay, greeting, verses, onStayedClean, onStumbledToday } = useApp()

  return (
    <AppShell>
      <HomePage
        profileName={appState.profileName}
        encouragementOfDay={encouragementOfDay}
        greeting={greeting}
        streak={appState.streak}
        verses={verses}
        onStayedClean={onStayedClean}
        onStumbledToday={onStumbledToday}
      />
    </AppShell>
  )
}
