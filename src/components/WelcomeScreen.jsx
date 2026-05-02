/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
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

        <section className="welcome-discover" aria-labelledby="welcome-discover-title">
          <div className="welcome-discover-copy">
            <h2 id="welcome-discover-title">Explore GraceGrip</h2>
            <p>
              Private recovery support through emergency urge help, Scripture, and
              daily devotionals.
            </p>
          </div>

          <nav className="welcome-discover-links" aria-label="Public GraceGrip pages">
            <Link href="/emergency" className="welcome-discover-link">
              Emergency Urge Support
            </Link>
            <Link href="/scripture" className="welcome-discover-link">
              Scripture Library
            </Link>
            <Link href="/devotional" className="welcome-discover-link">
              Daily Devotional
            </Link>
          </nav>
        </section>
      </main>
    </div>
  )
}
