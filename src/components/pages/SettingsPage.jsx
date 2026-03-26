/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'
import { useState } from 'react'
import {
  Download, Share2, Upload,
  User, Bell, HardDrive, Smartphone,
  AlertTriangle, History, MessageSquare,
  ShieldCheck, Star, Medal,
  HelpCircle, Scale, ExternalLink,
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

      {/* ── About, FAQ & Legal ────────────────────────────────────── */}
      <section className="panel panel-wide settings-section legacy-settings-about">

        {/* App meta */}
        <div className="about-meta-row">
          <div className="about-meta-main">
            <div className="about-meta-name-row">
              <ShieldCheck size={16} className="about-meta-icon" aria-hidden="true" />
              <span className="about-meta-name">GraceGrip</span>
              <span className="about-version-pill">v1.1.0</span>
              <span className="about-license-pill">MIT</span>
            </div>
            <p className="about-meta-desc">
              Faith-based recovery support — Scripture, streak tracking, and grace for difficult moments.
              No account, no cloud sync, no tracking. Your data stays on this device.
            </p>
            <a
              href="https://github.com/AIKUSAN/gracegrip-web"
              target="_blank"
              rel="noopener noreferrer"
              className="settings-oss-link"
            >
              <ExternalLink size={12} aria-hidden="true" />
              View source on GitHub
            </a>
          </div>
        </div>

        {/* FAQ sub-section */}
        <div className="about-sub-divider" />
        <p className="about-sub-label">
          <HelpCircle size={13} aria-hidden="true" />
          Frequently Asked Questions
        </p>
        <div className="faq-list">
          <details className="faq-details">
            <summary className="faq-summary">What is GraceGrip and who is it for?</summary>
            <p className="faq-answer">GraceGrip is a free, faith-based recovery support app for anyone seeking spiritual encouragement and practical tools during difficult moments — particularly those in addiction recovery, grief, or spiritual struggle. It offers a streak counter, Scripture library, daily devotionals, a private journal, and a panic button for crisis moments.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">Is my data private and secure?</summary>
            <p className="faq-answer">Yes. All your data — journal entries, streak history, and profile name — stays entirely on your device. Sensitive fields are encrypted with AES-256 via the Web Crypto API before being written to local storage. Nothing is sent to any server unless you explicitly export your data or submit optional anonymous feedback.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">Does GraceGrip require an account or subscription?</summary>
            <p className="faq-answer">No. GraceGrip has no accounts, no sign-up, no email, and no subscription. It is free, open-source, and always will be. The only optional external interaction is submitting an anonymous star rating or feedback note.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">What happens when I stumble?</summary>
            <p className="faq-answer">The streak counter resets to zero — but God&apos;s grace does not. GraceGrip is designed around the truth that every new moment is a fresh start. Tap &ldquo;I stumbled today&rdquo; honestly and begin again. Your streak history is preserved so you can see how far you&apos;ve come.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">How does the streak counter work?</summary>
            <p className="faq-answer">Tap &ldquo;I stayed clean today&rdquo; once per calendar day to mark that day. If you check in on consecutive days, your count increases. Miss a day, and the counter resets. You can only check in once per day — come back tomorrow to continue your streak.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">Can I use GraceGrip offline?</summary>
            <p className="faq-answer">Yes. GraceGrip works fully offline after the first load. All content — Scripture, devotionals, and your personal data — is stored locally. An internet connection is only needed on first visit or to submit optional feedback.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">How do I transfer my data to a new phone or browser?</summary>
            <p className="faq-answer">Go to Settings &rarr; Data &amp; Backup and tap &ldquo;Export &amp; Download&rdquo; to save a backup file, or use the QR Transfer feature (Settings &rarr; Transfer to Another Device) to move data instantly via QR code — no internet required.</p>
          </details>
        </div>

        {/* Legal sub-section */}
        <div className="about-sub-divider" />
        <p className="about-sub-label">
          <Scale size={13} aria-hidden="true" />
          Legal
        </p>
        <div className="faq-list">
          <details className="faq-details">
            <summary className="faq-summary">Terms of Use</summary>
            <div className="settings-legal-body">
              <p><strong>GraceGrip is peer support and spiritual encouragement — not professional mental health care, crisis intervention, or a substitute for licensed therapy.</strong> If you are in immediate danger, please contact local emergency services or a crisis helpline immediately.</p>
              <p>GraceGrip is provided free of charge, as-is, without warranties of any kind. The developers make no guarantee of uninterrupted service, fitness for a particular purpose, or medical or psychological effectiveness.</p>
              <p>GraceGrip is open-source software released under the MIT License. You are free to use, copy, modify, merge, publish, distribute, and sublicense it, provided attribution is retained in all forks and distributions.</p>
              <p>Scripture quotations are used for encouragement and reflection. GraceGrip does not claim authority over Biblical interpretation or doctrine.</p>
              <p>By using GraceGrip, you agree that it is a devotional and self-accountability tool and that you take responsibility for your own wellbeing. This app is not a medical device and makes no clinical claims.</p>
            </div>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">Privacy Policy</summary>
            <div className="settings-legal-body">
              <p><strong>Your data stays on your device.</strong> GraceGrip does not have a backend server, does not create user accounts, and does not transmit your personal data anywhere. Your journal entries, profile name, streak history, and settings are stored in your browser&apos;s local storage using AES-256 encryption for sensitive fields.</p>
              <p><strong>Optional anonymous feedback.</strong> If you choose to submit a star rating or message via the Send Feedback section, that data is sent to Supabase — a third-party database. No name, email, or device identifier is attached. This is entirely optional.</p>
              <p><strong>No analytics, no tracking, no ads.</strong> GraceGrip does not include any analytics SDK, telemetry library, advertising network, or tracking pixel. There are no third-party scripts loading at runtime.</p>
              <p><strong>Data export and transfer.</strong> You can export all your data at any time via Settings &rarr; Data &amp; Backup. QR transfer also happens locally — no data is relayed through any server.</p>
              <p><strong>Changes to this policy.</strong> If the privacy practices of GraceGrip ever change materially, the changelog and release notes will reflect it. The source code is public and auditable at <a href="https://github.com/AIKUSAN/gracegrip-web" target="_blank" rel="noopener noreferrer" className="settings-oss-link" style={{ display: 'inline-flex' }}>github.com/AIKUSAN/gracegrip-web</a>.</p>
            </div>
          </details>
        </div>

      </section>

    </div>
  )
}
