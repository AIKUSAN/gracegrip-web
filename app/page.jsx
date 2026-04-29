/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { HomePage } from '@/components/pages/HomePage'

export default function Page() {
  const { appState, encouragementOfDay, greeting, verses, onStayedClean, onStumbledToday, checkedInToday } = useApp()

  return (
    <>
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>GraceGrip — Free Scripture-Based Addiction Recovery App</h1>
          <p>
            GraceGrip is a free, private recovery app for porn and masturbation addiction.
            Track your clean streak, read daily Scripture and devotionals, manage urges with guided
            breathing and grounding tools, and write in an AES-encrypted private journal — no account
            required, no data ever sent to servers.
          </p>
          <h2>Features</h2>
          <ul>
            <li>Clean streak tracker with grace-first check-ins</li>
            <li>Daily Scripture verses matched to your emotions</li>
            <li>Daily devotional reader with reflection and practice</li>
            <li>Emergency urge support: breathing, grounding, panic verse</li>
            <li>AES-encrypted private journal — stays on your device</li>
            <li>No account. No tracking. Completely free.</li>
          </ul>
        </main>
      </noscript>
      <AppShell>
        <HomePage
          profileName={appState.profileName}
          encouragementOfDay={encouragementOfDay}
          greeting={greeting}
          streak={appState.streak}
          verses={verses}
          onStayedClean={onStayedClean}
          onStumbledToday={onStumbledToday}
          checkedInToday={checkedInToday}
        />
      </AppShell>
    </>
  )
}
