/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowRight, BookOpen, BookMarked, CheckCircle2, PenLine, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { StreakRing } from '@/components/StreakRing'
import { DailyVerse } from '@/components/DailyVerse'

const quickActions = [
  {
    href: '/emergency',
    label: 'Emergency',
    description: 'I need help right now',
    Icon: AlertTriangle,
    accent: true,
  },
  {
    href: '/scripture',
    label: 'Scripture',
    description: 'Browse verses',
    Icon: BookOpen,
  },
  {
    href: '/devotional',
    label: 'Devotional',
    description: 'Daily reflection',
    Icon: BookMarked,
  },
  {
    href: '/journal',
    label: 'Journal',
    description: 'Write it out',
    Icon: PenLine,
  },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
}

const tile = {
  hidden: { opacity: 0, y: 24, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const quickCard = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
}

const welcomeValueProps = [
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

export function HomePage({
  profileName,
  encouragementOfDay,
  greeting,
  streak,
  verses,
  onStayedClean,
  onStumbledToday,
  checkedInToday,
  showOnboardingPrompt,
  welcomeName,
  onWelcomeNameChange,
  onBeginJourney,
}) {
  return (
    <motion.div className="legacy-dashboard" variants={stagger} initial="hidden" animate="visible">
      {showOnboardingPrompt && (
        <motion.section className="panel panel-wide" variants={tile}>
          <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Start your journey in GraceGrip</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: '1rem' }}>
            Begin privately. Add a first name if you want a personal greeting, then step into a grace-first recovery rhythm.
          </p>

          <div className="welcome-input-wrap" style={{ marginBottom: '1rem' }}>
            <label htmlFor="welcome-name-inline">What should we call you? (optional)</label>
            <input
              id="welcome-name-inline"
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

          <div className="actions-row" style={{ marginBottom: '1rem' }}>
            <button className="btn-primary" onClick={onBeginJourney}>
              Begin Your Journey
            </button>
          </div>

          <div className="welcome-value-grid">
            {welcomeValueProps.map((prop) => (
              <article key={prop.title} className="welcome-value-card">
                <h3>{prop.title}</h3>
                <p>{prop.description}</p>
              </article>
            ))}
          </div>
        </motion.section>
      )}

      <motion.div className="home-greeting-inline" variants={tile}>
        <p className="home-greeting-salutation">{greeting}, {profileName || 'friend'} 👋</p>
        <p className="home-greeting-encouragement">{encouragementOfDay || 'You are not alone in this journey.'}</p>
      </motion.div>

      <motion.section className="panel legacy-streak-panel streak-panel-enhanced" variants={tile}>
        <StreakRing count={streak.count} longest={streak.longest || 0} />
        <div className="legacy-streak-best">
          <Trophy size={16} aria-hidden="true" /> Best: <strong>{streak.longest || 0} days</strong>
        </div>
        <div className="actions-row">
          <button className="btn-primary" onClick={onStayedClean} disabled={checkedInToday}>
            {checkedInToday
              ? <><CheckCircle2 size={14} aria-hidden="true" /> Checked in today</>
              : 'I stayed clean today'}
          </button>
          <button className="btn-ghost" onClick={onStumbledToday}>I stumbled today</button>
        </div>
        {checkedInToday && (
          <p className="streak-tomorrow-note">Come back tomorrow to keep your streak going.</p>
        )}
        <p className="grace-note">If you stumble, the counter resets. God&apos;s love does not.</p>
      </motion.section>

      <motion.section className="panel legacy-verse-panel" variants={tile}>
        <h2>Today's Verse</h2>
        <DailyVerse verses={verses} />
      </motion.section>

      <motion.section className="panel panel-wide legacy-quick-actions-panel" variants={tile}>
        <h2>Quick Path</h2>
        <motion.div
          className="legacy-quick-grid"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
        >
          {quickActions.map(({ href, label, description, Icon, accent }) => (
            <motion.div key={href} variants={quickCard}>
              <Link className={`legacy-quick-card${accent ? ' legacy-quick-card-accent' : ''}`} href={href}>
                <div className={`legacy-quick-icon-badge${accent ? ' legacy-quick-icon-badge-accent' : ''}`}>
                  <Icon size={22} />
                </div>
                <div className="legacy-quick-card-body">
                  <strong>{label}</strong>
                  <span>{description}</span>
                </div>
                <span className="quick-arrow">Open <ArrowRight size={16} /></span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
