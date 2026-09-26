/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useState } from 'react'
import { Phone, Footprints, Droplets, HandHeart, Copy, ShieldCheck, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { UrgeTimer } from '@/components/UrgeTimer'
import { BreathingExercise } from '@/components/BreathingExercise'
import { GroundingExercise } from '@/components/GroundingExercise'
import helplineCountries from '@/data/helplineCountries.json'

const QUICK_ACTIONS = [
  { Icon: Phone, label: 'Call someone you trust', description: 'You can ask for company or help with the next step.' },
  { Icon: Footprints, label: 'Change your setting', description: 'If it is safe, move to a place that feels easier to be in.' },
  { Icon: Droplets, label: 'Drink water', description: 'A small, ordinary pause can give you room to choose.' },
  { Icon: HandHeart, label: 'Pray, if you wish', description: 'You can ask God for help in your own words.' },
]

const panelVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

export function EmergencyPage({ emergencyVerses, onCopyVerse, onStayedClean }) {
  const [safety, setSafety] = useState('')
  const [country, setCountry] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [showAllVerses, setShowAllVerses] = useState(false)
  const [celebrated, setCelebrated] = useState(false)
  const versesToShow = showAllVerses ? emergencyVerses : emergencyVerses.slice(0, 3)

  if (safety !== 'not-now') return <div className="cc-page cc-safety">
    <header className="cc-intro"><h1>What kind of help do you need right now?</h1><p>You can open Help Now without an account. Choose the situation that fits best. This choice is not saved.</p></header>
    <div className="cc-safety-options">
      <button type="button" onClick={() => setSafety('overdose')}>Possible overdose or trouble breathing</button>
      <button type="button" onClick={() => setSafety('withdrawal')}>Withdrawal or severe physical symptoms</button>
      <button type="button" onClick={() => setSafety('violence')}>Threats, violence, or abuse</button>
      <button type="button" onClick={() => setSafety('not-now')}>None of these — show support tools</button>
    </div>
    {safety && <section className="cc-danger-guidance" role="alert">
      <h2>{safety === 'overdose' ? 'Get emergency help now' : safety === 'withdrawal' ? 'Get medical help' : 'Put safety first'}</h2>
      <p>{safety === 'overdose' ? 'If someone may have overdosed, is unresponsive, or is having trouble breathing, contact local emergency services immediately. GraceGrip cannot provide emergency care.' : safety === 'withdrawal' ? 'Severe withdrawal can be dangerous. Seek urgent medical care, especially if symptoms are serious or worsening. GraceGrip does not give detox or withdrawal instructions.' : 'If someone is in immediate danger, contact local emergency services. If you can, move to a safer place and contact a trusted person or local specialist service. If your device use is monitored, consider using a safer device.'}</p>
      <label htmlFor="help-country">Your country (optional)</label><select id="help-country" value={country} onChange={(event) => setCountry(event.target.value)}><option value="">Choose a country</option>{helplineCountries.map(({ code, name }) => <option value={code} key={code}>{name}</option>)}</select>
      <p>{country ? `Open the directory for ${helplineCountries.find((item) => item.code === country)?.name}. Check the service details before relying on them.` : 'Find support by country in the directory below.'}</p>
      <a href={country ? `https://findahelpline.com/countries/${country}` : 'https://www.iasp.info/crisis-centres-helplines/'} target="_blank" rel="noopener noreferrer">{country ? 'Open this country’s helplines' : 'Find a country helpline through IASP'}</a>
      <button type="button" className="cc-back-button" onClick={() => setSafety('')}>Choose a different situation</button>
    </section>}
  </div>

  return (
    <motion.div
      className="cc-screen cc-emergency-screen"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="cc-panel cc-panel-wide emergency-urgent-card cc-emergency-header" variants={panelVariants}>
        <h1 className="emergency-title">One next step is enough</h1>
        <p className="cc-muted emergency-subcopy">
          Choose a tool that fits this moment. You can stop or reach out to someone at any time.
        </p>
      </motion.section>
      <button type="button" className="cc-back-button" onClick={() => setSafety('')}>Return to safety choices</button>

      <div className="cc-emergency-tools">
        <motion.div variants={panelVariants}><UrgeTimer /></motion.div>
        <motion.div variants={panelVariants}><BreathingExercise /></motion.div>
      </div>

      <details className="cc-panel cc-panel-wide emergency-block emergency-calm-card cc-emergency-verses">
        <summary>Scripture, if you want it</summary>
        <h3>Verses for This Moment</h3>
        <p className="cc-muted emergency-block-hint">Read these slowly — let each word land.</p>
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
                  className="cc-btn-ghost cc-btn-copy"
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
            className="cc-btn-ghost emergency-verse-toggle"
            onClick={() => setShowAllVerses((v) => !v)}
          >
            {showAllVerses ? 'Show fewer verses' : `See ${emergencyVerses.length - 3} more`}
          </button>
        )}
      </details>

      <motion.div variants={panelVariants} className="cc-emergency-grounding"><GroundingExercise /></motion.div>

      <section className="cc-puzzle-invite"><h2>Need a quiet visual task?</h2><p>The optional tile puzzle offers a score-free pause or a separate three-minute challenge. You can stop at any time.</p><Link href="/puzzle">Open the puzzle</Link></section>

      <motion.section className="cc-panel cc-panel-wide emergency-block cc-emergency-actions" variants={panelVariants}>
        <h3>Take One Action Right Now</h3>
        <p className="cc-muted emergency-block-hint">
          Pick one action that is safe for you. You do not need to do every step.
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
                <p className="quick-action-desc cc-muted">{description}</p>
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

      <motion.section className="cc-panel cc-panel-wide emergency-close-note cc-emergency-close" variants={panelVariants}>
        <details><summary>Scripture for this moment, if you want it</summary><div className="close-note-verse">
          <p className="close-note-scripture">
            <em>"No temptation has overtaken you except what is common to mankind. And God is
            faithful; he will not let you be tempted beyond what you can bear."</em>
          </p>
          <div className="close-note-ref-row">
            <strong className="close-note-ref">— 1 Corinthians 10:13</strong>
            <button
              className="cc-btn-ghost cc-btn-copy close-note-copy"
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
        </div></details>

        <p className="close-note-body">You can return here whenever you need a pause. If you need care or safety help, contact a qualified local service.</p>

        {!celebrated ? (
          <button
            type="button"
            className="cc-btn-primary close-note-cta"
            onClick={() => { onStayedClean(); setCelebrated(true) }}
          >
            <ShieldCheck size={17} /> Record a legacy check-in
          </button>
        ) : (
          <div className="close-note-victory" role="status" aria-live="polite">
            <CheckCircle2 size={20} />
            <span>Legacy check-in recorded on this device.</span>
          </div>
        )}
        {celebrated && (
          <Link href="/journal" className="cc-btn-ghost close-note-journal-link">
            Write it down →
          </Link>
        )}
      </motion.section>
    </motion.div>
  )
}
