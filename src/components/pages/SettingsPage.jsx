'use client'
import { useState } from 'react'
import {
  Download, Share2, Upload,
  User, Bell, HardDrive, Smartphone,
  AlertTriangle, History, MessageSquare,
  ShieldCheck, Star, Medal,
} from 'lucide-react'
import { QRTransfer } from '@/components/QRTransfer'

export function SettingsPage({
  profileNameInput,
  onChangeProfileNameInput,
  onSaveProfileName,
  onExportData,
  onShareData,
  onImportClick,
  onImportChange,
  fileInputRef,
  canShare,
  daysSinceBackup,
  backupSelections,
  onToggleBackupSelection,
  appState,
  onQRImport,
  onResetStreakWithConfirm,
  onClearJournal,
  streakHistory,
  formatHistoryDate,
  reminder,
  onToggleReminder,
  onChangeReminderTime,
  onSubmitFeedback,
}) {
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)

  const handleFeedbackSubmit = async () => {
    if (!feedbackRating) return
    setFeedbackSubmitting(true)
    const result = await onSubmitFeedback(feedbackRating, feedbackMessage)
    setFeedbackSubmitting(false)
    if (result?.ok) {
      setFeedbackSent(true)
      setFeedbackRating(0)
      setFeedbackMessage('')
    }
  }

  return (
    <div className="screen-stack legacy-settings-screen">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="settings-page-header">
        <h2 className="settings-page-title">Settings</h2>
        <p className="settings-page-subtitle">Manage your profile, data, and privacy.</p>
      </div>

      {/* ── Profile ───────────────────────────────────────────────── */}
      <section className="panel panel-wide settings-section legacy-settings-panel">
        <h3 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '1rem', fontWeight: 700 }}>
          <User size={17} aria-hidden="true" />
          Profile
        </h3>
        <p className="settings-section-desc">How should we greet you each day?</p>
        <div className="settings-inline-field">
          <input
            className="welcome-input settings-name-input"
            value={profileNameInput}
            onChange={(event) => onChangeProfileNameInput(event.target.value)}
            placeholder="Your first name (optional)"
            onKeyDown={(event) => {
              if (event.key === 'Enter') onSaveProfileName()
            }}
          />
          <button className="btn-primary" onClick={onSaveProfileName}>Save</button>
        </div>
      </section>

      {/* ── Local Reminders ───────────────────────────────────────── */}
      <section className="panel panel-wide settings-section legacy-settings-panel">
        <h3 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '1rem', fontWeight: 700 }}>
          <Bell size={17} aria-hidden="true" />
          Daily Reminder
        </h3>
        <p className="settings-section-desc">
          A browser notification to keep you anchored to your daily devotional.
          GraceGrip must be open or recently active for it to fire.
        </p>
        <label className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="checkbox"
            className="toggle-checkbox"
            checked={!!reminder?.enabled}
            onChange={onToggleReminder}
          />
          <span className="toggle-switch" aria-hidden="true"></span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {reminder?.enabled ? 'Notifications on' : 'Notifications off'}
          </span>
        </label>
        {reminder?.enabled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--line)' }}>
            <label className="muted" htmlFor="reminder-time" style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
              Remind me at
            </label>
            <input
              id="reminder-time"
              type="time"
              className="time-input"
              value={reminder?.time || '20:00'}
              onChange={(e) => onChangeReminderTime(e.target.value)}
            />
          </div>
        )}
      </section>

      {/* ── Data & Backup ─────────────────────────────────────────── */}
      <section className="panel panel-wide settings-section legacy-settings-panel">
        <h3 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '1rem', fontWeight: 700 }}>
          <HardDrive size={17} aria-hidden="true" />
          Data &amp; Backup
        </h3>
        <p className="settings-section-desc">
          Your data lives entirely on this device. Export regularly to keep it safe.
        </p>

        {daysSinceBackup !== null && daysSinceBackup >= 7 && (
          <div className="backup-reminder-banner">
            <span className="backup-reminder-icon">⚠️</span>
            <span>
              Last backup was <strong>{daysSinceBackup} day{daysSinceBackup !== 1 ? 's' : ''} ago</strong>.
              Consider exporting to keep your data safe.
            </span>
          </div>
        )}

        <p className="settings-checklist-label">Choose what to include:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {[
            { key: 'journal',   label: 'Journal entries' },
            { key: 'streak',    label: 'Streak & devotional progress' },
            { key: 'favorites', label: 'Favorite verses' },
            { key: 'settings',  label: 'Settings & profile' },
          ].map(({ key, label }) => (
            <label key={key} className="settings-checklist-item">
              <input
                type="checkbox"
                checked={!!backupSelections?.[key]}
                onChange={() => onToggleBackupSelection(key)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
          <button className="btn-primary" onClick={() => onExportData(backupSelections)}>
            <Download size={15} aria-hidden="true" />Export &amp; Download
          </button>
          {canShare && (
            <button className="btn-ghost" onClick={() => onShareData(backupSelections)}>
              <Share2 size={15} aria-hidden="true" />Share via&hellip;
            </button>
          )}
          <button className="btn-ghost" onClick={onImportClick}>
            <Upload size={15} aria-hidden="true" />Import Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={onImportChange}
            className="hidden-input"
          />
        </div>
      </section>

      {/* ── Transfer to Another Device ────────────────────────────── */}
      <section className="panel panel-wide settings-section legacy-settings-panel">
        <h3 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '1rem', fontWeight: 700 }}>
          <Smartphone size={17} aria-hidden="true" />
          Transfer to Another Device
        </h3>
        <p className="settings-section-desc">
          Move your data to a new phone or browser instantly — no internet or account required.
        </p>
        <QRTransfer appState={appState} onQRImport={onQRImport} />
      </section>

      {/* ── Recovery Controls ─────────────────────────────────────── */}
      <section
        className="panel panel-wide settings-section legacy-settings-panel"
        style={{ borderLeft: '3px solid color-mix(in srgb, var(--danger) 55%, transparent)', background: 'color-mix(in srgb, var(--danger) 3%, var(--card))' }}
      >
        <h3 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '1rem', fontWeight: 700, color: 'var(--danger)' }}>
          <AlertTriangle size={17} aria-hidden="true" />
          Recovery Controls
        </h3>
        <p className="settings-danger-note">
          These actions are permanent and cannot be undone. Your streak counter and journal
          entries will be erased from this device.
        </p>
        <div className="actions-row">
          <button className="btn-danger" onClick={onResetStreakWithConfirm}>
            <AlertTriangle size={14} aria-hidden="true" />Reset Streak
          </button>
          <button className="btn-danger" onClick={onClearJournal}>
            <AlertTriangle size={14} aria-hidden="true" />Clear Journal
          </button>
        </div>
      </section>

      {/* ── Streak History ────────────────────────────────────────── */}
      {streakHistory.length > 0 && (
        <section className="panel panel-wide settings-section legacy-settings-panel">
          <h3 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '1rem', fontWeight: 700 }}>
            <History size={17} aria-hidden="true" />
            Streak History
          </h3>
          <ul className="settings-history-list">
            {[...streakHistory]
              .sort((a, b) => (a.endDate < b.endDate ? 1 : -1))
              .map((entry, index) => (
                <li key={`${entry.endDate}-${index}`} className="settings-history-item">
                  <span>{formatHistoryDate(entry.startDate)} – {formatHistoryDate(entry.endDate)}</span>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--brand)' }}>
                    <Medal size={13} aria-hidden="true" style={{ color: 'var(--accent)' }} />
                    {entry.days} day{entry.days !== 1 ? 's' : ''}
                  </strong>
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* ── Send Feedback ─────────────────────────────────────────── */}
      <section className="panel panel-wide settings-section legacy-settings-panel">
        <h3 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '1rem', fontWeight: 700 }}>
          <MessageSquare size={17} aria-hidden="true" />
          Send Feedback
        </h3>
        <p className="settings-section-desc">
          Completely anonymous — no account needed. Help shape GraceGrip&apos;s future.
        </p>
        {feedbackSent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-start' }}>
            <p className="feedback-sent-msg">Thank you &mdash; your voice helps shape GraceGrip. 🙏</p>
            <button className="btn-ghost" onClick={() => setFeedbackSent(false)}>Send another</button>
          </div>
        ) : (
          <>
            <div className="feedback-stars" role="group" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="feedback-star-btn"
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  aria-pressed={feedbackRating >= star}
                  onClick={() => setFeedbackRating(star)}
                >
                  <Star
                    size={22}
                    style={feedbackRating >= star
                      ? { fill: 'var(--accent)', color: 'var(--accent)' }
                      : { fill: 'none', color: 'var(--line)' }
                    }
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            <textarea
              className="feedback-textarea"
              placeholder="Optional note (max 500 characters)…"
              maxLength={500}
              rows={3}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
            />
            <button
              className="btn-primary"
              disabled={!feedbackRating || feedbackSubmitting}
              onClick={handleFeedbackSubmit}
            >
              {feedbackSubmitting ? 'Sending…' : 'Send Feedback'}
            </button>
          </>
        )}
      </section>

      {/* ── About & Privacy ───────────────────────────────────────── */}
      <section className="panel panel-wide settings-section settings-about legacy-settings-about">
        <h3 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 700 }}>
          <ShieldCheck size={17} aria-hidden="true" />
          About &amp; Privacy
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div className="settings-about-item">
            <p className="settings-about-item-title">App Mission</p>
            <p className="muted" style={{ margin: 0, fontSize: '0.84rem', lineHeight: 1.5 }}>
              GraceGrip provides faith-based support and recovery tools — a grace-first tether
              for difficult moments, blending Scripture with practical habit tracking.
            </p>
          </div>
          <div className="settings-about-item">
            <p className="settings-about-item-title">Local-First Guarantee</p>
            <p className="muted" style={{ margin: 0, fontSize: '0.84rem', lineHeight: 1.5 }}>
              No account, no subscription, no cloud sync by default. Your journal, streak, and
              favorites stay on this device unless you specifically export them.
            </p>
          </div>
        </div>
        <p className="settings-about-footer muted">
          GraceGrip stays free and local-first. No tracking pixels. No hidden paywalls.
        </p>
      </section>

    </div>
  )
}
