/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useState, useEffect, useRef } from 'react'
import { Timer } from 'lucide-react'

const ENCOURAGEMENTS = [
  { minSeconds: 0, text: 'The urge is intense right now. Keep going.' },
  { minSeconds: 60, text: "You've made it one minute. The peak is passing." },
  { minSeconds: 300, text: "Five minutes strong. Most urges fade within ten minutes." },
  { minSeconds: 900, text: "Fifteen minutes. You are in control of this moment." },
  { minSeconds: 1200, text: "Twenty minutes. This is remarkable strength." },
]

function getEncouragement(seconds) {
  let msg = ENCOURAGEMENTS[0].text
  for (const entry of ENCOURAGEMENTS) {
    if (seconds >= entry.minSeconds) msg = entry.text
  }
  return msg
}

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export function UrgeTimer() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)

  const startRef = useRef(null)
  const rafRef = useRef(null)
  const baseRef = useRef(0)

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    startRef.current = Date.now()

    const tick = () => {
      const now = Date.now()
      const delta = Math.floor((now - startRef.current) / 1000)
      setElapsed(baseRef.current + delta)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [running])

  const onStart = () => {
    baseRef.current = elapsed
    setRunning(true)
  }

  const onReset = () => {
    setRunning(false)
    setElapsed(0)
    baseRef.current = 0
  }

  return (
    <section className={`panel panel-wide emergency-block${running ? ' urge-timer-active' : ''}`}>
      <div className="emergency-block-header">
        <Timer size={20} />
        <h3>Urge Timer</h3>
      </div>
      <p className="muted emergency-block-hint">
        Start the timer and ride out the urge. Most cravings peak and pass within 15–20 minutes.
      </p>
      <p className="panic-timer" aria-live="polite" aria-atomic="true" aria-label="Urge timer elapsed">
        {formatTime(elapsed)}
      </p>
      <p className="emergency-encouragement">{getEncouragement(elapsed)}</p>
      <div className="actions-row flex justify-center">
        {!running ? (
          <button type="button" className="btn-primary" onClick={onStart}>
            {elapsed === 0 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button type="button" className="btn-ghost" onClick={() => { baseRef.current = elapsed; setRunning(false) }}>
            Pause
          </button>
        )}
        <button type="button" className="btn-ghost" onClick={onReset} disabled={elapsed === 0 && !running}>
          Reset
        </button>
      </div>
    </section>
  )
}
