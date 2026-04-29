/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { EmergencyPage } from '@/components/pages/EmergencyPage'

function EmergencyShellPlaceholder() {
  return (
    <div className="screen-stack">
      <section className="panel panel-wide">
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Loading your emergency recovery tools</h2>
        <p style={{ margin: 0 }}>
          GraceGrip is preparing the urge timer, grounding flow, and panic verses so they are ready when you need them.
        </p>
      </section>
    </div>
  )
}

export function EmergencyRouteClient() {
  const { stateLoaded, emergencyEncouragement, emergencyVerses, onCopyVerse, onStayedClean } = useApp()

  return (
    <AppShell>
      {stateLoaded ? (
        <EmergencyPage
          emergencyEncouragement={emergencyEncouragement}
          emergencyVerses={emergencyVerses}
          onCopyVerse={onCopyVerse}
          onStayedClean={onStayedClean}
        />
      ) : (
        <EmergencyShellPlaceholder />
      )}
    </AppShell>
  )
}
