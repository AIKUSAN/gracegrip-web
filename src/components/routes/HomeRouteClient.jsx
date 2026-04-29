/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { HomePage } from '@/components/pages/HomePage'

function HomeShellPlaceholder() {
  return (
    <div className="screen-stack">
      <section className="panel panel-wide">
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Preparing your private recovery dashboard</h2>
        <p style={{ margin: 0 }}>
          GraceGrip is loading your streak, saved verses, and encrypted journal from this device.
          Nothing is sent to a server.
        </p>
      </section>
    </div>
  )
}

export function HomeRouteClient() {
  const {
    stateLoaded,
    appState,
    encouragementOfDay,
    greeting,
    verses,
    onStayedClean,
    onStumbledToday,
    checkedInToday,
    welcomeName,
    setWelcomeName,
    onBeginJourney,
  } = useApp()

  return (
    <AppShell>
      {stateLoaded ? (
        <HomePage
          profileName={appState.profileName}
          encouragementOfDay={encouragementOfDay}
          greeting={greeting}
          streak={appState.streak}
          verses={verses}
          onStayedClean={onStayedClean}
          onStumbledToday={onStumbledToday}
          checkedInToday={checkedInToday}
          showOnboardingPrompt={!appState.onboardingComplete}
          welcomeName={welcomeName}
          onWelcomeNameChange={setWelcomeName}
          onBeginJourney={onBeginJourney}
        />
      ) : (
        <HomeShellPlaceholder />
      )}
    </AppShell>
  )
}
