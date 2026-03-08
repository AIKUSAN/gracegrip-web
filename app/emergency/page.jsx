'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { EmergencyPage } from '@/components/pages/EmergencyPage'

export default function Page() {
  const { emergencyEncouragement, emergencyVerses, onCopyVerse, onStayedClean } = useApp()

  return (
    <AppShell>
      <EmergencyPage
        emergencyEncouragement={emergencyEncouragement}
        emergencyVerses={emergencyVerses}
        onCopyVerse={onCopyVerse}
        onStayedClean={onStayedClean}
      />
    </AppShell>
  )
}
