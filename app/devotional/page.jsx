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
            '31-day Scripture-based devotional plan for addiction recovery. Each day includes a passage, reflection, and daily practice.',
          isPartOf: { '@id': 'https://gracegrip.app/#app' },
        }}
      />
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>Daily Devotional — GraceGrip</h1>
          <p>
            GraceGrip&apos;s Daily Devotional is a 31-day Scripture-based devotional plan written
            specifically for people recovering from pornography and masturbation addiction. Each day
            provides a Bible passage selected for its relevance to recovery, a grace-first reflection
            that connects the passage to the practical experience of addiction and healing, and a
            concrete daily practice to carry into the day. The devotional rotates deterministically
            by day of year so every user reads the same entry on the same day — creating a shared
            rhythm without requiring an account or community signup. A completion tracker lets users
            mark days finished and build consistency over time. All progress is stored locally on
            the device and is never sent to servers. GraceGrip&apos;s devotional is free, requires
            no login, and is designed to complement — not replace — professional support.
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
            <li><Link href="/">Home</Link> for streak tracking and the broader recovery experience.</li>
            <li><Link href="/emergency">Emergency Urge Support</Link> for immediate help during intense temptation.</li>
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
