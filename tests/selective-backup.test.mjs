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
    goals: [{ focusId: 'nicotine', startedAt: '2026-01-01', trackDays: true }],
    goalCheckins: [{ focusId: 'nicotine', date: '2026-01-02', status: 'step' }],
    emblems: ['grounding'],
    puzzleBest: 4,
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
  assert.deepEqual(Object.keys(parsed.data).sort(), ['devotionalCompletedDays', 'emblems', 'goalCheckins', 'goals', 'puzzleBest', 'streak', 'streakHistory'])
  assert.equal(payload.includes('synthetic private entry'), false)
  assert.equal(payload.includes('Example'), false)
  assert.equal(payload.includes('verse-1'), false)

  const imported = importStateFromJson(payload)
  assert.equal(imported.streak.count, 2)
  assert.equal(imported.goals[0].focusId, state.goals[0].focusId)
  assert.deepEqual(imported.goals[0].plan, { intention: '', trigger: '', nextStep: '', support: '' })
  assert.deepEqual(imported.emblems, state.emblems)
  assert.deepEqual(imported.journalEntries, [])
})

test('old backup loads without assigning the historic streak to a focus goal', () => {
  const oldBackup = JSON.stringify({ version: '1', app: 'gracegrip', data: { streak: { count: 9, lastCheckIn: '2026-01-09', longest: 9 } } })
  const imported = importStateFromJson(oldBackup)
  assert.equal(imported.streak.count, 9)
  assert.deepEqual(imported.goals, [])
  assert.deepEqual(imported.goalCheckins, [])
})
