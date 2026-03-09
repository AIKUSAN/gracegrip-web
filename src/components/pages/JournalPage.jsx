/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { Trash2, NotebookPen, PenLine, ScrollText, Feather } from 'lucide-react'
import { MoodSelector, MOOD_CONFIG } from '@/components/MoodSelector'

const MOOD_BORDER = {
  grateful:   'color-mix(in srgb, #f59e0b 55%, transparent)',
  hopeful:    'color-mix(in srgb, #0ea5e9 55%, transparent)',
  neutral:    'color-mix(in srgb, #94a3b8 40%, transparent)',
  struggling: 'color-mix(in srgb, #e35d5d 55%, transparent)',
  tempted:    'color-mix(in srgb, #d97706 55%, transparent)',
  strong:     'color-mix(in srgb, #10b981 55%, transparent)',
}

function formatEntryDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: diffDays > 365 ? 'numeric' : undefined,
  })
}

export function JournalPage({
  journalMood,
  onChangeJournalMood,
  journalContent,
  onChangeJournalContent,
  onSaveJournalEntry,
  journalMoodFilter,
  onChangeJournalMoodFilter,
  sortedJournalEntries,
  onDeleteJournalEntry,
}) {
  const entryCount = sortedJournalEntries.length

  return (
    <div className="screen-stack legacy-journal-screen">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="journal-page-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
          <NotebookPen size={22} aria-hidden="true" />
          Journal
        </h2>
        <p className="muted" style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          A private space to process what you&apos;re feeling. Everything stays on this device.
        </p>
      </div>

      {/* ── Write an Entry ────────────────────────────────────────── */}
      <section className="panel panel-wide legacy-journal-form">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700 }}>
          <PenLine size={17} aria-hidden="true" />
          Write an Entry
        </h3>
        <div className="journal-controls">
          <p className="journal-mood-label" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
            How are you feeling?
          </p>
          <MoodSelector value={journalMood} onChange={onChangeJournalMood} />
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
            Your thoughts
          </p>
          <textarea
            value={journalContent}
            onChange={(event) => onChangeJournalContent(event.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="Write freely — no judgment, just grace..."
          />
          <p className="journal-char-count">{journalContent.length} / 2000</p>
          <button className="btn-primary journal-save-btn" onClick={onSaveJournalEntry} disabled={!journalContent.trim()}>
            <PenLine size={15} aria-hidden="true" />
            Save Entry
          </button>
        </div>
      </section>

      {/* ── Recent Entries ────────────────────────────────────────── */}
      <section className="panel panel-wide legacy-journal-list-panel">
        <div className="journal-entries-header" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1rem', fontWeight: 700 }}>
            <ScrollText size={17} aria-hidden="true" />
            Recent Entries
          </h3>
          {entryCount > 0 && <span className="journal-entry-count">{entryCount}</span>}
        </div>
        <div className="journal-filter-row" style={{ alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>Filter:</span>
          <button
            className={`chip ${journalMoodFilter === 'all' ? 'chip-active' : ''}`}
            onClick={() => onChangeJournalMoodFilter('all')}
          >
            All
          </button>
          {MOOD_CONFIG.map((mood) => (
            <button
              key={mood.value}
              className={`chip ${journalMoodFilter === mood.value ? 'chip-active' : ''}`}
              onClick={() => onChangeJournalMoodFilter(mood.value)}
            >
              <span aria-hidden="true" className="mood-emoji">{mood.emoji}</span>
              {mood.label}
            </button>
          ))}
        </div>
        {sortedJournalEntries.length === 0 && (
          <div className="journal-empty-state">
            <Feather size={32} aria-hidden="true" />
            <p style={{ margin: '0.5rem 0 0.15rem', fontWeight: 600, color: 'var(--ink-soft)' }}>No entries yet</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ink-soft)' }}>Your first words are waiting.</p>
          </div>
        )}
        <ul className="journal-list">
          {sortedJournalEntries.map((entry) => {
            const moodCfg = MOOD_CONFIG.find((m) => m.value === entry.mood)
            return (
              <li key={entry.id} className="journal-item legacy-journal-item" data-mood={entry.mood} style={{ borderLeft: `3px solid ${MOOD_BORDER[entry.mood] || 'var(--line)'}` }}>
                <div className="journal-meta">
                  <span className="mood-tag" data-mood={entry.mood}>
                    {moodCfg && <span aria-hidden="true" className="mood-emoji">{moodCfg.emoji}</span>}
                    {entry.mood}
                  </span>
                  <span>{formatEntryDate(entry.date)}</span>
                  <button
                    className="btn-ghost legacy-delete-btn"
                    onClick={() => onDeleteJournalEntry(entry.id)}
                    aria-label="Delete entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p>{entry.content}</p>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
