/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useState } from 'react'
import { ArrowRight, RotateCcw, CheckCircle2, Leaf } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

const STEPS = [
  { count: 5, sense: 'things you can see', icon: '👁️' },
  { count: 4, sense: 'things you can touch', icon: '✋' },
  { count: 3, sense: 'things you can hear', icon: '👂' },
  { count: 2, sense: 'things you can smell', icon: '👃' },
  { count: 1, sense: 'thing you can taste', icon: '👅' },
]

const stepVariants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -18, scale: 0.97, transition: { duration: 0.22, ease: 'easeIn' } },
}

export function GroundingExercise() {
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)

  const progress = done ? 100 : (stepIndex / STEPS.length) * 100

  const onNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      setDone(true)
    }
  }

  const onRestart = () => {
    setStepIndex(0)
    setDone(false)
  }

  const step = STEPS[stepIndex]

  return (
    <section className="panel panel-wide emergency-block">
      <div className="emergency-block-header">
        <Leaf size={18} className="grounding-header-icon" />
        <h3>Grounding Exercise (5‑4‑3‑2‑1)</h3>
      </div>
      <p className="muted emergency-block-hint">
        Bring your mind back to the present by engaging your senses one at a time.
      </p>

      {/* Progress bar */}
      <div
        className="progress-track grounding-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className="progress-fill progress-fill-brand"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step dots */}
      {!done && (
        <div className="grounding-step-dots" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={[
                'grounding-dot',
                i < stepIndex ? 'grounding-dot--done' : '',
                i === stepIndex ? 'grounding-dot--active' : '',
              ].filter(Boolean).join(' ')}
            />
          ))}
        </div>
      )}

      <div className="grounding-content-area">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              className="grounding-done"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CheckCircle2 size={44} className="grounding-done-icon" />
              <p className="grounding-done-title">You're grounded.</p>
              <p className="muted">
                You just pulled yourself back into the present. That takes real strength.
              </p>
              <button className="btn-ghost" onClick={onRestart}>
                <RotateCcw size={15} /> Do it again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={stepIndex}
              className="grounding-step"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="grounding-step-icon-wrap">
                <span className="grounding-step-icon">{step.icon}</span>
              </div>
              <span className="grounding-step-badge">Step {stepIndex + 1} of {STEPS.length}</span>
              <p className="grounding-step-prompt">
                Name <strong>{step.count}</strong> {step.sense}
              </p>
              <button className="btn-primary" onClick={onNext}>
                {stepIndex < STEPS.length - 1 ? (
                  <>Next <ArrowRight size={15} /></>
                ) : (
                  <>Finish <CheckCircle2 size={15} /></>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
