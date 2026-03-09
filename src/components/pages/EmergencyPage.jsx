/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useState } from 'react'
import { Phone, Footprints, Droplets, HandHeart, Copy, ShieldCheck, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { UrgeTimer } from '@/components/UrgeTimer'
import { BreathingExercise } from '@/components/BreathingExercise'
import { GroundingExercise } from '@/components/GroundingExercise'

const QUICK_ACTIONS = [
  { Icon: Phone, label: 'Call a trusted friend', description: 'Isolation is the enemy — one honest conversation breaks its grip.' },
  { Icon: Footprints, label: 'Leave the room', description: 'Physically move. Walk outside, change your environment right now.' },
  { Icon: Droplets, label: 'Cold water on face', description: '20 seconds of cold water resets your nervous system on the spot.' },
  { Icon: HandHeart, label: 'Pray out loud', description: '"Lord, I am weak right now but You are strong. Fight this for me."' },
]

const panelVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

export function EmergencyPage({ emergencyEncouragement, emergencyVerses, onCopyVerse, onStayedClean }) {
  const [selectedAction, setSelectedAction] = useState('')
  const [showAllVerses, setShowAllVerses] = useState(false)
  const [celebrated, setCelebrated] = useState(false)
  const versesToShow = showAllVerses ? emergencyVerses : emergencyVerses.slice(0, 3)

  return (
    <motion.div
      className="screen-stack legacy-emergency-screen"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="panel panel-wide emergency-urgent-card legacy-emergency-header" variants={panelVariants}>
        <h2 className="emergency-title">You are stronger than this moment</h2>
        <p className="emergency-quote">"{emergencyEncouragement}"</p>
        <p className="muted emergency-subcopy">
          The urge you feel right now will pass. It always does. Stay here, breathe, and work
          through the tools below — one section at a time.
        </p>
      </motion.section>

      <div className="legacy-emergency-tools">
        <motion.div variants={panelVariants}><UrgeTimer /></motion.div>
        <motion.div variants={panelVariants}><BreathingExercise /></motion.div>
      </div>

      <section className="panel panel-wide emergency-block emergency-calm-card legacy-emergency-verses">
        <h3>Verses for This Moment</h3>
        <p className="muted emergency-block-hint">Read these slowly — let each word land.</p>
        <ul className="verse-list emergency-verse-list">
          {versesToShow.map((verse, i) => (
            <motion.li
              key={verse.id}
              className="verse-card"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="verse-text">"{verse.text}"</p>
              <div className="verse-row">
                <p className="verse-ref">{verse.reference}</p>
                <button
                  className="btn-ghost btn-copy"
                  onClick={() => onCopyVerse(verse.text, verse.reference)}
                  aria-label={`Copy verse ${verse.reference}`}
                  title="Copy verse"
                >
                  <Copy size={14} /> Copy
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
        {emergencyVerses.length > 3 && (
          <button
            className="btn-ghost emergency-verse-toggle"
            onClick={() => setShowAllVerses((v) => !v)}
          >
            {showAllVerses ? 'Show fewer verses' : `See ${emergencyVerses.length - 3} more`}
          </button>
        )}
      </section>

      <motion.div variants={panelVariants} className="legacy-emergency-grounding"><GroundingExercise /></motion.div>

      <motion.section className="panel panel-wide emergency-block legacy-emergency-actions" variants={panelVariants}>
        <h3>Take One Action Right Now</h3>
        <p className="muted emergency-block-hint">
          Pick one and do it — not all of them, just one. Physical action breaks the mental loop.
        </p>
        <div className="quick-action-grid">
          {QUICK_ACTIONS.map(({ Icon, label, description }, i) => (
            <motion.button
              key={label}
              type="button"
              className="quick-action-card"
              aria-pressed={selectedAction === label}
              aria-label={`${label}. ${description}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.18 } }}
              onClick={() => setSelectedAction(label)}
            >
              <div className="quick-action-icon">
                <Icon size={22} />
              </div>
              <div>
                <p className="quick-action-label">{label}</p>
                <p className="quick-action-desc muted">{description}</p>
              </div>
            </motion.button>
          ))}
        </div>
        {selectedAction && (
          <p className="emergency-encouragement" role="status" aria-live="polite">
            Chosen next step: {selectedAction}
          </p>
        )}
      </motion.section>

      <motion.section className="panel panel-wide emergency-close-note legacy-emergency-close" variants={panelVariants}>
        <div className="close-note-verse">
          <p className="close-note-scripture">
            <em>"No temptation has overtaken you except what is common to mankind. And God is
            faithful; he will not let you be tempted beyond what you can bear."</em>
          </p>
          <div className="close-note-ref-row">
            <strong className="close-note-ref">— 1 Corinthians 10:13</strong>
            <button
              className="btn-ghost btn-copy close-note-copy"
              onClick={() => onCopyVerse(
                'No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear.',
                '1 Corinthians 10:13'
              )}
              aria-label="Copy 1 Corinthians 10:13"
              title="Copy verse"
            >
              <Copy size={13} /> Copy
            </button>
          </div>
        </div>

        <p className="close-note-body">
          You are not your urges. Every second you resist is proof of the strength God placed
          inside you. You are never too far gone. Come back here whenever you need to.
        </p>

        {!celebrated ? (
          <button
            type="button"
            className="btn-primary close-note-cta"
            onClick={() => { onStayedClean(); setCelebrated(true) }}
          >
            <ShieldCheck size={17} /> I stayed strong today
          </button>
        ) : (
          <div className="close-note-victory" role="status" aria-live="polite">
            <CheckCircle2 size={20} />
            <span>You stayed strong. God is faithful.</span>
          </div>
        )}
        {celebrated && (
          <Link href="/journal" className="btn-ghost close-note-journal-link">
            Write it down →
          </Link>
        )}
      </motion.section>
    </motion.div>
  )
}

