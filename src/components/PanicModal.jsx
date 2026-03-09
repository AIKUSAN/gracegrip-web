/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

export function PanicModal({ panicVerse, panicMode, secondsLabel, onRestart, onClose }) {
  return (
    <div className="panic-overlay" role="dialog" aria-modal="true" aria-label="Panic support modal">
      <div className="panic-card">
        <h2>Take a breath. God is with you.</h2>
        <p className="panic-timer" aria-live="polite" aria-atomic="true" aria-label="Breathing timer">
          {secondsLabel}
        </p>
        <p className="muted">{panicMode}</p>
        <p className="verse-text">"{panicVerse.text}"</p>
        <p className="verse-ref">{panicVerse.reference}</p>
        <ol className="steps-list">
          <li>Inhale for 4 seconds.</li>
          <li>Hold for 4 seconds.</li>
          <li>Exhale for 6 seconds.</li>
          <li>Pray: "Jesus, lead me right now. Give me self-control and peace."</li>
        </ol>
        <div className="actions-row">
          <button className="btn-primary" onClick={onRestart} aria-label="Restart 3 minute support timer">
            Restart 3 Minutes
          </button>
          <button className="btn-ghost" onClick={onClose} aria-label="Close panic support modal">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
