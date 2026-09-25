/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
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
    <>
      <noscript>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '640px', margin: '0 auto' }}>
          <h1>Private Journal — GraceGrip</h1>
          <p>
            GraceGrip includes a private journal for the thoughts you choose to record.
            Entries are encrypted before device-local storage when Web Crypto is available.
            They are not included in optional progress sync and are never read by an AI helper automatically.
          </p>
          <h2>Journal Features</h2>
          <ul>
            <li>Device encryption when Web Crypto is available</li>
            <li>Mood tracking — log how you are feeling with each entry</li>
            <li>Filter by mood — review entries by emotional state</li>
            <li>Device-local storage and a readable JSON backup you can export</li>
          </ul>
          <p>Your journal belongs to you. Free, encrypted, private.</p>
        </main>
      </noscript>
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
    </>
  )
}
