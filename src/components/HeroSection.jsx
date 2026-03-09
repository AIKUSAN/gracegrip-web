/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { DynamicLogo } from '@/components/ui/DynamicLogo'

const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor }

const transitionVariants = {
  container: {
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
      y: 10,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.22,
        duration: 0.9,
      },
    },
  },
}

export function HeroSection({
  mode = 'app',
  currentTheme,
  cycleThroughThemes,
  welcomeName,
  onWelcomeNameChange,
  onBeginJourney,
}) {
  const isWelcome = mode === 'welcome'
  const ThemeIcon = THEME_ICONS[currentTheme] || Monitor

  return (
    <section className={`hero hero-tailark ${isWelcome ? 'hero-welcome' : 'hero-main'}`}>
      <div className="hero-top-row">
        {!isWelcome && (
          <div className="hero-pill-row">
            <p className="privacy-pill">No account. No subscription. No tracking.</p>
            <p className="beta-pill">Public Beta</p>
          </div>
        )}
        <button
          type="button"
          className="theme-cycle-btn"
          onClick={cycleThroughThemes}
          aria-label="Cycle color theme"
          title="Toggle theme"
        >
          <ThemeIcon size={18} />
        </button>
      </div>

      <div className="brand-row hero-brand-row">
        <DynamicLogo size={56} className="brand-logo hero-logo-image" />
        <div className="hero-brand-copy">
          <h1>GraceGrip</h1>
          <p className="hero-kicker">A private, grace-first companion for the hard days.</p>
        </div>
      </div>

      {isWelcome ? (
        <>
          <TextEffect
            as="h2"
            preset="fade-in-blur"
            speedSegment={0.35}
            className="hero-main-title"
          >
            You don't have to fight alone
          </TextEffect>
          <TextEffect
            as="p"
            per="line"
            preset="fade-in-blur"
            speedSegment={0.35}
            delay={0.24}
            className="hero-copy"
          >
            GraceGrip helps men and women break free from pornography and masturbation through the power of Christ, Scripture, and grace-filled accountability tools. No shame. No judgment. Just freedom.
          </TextEffect>

          <div className="welcome-input-wrap">
            <label htmlFor="welcome-name">What should we call you? (optional)</label>
            <input
              id="welcome-name"
              value={welcomeName}
              onChange={(event) => onWelcomeNameChange(event.target.value)}
              placeholder="Your first name"
              className="welcome-input"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onBeginJourney()
                }
              }}
            />
          </div>

          <AnimatedGroup variants={transitionVariants} className="hero-action-row">
            <button className="btn-primary welcome-cta" onClick={onBeginJourney}>
              Begin Your Journey
            </button>
          </AnimatedGroup>
        </>
      ) : null}
    </section>
  )
}
