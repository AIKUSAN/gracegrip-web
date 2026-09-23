/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { exportStateAsJson, importStateFromJson, initialState } from '../src/utils/storage.js'

test('selected backup excludes unchecked personal categories and keeps versioned format', () => {
  const state = {
    ...initialState,
    journalEntries: [{ id: 'example', content: 'synthetic private entry', date: '2026-01-01', mood: 'neutral' }],
    streak: { count: 2, lastCheckIn: '2026-01-02', longest: 2 },
    streakHistory: [{ startDate: '2026-01-01', endDate: '2026-01-02', days: 2 }],
    devotionalCompletedDays: ['2026-01-01'],
    favoriteVerseIds: ['verse-1'],
    profileName: 'Example',
  }
  const payload = exportStateAsJson(state, {
    journal: false,
    streak: true,
    favorites: false,
    settings: false,
  })
  const parsed = JSON.parse(payload)

  assert.equal(parsed.version, '1')
  assert.equal(parsed.app, 'gracegrip')
  assert.deepEqual(Object.keys(parsed.data).sort(), ['devotionalCompletedDays', 'streak', 'streakHistory'])
  assert.equal(payload.includes('synthetic private entry'), false)
  assert.equal(payload.includes('Example'), false)
  assert.equal(payload.includes('verse-1'), false)

  const imported = importStateFromJson(payload)
  assert.equal(imported.streak.count, 2)
  assert.deepEqual(imported.journalEntries, [])
})
