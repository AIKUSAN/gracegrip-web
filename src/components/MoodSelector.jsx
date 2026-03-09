/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

export const MOOD_CONFIG = [
  { value: 'struggling', label: 'Struggling', emoji: '🌧️' },
  { value: 'tempted',    label: 'Tempted',    emoji: '⚡' },
  { value: 'neutral',   label: 'Neutral',    emoji: '🌤️' },
  { value: 'hopeful',   label: 'Hopeful',    emoji: '🌱' },
  { value: 'strong',    label: 'Strong',     emoji: '🛡️' },
  { value: 'grateful',  label: 'Grateful',   emoji: '🙏' },
]

export function MoodSelector({ value, onChange }) {
  return (
    <div className="mood-selector">
      {MOOD_CONFIG.map((mood) => (
        <button
          key={mood.value}
          className={`mood-pill ${value === mood.value ? 'mood-pill-selected' : ''}`}
          data-mood={mood.value}
          onClick={() => onChange(mood.value)}
          aria-pressed={value === mood.value}
        >
          <span aria-hidden="true" className="mood-emoji">{mood.emoji}</span>
          {mood.label}
        </button>
      ))}
    </div>
  )
}
