/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { EmergencyPage } from '@/components/pages/EmergencyPage'

export default function Page() {
  const { emergencyEncouragement, emergencyVerses, onCopyVerse, onStayedClean } = useApp()

  return (
    <>
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>Emergency Urge Support — GraceGrip</h1>
          <p>
            When temptation strikes, GraceGrip walks you through a step-by-step emergency flow:
            a urge timer to ride out the craving, guided breathing exercises to calm your nervous system,
            grounding techniques to reconnect with the present moment, and Scripture specifically chosen
            for moments of temptation and struggle.
          </p>
          <h2>What the Emergency Page Includes</h2>
          <ul>
            <li>Urge timer — wait out the craving with a visual countdown</li>
            <li>Guided breathing — box breathing and 4-7-8 techniques</li>
            <li>Grounding exercises — the 5-4-3-2-1 sensory method</li>
            <li>Panic Scripture — Bible verses for moments of temptation</li>
          </ul>
          <p>Free, private, no account required. Your data never leaves your device.</p>
        </main>
      </noscript>
      <AppShell>
        <EmergencyPage
          emergencyEncouragement={emergencyEncouragement}
          emergencyVerses={emergencyVerses}
          onCopyVerse={onCopyVerse}
          onStayedClean={onStayedClean}
        />
      </AppShell>
    </>
  )
}
