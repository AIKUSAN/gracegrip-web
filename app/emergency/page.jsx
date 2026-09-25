/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { EmergencyPage } from '@/components/pages/EmergencyPage'

export default function Page() {
  const { emergencyVerses, onCopyVerse, onStayedClean } = useApp()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://gracegrip.app/emergency#page',
          url: 'https://gracegrip.app/emergency',
          name: 'Help Now — GraceGrip',
          description:
            'Choose a safety route or use private breathing, grounding, and optional Scripture tools.',
          isPartOf: { '@id': 'https://gracegrip.app/#app' },
        }}
      />
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>Help Now — GraceGrip</h1>
          <p>
            Choose whether you need emergency, medical, or personal safety help before opening
            optional breathing, grounding, and Scripture tools. If someone may have overdosed,
            is having trouble breathing, or is unsafe, contact local emergency services. GraceGrip
            is nonclinical self-help and cannot provide emergency care. No account is required.
          </p>
          <h2>What the Emergency Page Includes</h2>
          <ul>
            <li>Safety choice before ordinary support tools</li>
            <li>Optional three-minute pause and tile puzzle</li>
            <li>Guided breathing — box breathing and 4-7-8 techniques</li>
            <li>Grounding exercises — the 5-4-3-2-1 sensory method</li>
            <li>Optional Scripture</li>
          </ul>
          <h2>Related GraceGrip Resources</h2>
          <ul>
            <li><Link href="/">Home</Link> for the full recovery overview and daily check-ins.</li>
            <li><Link href="/scripture">Scripture Library</Link> for recovery-focused Bible verses by category.</li>
            <li><Link href="/devotional">Daily Devotional</Link> for ongoing reflection and habit change.</li>
          </ul>
          <p>Free, private, no account required. A legacy check-in can be stored on this device.</p>
        </main>
      </noscript>
      <AppShell allowBeforeOnboarding>
        <EmergencyPage
          emergencyVerses={emergencyVerses}
          onCopyVerse={onCopyVerse}
          onStayedClean={onStayedClean}
        />
      </AppShell>
    </>
  )
}
