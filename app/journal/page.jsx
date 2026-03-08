'use client'

import { useApp } from '@/context/AppContext'
import AppShell from '@/components/AppShell'
import { JournalPage } from '@/components/pages/JournalPage'

export default function Page() {
  const {
    journalMood,
    setJournalMood,
    journalContent,
    setJournalContent,
    onSaveJournalEntry,
    journalMoodFilter,
    setJournalMoodFilter,
    sortedJournalEntries,
    onDeleteJournalEntry,
  } = useApp()

  return (
    <AppShell>
      <JournalPage
        journalMood={journalMood}
        onChangeJournalMood={setJournalMood}
        journalContent={journalContent}
        onChangeJournalContent={setJournalContent}
        onSaveJournalEntry={onSaveJournalEntry}
        journalMoodFilter={journalMoodFilter}
        onChangeJournalMoodFilter={setJournalMoodFilter}
        sortedJournalEntries={sortedJournalEntries}
        onDeleteJournalEntry={onDeleteJournalEntry}
      />
    </AppShell>
  )
}
