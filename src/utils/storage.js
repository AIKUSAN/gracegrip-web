/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { encryptString, decryptString, encryptJson, decryptJson } from './crypto'

const STORAGE_KEY = 'gracegrip_v1'

export const initialState = {
  streak: {
    count: 0,
    lastCheckIn: '',
    longest: 0,
  },
  reminder: {
    enabled: false,
    time: '20:00',
  },
  favoriteVerseIds: [],
  journalEntries: [],
  devotionalCompletedDays: [],
  streakHistory: [],
  themePreference: 'system',
  onboardingComplete: false,
  profileName: '',
  profileCreatedAt: '',
  lastExportDate: '',
}

const normalizeState = (candidate) => {
  const safeCandidate = candidate && typeof candidate === 'object' ? candidate : {}
  const favoriteVerseIds = Array.isArray(safeCandidate.favoriteVerseIds)
    ? safeCandidate.favoriteVerseIds.filter((value) => typeof value === 'string')
    : []
  const journalEntries = Array.isArray(safeCandidate.journalEntries)
    ? safeCandidate.journalEntries.filter(
        (entry) =>
          entry &&
          typeof entry === 'object' &&
          typeof entry.id === 'string' &&
          typeof entry.content === 'string' &&
          typeof entry.date === 'string' &&
          typeof entry.mood === 'string',
      )
    : []
  const themePreference =
    safeCandidate.themePreference === 'light' ||
    safeCandidate.themePreference === 'dark' ||
    safeCandidate.themePreference === 'system'
      ? safeCandidate.themePreference
      : initialState.themePreference
  const hasExistingUsage =
    Boolean((safeCandidate.streak && safeCandidate.streak.count > 0) ||
      (safeCandidate.streak && safeCandidate.streak.lastCheckIn) ||
      favoriteVerseIds.length > 0 ||
      journalEntries.length > 0)
  const onboardingComplete =
    typeof safeCandidate.onboardingComplete === 'boolean'
      ? safeCandidate.onboardingComplete
      : hasExistingUsage
  const profileName = typeof safeCandidate.profileName === 'string' ? safeCandidate.profileName : ''
  const profileCreatedAt =
    typeof safeCandidate.profileCreatedAt === 'string' ? safeCandidate.profileCreatedAt : ''

  const devotionalCompletedDays = Array.isArray(safeCandidate.devotionalCompletedDays)
    ? safeCandidate.devotionalCompletedDays.filter((v) => typeof v === 'string')
    : []
  const streakHistory = Array.isArray(safeCandidate.streakHistory)
    ? safeCandidate.streakHistory.filter(
        (entry) =>
          entry &&
          typeof entry === 'object' &&
          typeof entry.startDate === 'string' &&
          typeof entry.endDate === 'string' &&
          typeof entry.days === 'number',
      )
    : []

  const lastExportDate =
    typeof safeCandidate.lastExportDate === 'string' ? safeCandidate.lastExportDate : ''

  return {
    ...initialState,
    ...safeCandidate,
    streak: {
      ...initialState.streak,
      ...(safeCandidate.streak || {}),
    },
    reminder: {
      ...initialState.reminder,
      ...(safeCandidate.reminder || {}),
    },
    favoriteVerseIds,
    journalEntries,
    devotionalCompletedDays,
    streakHistory,
    themePreference,
    onboardingComplete,
    profileName,
    profileCreatedAt,
    lastExportDate,
  }
}

/**
 * Loads and decrypts app state from localStorage.
 * Backward-compatible: unencrypted legacy data is transparently handled.
 *
 * @returns {Promise<object>}
 */
export const loadAppState = async () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState

    const parsed = JSON.parse(raw)

    // Decrypt the three sensitive fields in parallel.
    // decryptJson / decryptString pass through legacy plaintext arrays / strings unchanged.
    const [journalEntries, profileName, streakHistory] = await Promise.all([
      decryptJson(parsed.journalEntries),
      decryptString(parsed.profileName ?? ''),
      decryptJson(parsed.streakHistory),
    ])

    return normalizeState({
      ...parsed,
      journalEntries: journalEntries ?? [],
      profileName: profileName ?? '',
      streakHistory: streakHistory ?? [],
    })
  } catch {
    return initialState
  }
}

/**
 * Encrypts sensitive fields then serialises the full state to localStorage.
 *
 * @param {object} state
 * @returns {Promise<void>}
 */
export const saveAppState = async (state) => {
  const [journalEntries, profileName, streakHistory] = await Promise.all([
    encryptJson(state.journalEntries),
    encryptString(state.profileName),
    encryptJson(state.streakHistory),
  ])
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...state, journalEntries, profileName, streakHistory }),
  )
}

export const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const addOneDay = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return formatDate(new Date(y, m - 1, d + 1))
}

export const updateStreak = (state) => {
  const today = formatDate(new Date())

  if (state.streak.lastCheckIn === today) {
    return state
  }

  const shouldIncrement =
    state.streak.lastCheckIn && addOneDay(state.streak.lastCheckIn) === today

  return {
    ...state,
    streak: {
      count: shouldIncrement ? state.streak.count + 1 : 1,
      lastCheckIn: today,
      longest: Math.max(state.streak.longest || 0, shouldIncrement ? state.streak.count + 1 : 1),
    },
  }
}

export const resetStreak = (state) => ({
  ...state,
  streak: {
    count: 0,
    lastCheckIn: '',
    longest: state.streak.longest || 0,
  },
})

export const toggleFavoriteVerse = (state, verseId) => {
  const exists = state.favoriteVerseIds.includes(verseId)
  const favoriteVerseIds = exists
    ? state.favoriteVerseIds.filter((id) => id !== verseId)
    : [...state.favoriteVerseIds, verseId]

  return {
    ...state,
    favoriteVerseIds,
  }
}

export const addJournalEntry = (state, content, mood) => {
  const entry = {
    id: String(Date.now()),
    content,
    date: new Date().toISOString(),
    mood,
  }

  return {
    ...state,
    journalEntries: [entry, ...state.journalEntries],
  }
}

export const deleteJournalEntry = (state, entryId) => ({
  ...state,
  journalEntries: state.journalEntries.filter((entry) => entry.id !== entryId),
})

export const clearJournal = (state) => ({
  ...state,
  journalEntries: [],
})

export const exportStateAsJson = (
  state,
  selections = { journal: true, streak: true, favorites: true, settings: true },
) => {
  const data = {}
  if (selections.journal) data.journalEntries = state.journalEntries
  if (selections.streak) {
    data.streak = state.streak
    data.streakHistory = state.streakHistory
    data.devotionalCompletedDays = state.devotionalCompletedDays
  }
  if (selections.favorites) data.favoriteVerseIds = state.favoriteVerseIds
  if (selections.settings) {
    data.themePreference = state.themePreference
    data.reminder = state.reminder
    data.profileName = state.profileName
    data.profileCreatedAt = state.profileCreatedAt
    data.onboardingComplete = state.onboardingComplete
  }
  return JSON.stringify(
    { version: '1', app: 'gracegrip', exportedAt: new Date().toISOString(), data },
    null,
    2,
  )
}

export const importStateFromJson = (payload) => {
  try {
    const parsed = JSON.parse(payload)
    // Support versioned format { version, app, data } as well as legacy flat format
    const candidate =
      parsed && parsed.app === 'gracegrip' && parsed.data && typeof parsed.data === 'object'
        ? parsed.data
        : parsed
    return normalizeState(candidate)
  } catch {
    return null
  }
}

export const toggleDevotionalCompletion = (state, isoDate) => {
  const exists = state.devotionalCompletedDays.includes(isoDate)
  const devotionalCompletedDays = exists
    ? state.devotionalCompletedDays.filter((d) => d !== isoDate)
    : [...state.devotionalCompletedDays, isoDate]
  return { ...state, devotionalCompletedDays }
}

export const addStreakHistory = (state, entry) => ({
  ...state,
  streakHistory: [...state.streakHistory, entry],
})
