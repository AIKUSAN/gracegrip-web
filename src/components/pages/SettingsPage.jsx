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
import { APP_VERSION } from '@/lib/appVersion'

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
  const homeAnalyticsEnabled = Boolean(process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN)

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
    <div className="screen-stack legacy-settings-screen v2-support-route">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="settings-page-header">
        <h1 className="settings-page-title">Settings</h1>
        <p className="settings-page-subtitle">Your data, your choices, and a way to reach GraceGrip.</p>
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
          Your journal and recovery progress live on this device. Export regularly to keep them safe.
          Backup files are readable JSON and include only the categories selected below; store or share them carefully.
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
            { key: 'streak',    label: 'Progress, emblems & devotional history' },
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
          No account needed. Your rating and optional note are sent without a name or email. This form cannot receive a reply. Please do not include identifying details. Daily cleanup clears notes once they are older than 90 days; ratings remain.
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

      {/* ── Contact ──────────────────────────────────────────────── */}
      <section className="panel panel-wide settings-section legacy-settings-panel">
        <h3 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '1rem', fontWeight: 700 }}>
          <MessageSquare size={17} aria-hidden="true" />
          Contact GraceGrip
        </h3>
        <p className="settings-section-desc">
          For a product question or feedback that needs a reply, email <a href="mailto:contact@gracegrip.app">contact@gracegrip.app</a>.
          Email is separate from the anonymous form. It reveals your email address to us and the mail providers, and our reply may come from a different address.
          This inbox is not monitored for urgent help. Use <a href="/emergency">Help Now</a> for the app&apos;s immediate tools;
          if you are in danger, contact local emergency services.
        </p>
      </section>

      {/* ── About, FAQ & Legal ────────────────────────────────────── */}
      <section className="panel panel-wide settings-section legacy-settings-about">

        {/* App meta */}
        <div className="about-meta-row">
          <div className="about-meta-main">
            <div className="about-meta-name-row">
              <ShieldCheck size={16} className="about-meta-icon" aria-hidden="true" />
              <span className="about-meta-name">GraceGrip</span>
              <span className="about-version-pill">v{APP_VERSION}</span>
              <span className="about-license-pill">MIT</span>
            </div>
            <p className="about-meta-desc">
              Free, private support across self-chosen focus areas, with immediate tools and optional Christian encouragement.
              Public help needs no account. Selected goal progress can be synced only after you create an optional account and choose what to upload; the journal stays on this device.
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
            <p className="faq-answer">GraceGrip is a free, Christian self-help app for adults who choose to change a habit or seek support around substance use. It offers Help Now tools, seven focus paths, an optional devotional, private check-ins, a journal, and portable backups. Choosing a path does not assign a diagnosis, and faith tools are optional.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">Is my data private and secure?</summary>
            <p className="faq-answer">Your journal, profile name, and legacy streak history stay on this device. Goal plans and check-ins begin here too; only goals, check-ins, and emblems you explicitly select can be uploaded to an optional account. Sensitive local fields are encrypted before storage when Web Crypto is available. A backup you export is readable JSON, so store it carefully.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">Does GraceGrip require an account or subscription?</summary>
            <p className="faq-answer">Public guidance, Help Now, and Resources are free without an account or subscription. Membership, when enabled, is optional for selected progress sync and hosted community sessions. All core support stays free.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">What happens when I stumble?</summary>
            <p className="faq-answer">Your chosen goal can record a setback without erasing earlier check-ins or permanent emblems. The old GraceGrip streak stays separate as legacy progress. You can return to a helpful step whenever you are ready.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">How does the streak counter work?</summary>
            <p className="faq-answer">The earlier consecutive-day streak is preserved as legacy progress. New goals have their own private check-ins. On paths where days make sense, you may choose to track them and earn permanent botanical emblems; missing a day does not remove an emblem.</p>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">Can I use GraceGrip offline?</summary>
            <p className="faq-answer">GraceGrip can be installed as a web app, but this preview still requires a network connection to load its pages. Saved journal and progress data remain on this device. Export a backup before changing browsers or devices.</p>
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
              <p><strong>GraceGrip offers nonclinical self-help and optional spiritual encouragement, not diagnosis, medical treatment, detox, or crisis intervention.</strong> If you are in immediate danger, contact local emergency services. For substance dependence or withdrawal concerns, seek qualified medical care.</p>
              <p>GraceGrip is provided free of charge, as-is, without warranties of any kind. The developers make no guarantee of uninterrupted service, fitness for a particular purpose, or medical or psychological effectiveness.</p>
              <p>GraceGrip is open-source software released under the MIT License. You are free to use, copy, modify, merge, publish, distribute, and sublicense it, provided attribution is retained in all forks and distributions.</p>
              <p>Scripture quotations are used for encouragement and reflection. GraceGrip does not claim authority over Biblical interpretation or doctrine.</p>
              <p>You may choose practical tools without prayer or Scripture. This app is not a medical device and makes no clinical claims.</p>
            </div>
          </details>
          <details className="faq-details">
            <summary className="faq-summary">Privacy Policy</summary>
            <div className="settings-legal-body">
              <p><strong>Device records and optional sync.</strong> The journal, profile name, legacy streak, and puzzle personal best stay on your device. Goals, plans, check-ins, and emblems also begin locally. If you create an optional passkey account, you may explicitly choose goals, check-ins, and emblems to copy to a separate Cloudflare D1 account store. Existing data is never uploaded automatically. Sensitive local fields are encrypted when Web Crypto is available. Exported backups are readable JSON.</p>
              <p><strong>Membership and email.</strong> A passkey and one-use recovery codes can access your optional account. If you add and verify a private email, a capped outbound provider processes verification and recovery messages; the address is not shown in the community. Article notices require a separate unchecked opt-in and can be unsubscribed from independently. Account deletion removes the synced account copy and community profile, while device-local data remains until you clear it on that device.</p>
              <p><strong>Hosted community.</strong> Members show an alias and avatar, not their account email or goals. The owner reviews text posts before other members see them. Ordinary chat posts are deleted after 30 days; separately retained incident evidence is deleted after 90 days. The room is read-only unless a human owner is hosting and is not monitored for urgent help.</p>
              <p><strong>Optional AI reflection.</strong> An explicitly downloaded on-device model runs on compatible hardware and keeps your reflection in the browser. The separate Workers AI fallback sends the one prompt to Cloudflare for inference and has daily limits. GraceGrip does not save prompts or AI response text. Reports store only a category and inference route. AI is not a crisis service, clinician, or substitute for the fixed Help Now guidance.</p>
              <p><strong>Optional anonymous feedback.</strong> If you submit a rating or message, it is stored in Cloudflare D1. The form does not request your name, email, or device identifier and cannot be used for a reply. Please avoid including identifying information. Daily cleanup removes written notes from the active database once they are older than 90 days; ratings remain. Cloudflare&apos;s database recovery history may retain an earlier copy for up to 30 more days. The temporary Neon rollback database follows the same daily cutoff and is retained through October 23, 2026. Network requests may still expose technical information such as an IP address to the hosting provider.</p>
              <p><strong>Contact email.</strong> Mail sent to contact@gracegrip.app is forwarded by Cloudflare to a private inbox. Unlike the feedback form, email includes your address and is handled by the mail providers. Replies may come from that private inbox&apos;s address. The inbox is for product contact and feedback; it is not an urgent support channel.</p>
              {homeAnalyticsEnabled ? (
                <p><strong>Homepage analytics.</strong> Cloudflare Web Analytics is loaded manually on the homepage only to measure visits and performance. SPA tracking is disabled. The analytics beacon is not loaded on emergency, journal, settings, scripture, or devotional pages. There are no advertising networks or crash-reporting SDKs.</p>
              ) : (
                <p><strong>Analytics in this build.</strong> No Web Analytics beacon is loaded. There are no advertising networks or crash-reporting SDKs.</p>
              )}
              <p><strong>Data export and transfer.</strong> You can export all your data at any time via Settings &rarr; Data &amp; Backup. QR transfer also happens locally — no data is relayed through any server.</p>
              <p><strong>Changes to this policy.</strong> If the privacy practices of GraceGrip ever change materially, the changelog and release notes will reflect it. The source code is public and auditable at <a href="https://github.com/AIKUSAN/gracegrip-web" target="_blank" rel="noopener noreferrer" className="settings-oss-link" style={{ display: 'inline-flex' }}>github.com/AIKUSAN/gracegrip-web</a>.</p>
            </div>
          </details>
        </div>

      </section>

    </div>
  )
}
