/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { DevotionalPage } from '@/components/pages/DevotionalPage'

export default function Page() {
  const { today, todayDevotional, appState, onToggleDevotionalDay } = useApp()

  return (
    <AppShell>
      <DevotionalPage
        today={today}
        todayDevotional={todayDevotional}
        devotionalCompletedDays={appState.devotionalCompletedDays || []}
        onToggleDevotionalDay={onToggleDevotionalDay}
      />
    </AppShell>
  )
}
