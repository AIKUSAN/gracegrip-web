/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Wind, Play, Pause } from 'lucide-react'
import { motion } from 'motion/react'

const PHASES = [
  { label: 'Breathe in', duration: 4, expanded: true },
  { label: 'Hold', duration: 7, expanded: true },
  { label: 'Breathe out', duration: 8, expanded: false },
]

export function BreathingExercise() {
  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [countdown, setCountdown] = useState(PHASES[0].duration)
  const [cycles, setCycles] = useState(0)

  const intervalRef = useRef(null)

  const advance = useCallback(() => {
    setCountdown((prev) => {
      if (prev > 1) return prev - 1
      // move to next phase
      setPhaseIndex((pi) => {
        const next = (pi + 1) % PHASES.length
        if (next === 0) setCycles((c) => c + 1)
        setCountdown(PHASES[next].duration)
        return next
      })
      return prev // will be overwritten by inner setCountdown
    })
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(advance, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, advance])

  const onToggle = () => setRunning((r) => !r)

  const onReset = () => {
    setRunning(false)
    setPhaseIndex(0)
    setCountdown(PHASES[0].duration)
    setCycles(0)
  }

  const phase = PHASES[phaseIndex]
  const phaseClass = !running
    ? 'breathing-ring--idle'
    : phaseIndex === 0 ? 'breathing-ring--breathe-in'
    : phaseIndex === 1 ? 'breathing-ring--hold'
    : 'breathing-ring--breathe-out'

  return (
    <section className={`panel panel-wide emergency-block${running ? ' breathing-active' : ''}`}>
      <div className="emergency-block-header">
        <Wind size={20} />
        <h3>Breathing Exercise (4‑7‑8)</h3>
      </div>
      <p className="muted emergency-block-hint">
        Inhale 4 s · Hold 7 s · Exhale 8 s. Repeat to activate your parasympathetic nervous system.
      </p>

      <div className="breathing-circle-wrap">
        <div className={`breathing-ripple ${phaseClass}`} />
        <div className={`breathing-ring ${phaseClass}`} />
        <div className="breathing-inner">
          <motion.span
            key={countdown}
            className="breathing-count"
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >{countdown}</motion.span>
          <span className="breathing-label">{running ? phase.label : 'Ready'}</span>
        </div>
      </div>

      {cycles > 0 && (
        <p className="muted breathing-cycles">
          {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed
        </p>
      )}

      <div className="actions-row justify-center">
        <button className="btn-primary breathing-toggle" onClick={onToggle}>
          {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> {cycles === 0 && phaseIndex === 0 ? 'Start' : 'Resume'}</>}
        </button>
        {(running || cycles > 0 || phaseIndex > 0) && (
          <button className="btn-ghost" onClick={onReset}>
            Reset
          </button>
        )}
      </div>
    </section>
  )
}
