/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { DevotionalPage } from '@/components/pages/DevotionalPage'

function DevotionalShellPlaceholder() {
  return (
    <div className="screen-stack">
      <section className="panel panel-wide">
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Loading today&apos;s devotional journey</h2>
        <p style={{ margin: 0 }}>
          GraceGrip is preparing today&apos;s reflection and your progress for this month&apos;s Scripture plan.
        </p>
      </section>
    </div>
  )
}

export function DevotionalRouteClient() {
  const { stateLoaded, today, todayDevotional, appState, onToggleDevotionalDay } = useApp()

  return (
    <AppShell>
      {stateLoaded ? (
        <DevotionalPage
          today={today}
          todayDevotional={todayDevotional}
          devotionalCompletedDays={appState.devotionalCompletedDays || []}
          onToggleDevotionalDay={onToggleDevotionalDay}
        />
      ) : (
        <DevotionalShellPlaceholder />
      )}
    </AppShell>
  )
}
