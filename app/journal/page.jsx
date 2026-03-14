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
            GraceGrip includes a private, encrypted journal for your recovery journey.
            Write freely — your entries are encrypted with AES via the Web Crypto API and
            stored only on your device. Nothing is ever sent to a server or synced to the cloud.
          </p>
          <h2>Journal Features</h2>
          <ul>
            <li>AES encryption — entries are encrypted before saving</li>
            <li>Mood tracking — log how you are feeling with each entry</li>
            <li>Filter by mood — review entries by emotional state</li>
            <li>100% private — no account, no sync, no server</li>
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
