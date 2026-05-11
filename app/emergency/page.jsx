/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
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
            GraceGrip&apos;s Emergency Urge Support is a free, private tool built for moments of
            intense pornography or masturbation temptation. When a craving hits, the emergency flow
            guides you through four sequential steps: a timed urge-surfing countdown to ride out the
            peak of the craving without acting on it, guided breathing exercises using box and 4-7-8
            patterns to calm the nervous system, grounding exercises using the 5-4-3-2-1 sensory
            method to reconnect with the present moment, and a Scripture verse chosen specifically
            for moments of struggle and temptation. Research in addiction recovery shows urges
            typically peak and subside within minutes when not acted on. GraceGrip&apos;s emergency
            flow gives you structured, faith-based tools to get through that window. No login required.
            Nothing is recorded. Everything stays on your device.
          </p>
          <h2>What the Emergency Page Includes</h2>
          <ul>
            <li>Urge timer — visual countdown to ride out the craving peak</li>
            <li>Guided breathing — box breathing and 4-7-8 techniques</li>
            <li>Grounding exercises — the 5-4-3-2-1 sensory method</li>
            <li>Panic Scripture — Bible verses chosen for temptation moments</li>
          </ul>
          <h2>Related GraceGrip Resources</h2>
          <ul>
            <li><Link href="/">Home</Link> for the full recovery overview and daily check-ins.</li>
            <li><Link href="/scripture">Scripture Library</Link> for recovery-focused Bible verses by category.</li>
            <li><Link href="/devotional">Daily Devotional</Link> for ongoing reflection and habit change.</li>
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
