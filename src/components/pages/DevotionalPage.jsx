/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { devotionals } from '@/content/loaders'

export function DevotionalPage({ today, todayDevotional, devotionalCompletedDays, onToggleDevotionalDay }) {
  const todayIso = today.toISOString().slice(0, 10)
  const isCompletedToday = (devotionalCompletedDays || []).includes(todayIso)
  const totalDays = devotionals.length
  const completedCount = (devotionalCompletedDays || []).length
  const progressPct = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0

  return (
    <div className="screen-stack legacy-devotional-screen">
      <section className="panel panel-wide legacy-devotional-header">
        <h2>30-Day Devotional Plan</h2>
        <p className="muted">A grace-paced journey through Scripture, one day at a time.</p>
        <div className="devotional-progress">
          <div className="devotional-progress-meta">
            <span>{completedCount} of {totalDays} days complete</span>
            <span>{progressPct}%</span>
          </div>
          <div
            className="devotional-progress-track"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="devotional-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </section>

      <section className="panel panel-wide devotional-panel legacy-devotional-today">
        <div className="devotional-day-badge">Day {todayDevotional.day}</div>
        <h3>{todayDevotional.title}</h3>
        <p className="devotional-verse-ref">{todayDevotional.verse}</p>
        <blockquote className="devotional-verse-text">"{todayDevotional.verseText}"</blockquote>
        <p className="devotional-reflection">{todayDevotional.reflection}</p>
        <details className="devotional-details">
          <summary>Prayer &amp; Action Step</summary>
          <p className="devotional-prayer"><strong>Prayer:</strong> {todayDevotional.prayer}</p>
          <p className="devotional-action"><strong>Action Step:</strong> {todayDevotional.actionStep}</p>
        </details>
        <button
          className={`btn-primary devotional-cta${isCompletedToday ? ' btn-completed' : ''}`}
          onClick={() => onToggleDevotionalDay(todayIso, isCompletedToday)}
        >
          {isCompletedToday
            ? <><CheckCircle2 size={16} aria-hidden="true" /> Completed Today</>
            : <><Circle size={16} aria-hidden="true" /> Mark as Complete</>}
        </button>
      </section>

      <section className="panel panel-wide legacy-devotional-list-panel">
        <h3>All 30 Days</h3>
        <ul className="devotional-list">
          {devotionals.map((d) => {
            const isToday = d.id === todayDevotional.id
            return (
              <li key={d.id} className={`devotional-list-item${isToday ? ' devotional-list-item--today' : ''}`}>
                <span className="devotional-list-day">
                  Day {d.day}
                  {isToday && <span className="devotional-list-today-pip" aria-label="Today" />}
                </span>
                <div className="devotional-list-content">
                  <span className="devotional-list-title">{d.title}</span>
                  <span className="devotional-list-ref muted">{d.verse}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
