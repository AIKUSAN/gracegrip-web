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
  )
}
