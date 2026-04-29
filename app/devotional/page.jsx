/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { DevotionalPage } from '@/components/pages/DevotionalPage'

export default function Page() {
  const { today, todayDevotional, appState, onToggleDevotionalDay } = useApp()

  return (
    <>
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>Daily Devotional — GraceGrip</h1>
          <p>
            A new Scripture-based devotional every day of the year — written specifically for
            people in addiction recovery. Each devotional includes a Bible passage, a reflection
            on what it means for your recovery journey, and a practical daily practice to apply.
          </p>
          <h2>What Each Devotional Includes</h2>
          <ul>
            <li>A Scripture passage relevant to recovery and healing</li>
            <li>A grace-first reflection on the passage</li>
            <li>A practical daily practice to carry into your day</li>
            <li>A completion tracker to build consistency</li>
          </ul>
          <p>
            Devotionals rotate daily based on the day of year. Free, private, no account required.
            Your progress stays on your device.
          </p>
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
