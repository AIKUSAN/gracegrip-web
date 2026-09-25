/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { DevotionalPage } from '@/components/pages/DevotionalPage'

export default function Page() {
  const { today, todayDevotional, appState, onToggleDevotionalDay } = useApp()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://gracegrip.app/devotional#page',
          url: 'https://gracegrip.app/devotional',
          name: 'Daily Devotional — GraceGrip',
          description:
            'Optional daily Scripture reflection with a passage, prayer, and practical action step.',
          isPartOf: { '@id': 'https://gracegrip.app/#app' },
        }}
      />
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>Daily Devotional — GraceGrip</h1>
          <p>
            GraceGrip&apos;s daily devotional offers a Bible passage, reflection, optional prayer,
            and practical action step. The day&apos;s entry follows the calendar month. You may mark
            an entry complete on this device; missing a day is not a failure. This faith resource
            is free and optional, and it does not replace professional support.
          </p>
          <h2>What Each Devotional Includes</h2>
          <ul>
            <li>A Scripture passage relevant to recovery and healing</li>
            <li>A grace-first reflection connecting the passage to addiction recovery</li>
            <li>A practical daily practice to apply throughout the day</li>
            <li>A completion tracker to build consistency over time</li>
          </ul>
          <h2>Related GraceGrip Resources</h2>
          <ul>
            <li><Link href="/">Home</Link> for the next helpful action.</li>
            <li><Link href="/emergency">Help Now</Link> for a safety choice and immediate tools.</li>
            <li><Link href="/scripture">Scripture Library</Link> to browse recovery-focused verses by need.</li>
          </ul>
          <p>Free, private, no account required. Your progress stays on your device.</p>
        </main>
      </noscript>
      <AppShell>
        <DevotionalPage
          today={today}
          todayDevotional={todayDevotional}
          devotionalCompletedDays={appState.devotionalCompletedDays || []}
          onToggleDevotionalDay={onToggleDevotionalDay}
        />
      </AppShell>
    </>
  )
}
