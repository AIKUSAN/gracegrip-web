/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { devotionals, verses } from '../content/loaders'
import {
  loadAppState,
  saveAppState,
  updateStreak,
  resetStreak,
  toggleFavoriteVerse,
  addJournalEntry,
  deleteJournalEntry,
  clearJournal,
  exportStateAsJson,
  importStateFromJson,
  toggleDevotionalCompletion,
  addStreakHistory,
  initialState,
  formatDate,
  addOneDay,
} from '../utils/storage'
import { DAILY_ENCOURAGEMENTS, EMERGENCY_ENCOURAGEMENTS } from '../data/encouragements'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [today] = useState(() => new Date())
  // Initialise with blank state; the real state is loaded asynchronously from
  // localStorage after decryption.  stateLoaded gates rendering and persistence.
  const [stateLoaded, setStateLoaded] = useState(false)
  const [appState, setAppState] = useState(initialState)
  const [activeScriptureTab, setActiveScriptureTab] = useState('temptation')
  const [panicActive, setPanicActive] = useState(false)
  const [panicVerse, setPanicVerse] = useState(verses[0])
  const [secondsLeft, setSecondsLeft] = useState(180)
  const [journalMood, setJournalMood] = useState('neutral')
  const [journalContent, setJournalContent] = useState('')
  const [journalMoodFilter, setJournalMoodFilter] = useState('all')
  const [welcomeName, setWelcomeName] = useState('')
  const [profileNameInput, setProfileNameInput] = useState(appState.profileName || '')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const fileInputRef = useRef(null)
  const [backupSelections, setBackupSelections] = useState({
    journal: true, streak: true, favorites: true, settings: true,
  })
  const isMobileDevice =
    typeof navigator !== 'undefined' &&
    /android|iphone|ipad|ipod/i.test(navigator.userAgent)
  const canShare =
    isMobileDevice &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [new File([''], 'x', { type: 'application/json' })] })

  // Load and decrypt persisted state on mount (async — Web Crypto API)
  useEffect(() => {
    loadAppState().then((state) => {
      setAppState(state)
      setProfileNameInput(state.profileName || '')
      setStateLoaded(true)
    })
  }, [])

  // Persist state to localStorage (encrypt sensitive fields)
  useEffect(() => {
    if (!stateLoaded) return // don't overwrite real data with blank initialState
    saveAppState(appState)
  }, [appState, stateLoaded])

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement
    const preference = appState.themePreference || 'system'

    if (preference === 'light') {
      root.classList.remove('dark')
      return undefined
    }

    if (preference === 'dark') {
      root.classList.add('dark')
      return undefined
    }

    // system
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const applySystemTheme = () => {
      root.classList.toggle('dark', mediaQuery.matches)
    }
    applySystemTheme()
    mediaQuery.addEventListener('change', applySystemTheme)
    return () => mediaQuery.removeEventListener('change', applySystemTheme)
  }, [appState.themePreference])

  // Panic countdown timer
  useEffect(() => {
    if (!panicActive || secondsLeft <= 0) return undefined

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [panicActive, secondsLeft])

  // ─── Memos ────────────────────────────────────────────────────────────
  const todayDevotional = useMemo(() => {
    // Use day-of-month (1–31, local time) so the plan aligns with the calendar month
    const dayOfMonth = today.getDate()
    return devotionals[(dayOfMonth - 1) % devotionals.length]
  }, [today])

  const encouragementOfDay = useMemo(() => {
    const startOfYear = new Date(today.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / 86400000)
    return DAILY_ENCOURAGEMENTS[dayOfYear % DAILY_ENCOURAGEMENTS.length]
  }, [today])

  const emergencyEncouragement = useMemo(() => {
    const dayKey = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate()
    return EMERGENCY_ENCOURAGEMENTS[dayKey % EMERGENCY_ENCOURAGEMENTS.length]
  }, [today])

  const greeting = useMemo(() => {
    const hour = today.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [today])

  const filteredVerses = useMemo(
    () => verses.filter((verse) => verse.category === activeScriptureTab),
    [activeScriptureTab],
  )

  const emergencyVerses = useMemo(() => verses.filter((verse) => verse.panic), [])

  const sortedJournalEntries = useMemo(
    () =>
      [...appState.journalEntries]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .filter((entry) => journalMoodFilter === 'all' || entry.mood === journalMoodFilter),
    [appState.journalEntries, journalMoodFilter],
  )

  const currentThemePreference = appState.themePreference || 'system'
  const panicMode = secondsLeft > 0 ? 'Breathe and pray. You are not alone.' : 'Well done. Take the next faithful step.'

  // ─── Handlers ─────────────────────────────────────────────────────────
  const onThemeChange = (preference) => {
    setAppState((current) => ({ ...current, themePreference: preference }))
  }

  const cycleThroughThemes = () => {
    const options = ['light', 'dark', 'system']
    const currentIndex = options.indexOf(currentThemePreference)
    const nextTheme = options[(currentIndex + 1) % options.length]
    onThemeChange(nextTheme)
  }

  const onBeginJourney = () => {
    setAppState((current) => ({
      ...current,
      onboardingComplete: true,
      profileName: welcomeName.trim(),
      profileCreatedAt: current.profileCreatedAt || new Date().toISOString(),
    }))
  }

  const onCopyVerse = async (text, reference) => {
    try {
      await navigator.clipboard.writeText(`"${text}" — ${reference}`)
      toast.success('Copied!')
    } catch {
      toast.error('Unable to copy on this browser.')
    }
  }

  const onFavoriteToggle = (verseId) => {
    setAppState((current) => toggleFavoriteVerse(current, verseId))
  }

  const onSaveJournalEntry = () => {
    if (!journalContent.trim()) return
    setAppState((current) => addJournalEntry(current, journalContent.trim(), journalMood))
    setJournalContent('')
    setJournalMood('neutral')
    toast.success('Entry saved.')
  }

  const onDeleteJournalEntry = (entryId) => {
    setAppState((current) => deleteJournalEntry(current, entryId))
  }

  const onClearJournal = () => {
    if (window.confirm('Delete all journal entries? This cannot be undone.')) {
      setAppState((current) => clearJournal(current))
    }
  }

  const onExportData = () => {
    toast.warning(
      'Your backup contains personal recovery data. Store it securely and never share it.',
      { duration: 6000 },
    )
    const payload = exportStateAsJson(appState)
    const blob = new Blob([payload], { type: 'application/json' })
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `gracegrip-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    window.URL.revokeObjectURL(blobUrl)
  }

  const onImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const onImportChange = (event) => {
    const [file] = event.target.files || []
    if (!file) return

    if (file.size > 1_048_576) {
      toast.error('That file is too large to be a valid GraceGrip backup.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const nextState = importStateFromJson(String(reader.result || ''))
      if (nextState) {
        setAppState(nextState)
        toast.success('Backup restored.')
      } else {
        window.alert('Backup file is invalid. Please choose a GraceGrip JSON backup file.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const onResetStreakWithConfirm = () => {
    if (window.confirm('Reset your streak and begin fresh today?')) {
      setAppState((current) => {
        let next = current
        if (current.streak.count > 0 && current.streak.lastCheckIn) {
          const endDate = current.streak.lastCheckIn
          const startDate = new Date(endDate)
          startDate.setDate(startDate.getDate() - current.streak.count + 1)
          next = addStreakHistory(next, {
            startDate: startDate.toISOString().slice(0, 10),
            endDate,
            days: current.streak.count,
          })
        }
        return resetStreak(next)
      })
    }
  }

  const onSaveProfileName = () => {
    const nextName = profileNameInput.trim()
    setAppState((current) => ({ ...current, profileName: nextName }))
    toast.success('Profile saved.')
  }

  const onToggleBackupSelection = (key) => {
    setBackupSelections((current) => ({ ...current, [key]: !current[key] }))
  }

  const onShareData = async (selections) => {
    if (!canShare) return
    try {
      const payload = exportStateAsJson(appState, selections)
      const file = new File([payload], `gracegrip-backup-${new Date().toISOString().slice(0, 10)}.json`, { type: 'application/json' })
      await navigator.share({ files: [file], title: 'GraceGrip Backup' })
    } catch (err) {
      if (err?.name === 'AbortError') return // user dismissed the share sheet — not an error
      toast.error('Could not share backup.')
    }
  }

  const daysSinceBackup = appState.lastExportDate
    ? Math.floor((today.getTime() - new Date(appState.lastExportDate).getTime()) / 86400000)
    : null

  const onToggleReminder = () => {
    setAppState((current) => ({
      ...current,
      reminder: { ...current.reminder, enabled: !current.reminder?.enabled },
    }))
  }

  const onChangeReminderTime = (time) => {
    setAppState((current) => ({
      ...current,
      reminder: { ...current.reminder, time },
    }))
  }

  const onQRImport = (stateJson) => {
    const nextState = importStateFromJson(stateJson)
    if (nextState) {
      setAppState(nextState)
      toast.success('Data imported via QR.')
    } else {
      toast.error('Invalid QR data.')
    }
  }

  const onSubmitFeedback = async (rating, message) => {
    if (!supabase) return { ok: false, error: 'Feedback not configured.' }
    try {
      const { error } = await supabase.from('user_feedback').insert({ rating, message })
      if (error) return { ok: false, error: error.message }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  }

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
    const seconds = String(totalSeconds % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  const formatHistoryDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const panicButtonHandler = () => {
    const focusVerses = verses.filter((verse) => verse.panic)
    const randomVerse = focusVerses[Math.floor(Math.random() * focusVerses.length)]
    setPanicVerse(randomVerse)
    setSecondsLeft(180)
    setPanicActive(true)
  }

  const value = {
    // State
    stateLoaded,
    today,
    appState,
    activeScriptureTab,
    setActiveScriptureTab,
    panicActive,
    setPanicActive,
    panicVerse,
    secondsLeft,
    journalMood,
    setJournalMood,
    journalContent,
    setJournalContent,
    journalMoodFilter,
    setJournalMoodFilter,
    welcomeName,
    setWelcomeName,
    profileNameInput,
    setProfileNameInput,
    sidebarExpanded,
    setSidebarExpanded,
    fileInputRef,
    // Derived / memos
    checkedInToday: appState.streak.lastCheckIn === formatDate(new Date()),
    todayDevotional,
    encouragementOfDay,
    emergencyEncouragement,
    greeting,
    filteredVerses,
    emergencyVerses,
    sortedJournalEntries,
    currentThemePreference,
    panicMode,
    verses,
    devotionals,
    // Handlers
    onThemeChange,
    cycleThroughThemes,
    onBeginJourney,
    onCopyVerse,
    onFavoriteToggle,
    onSaveJournalEntry,
    onDeleteJournalEntry,
    onClearJournal,
    onExportData,
    onImportClick,
    onImportChange,
    onResetStreakWithConfirm,
    onSaveProfileName,
    formatTime,
    formatHistoryDate,
    panicButtonHandler,
    backupSelections,
    onToggleBackupSelection,
    canShare,
    onShareData,
    daysSinceBackup,
    onToggleReminder,
    onChangeReminderTime,
    onQRImport,
    onSubmitFeedback,
    onStayedClean: () => {
      const today = formatDate(new Date())
      if (appState.streak.lastCheckIn === today) return
      const isConsecutive =
        appState.streak.lastCheckIn && addOneDay(appState.streak.lastCheckIn) === today
      const newCount = isConsecutive ? appState.streak.count + 1 : 1
      setAppState((current) => updateStreak(current))
      toast.success(`Day ${newCount} complete! Keep walking in freedom.`)
    },
    onStumbledToday: () => setAppState((current) => resetStreak(current)),
    onToggleDevotionalDay: (todayIso, isCompletedToday) => {
      setAppState((current) => toggleDevotionalCompletion(current, todayIso))
      if (!isCompletedToday) toast.success('Day marked complete! Keep going.')
    },
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
