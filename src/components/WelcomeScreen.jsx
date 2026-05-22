/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { HeroSection } from '@/components/HeroSection'

const WELCOME_VALUE_PROPS = [
  {
    title: 'Privacy-First',
    description: 'Your data stays on this device. No account, no tracking, no forced cloud sync.',
  },
  {
    title: 'Scripture-Powered',
    description: 'Curated verses and devotionals to steady your thoughts and strengthen your spirit.',
  },
  {
    title: 'Practical Tools',
    description: 'Breathing, grounding, and emergency actions designed for hard moments.',
  },
]

export function WelcomeScreen({
  currentThemePreference,
  cycleThroughThemes,
  welcomeName,
  onWelcomeNameChange,
  onBeginJourney,
}) {
  return (
    <div className="welcome-shell">
      <main className="welcome-main">
        <HeroSection
          mode="welcome"
          currentTheme={currentThemePreference}
          cycleThroughThemes={cycleThroughThemes}
          welcomeName={welcomeName}
          onWelcomeNameChange={onWelcomeNameChange}
          onBeginJourney={onBeginJourney}
        />

        <section className="welcome-value-grid">
          {WELCOME_VALUE_PROPS.map((prop) => (
            <article key={prop.title} className="welcome-value-card">
              <h3>{prop.title}</h3>
              <p>{prop.description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
