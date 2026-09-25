/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { HeroSection } from '@/components/HeroSection'

const WELCOME_VALUE_PROPS = [
  {
    title: 'Privacy-First',
    description: 'Public tools work without an account. Your journal stays on this device.',
  },
  {
    title: 'Faith by choice',
    description: 'Prayer and Scripture are available when you want them.',
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
