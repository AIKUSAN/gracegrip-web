/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { SettingsPage } from '@/components/pages/SettingsPage'

export default function Page() {
  const {
    profileNameInput,
    setProfileNameInput,
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
    onQRImport,
    onResetStreakWithConfirm,
    onClearJournal,
    appState,
    formatHistoryDate,
    onToggleReminder,
    onChangeReminderTime,
    onSubmitFeedback,
  } = useApp()

  return (
    <>
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>Settings — GraceGrip</h1>
          <p>
            Manage your GraceGrip experience: set your profile name, choose between light,
            dark, or system theme, configure daily reminders, and manage your private data backup.
          </p>
          <h2>Settings Options</h2>
          <ul>
            <li>Profile name — personalize your experience</li>
            <li>Theme — light, dark, or follow system preference</li>
            <li>Daily reminder — set a notification time for check-ins</li>
            <li>Backup &amp; restore — export or import your encrypted data</li>
            <li>QR transfer — move your data between devices without internet</li>
            <li>Reset &amp; clear — manage your recovery data privately</li>
          </ul>
          <p>All settings and data stay on your device. Free, private, no account required.</p>
        </main>
      </noscript>
      <AppShell>
        <SettingsPage
        profileNameInput={profileNameInput}
        onChangeProfileNameInput={setProfileNameInput}
        onSaveProfileName={onSaveProfileName}
        onExportData={onExportData}
        onShareData={onShareData}
        onImportClick={onImportClick}
        onImportChange={onImportChange}
        fileInputRef={fileInputRef}
        canShare={canShare}
        daysSinceBackup={daysSinceBackup}
        backupSelections={backupSelections}
        onToggleBackupSelection={onToggleBackupSelection}
        appState={appState}
        onQRImport={onQRImport}
        onResetStreakWithConfirm={onResetStreakWithConfirm}
        onClearJournal={onClearJournal}
        streakHistory={appState.streakHistory || []}
        formatHistoryDate={formatHistoryDate}
        reminder={appState.reminder}
        onToggleReminder={onToggleReminder}
        onChangeReminderTime={onChangeReminderTime}
        onSubmitFeedback={onSubmitFeedback}
      />
      </AppShell>
    </>
  )
}
