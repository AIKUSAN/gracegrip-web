import assert from 'node:assert/strict'
import { test } from 'node:test'
import { handleAccountRequest } from '../functions/lib/account.js'
import { readJsonLimited, validateSyncPayload } from '../functions/lib/accountSafety.js'

test('synced data contains only explicitly selected goals and no journal', () => {
  const input = {
    confirmSync: true, baseRevision: 0, selectedFocusIds: ['nicotine'],
    goals: [
      { focusId: 'nicotine', startedAt: '2026-09-25', trackDays: true, plan: { intention: 'Try a change' } },
      { focusId: 'anger', startedAt: '2026-09-25', trackDays: false, plan: { intention: 'Private' } },
    ],
    goalCheckins: [{ focusId: 'nicotine', date: '2026-09-25', status: 'step' }, { focusId: 'anger', date: '2026-09-25', status: 'step' }],
    emblems: ['grounding', 'days:1:nicotine', 'days:1:anger'],
    journalEntries: [{ content: 'never upload' }],
  }
  const result = validateSyncPayload(input)
  assert.equal(result.goals.length, 1)
  assert.equal(result.goalCheckins.length, 1)
  assert.deepEqual(result.emblems, ['grounding', 'days:1:nicotine'])
  assert.equal(JSON.stringify(result).includes('never upload'), false)
  assert.equal(JSON.stringify(result).includes('Private'), false)
})

test('sync requires an explicit choice and bounded data', () => {
  const base = { baseRevision: 0, selectedFocusIds: [], goals: [], goalCheckins: [], emblems: [] }
  assert.equal(validateSyncPayload(base), null)
  assert.equal(validateSyncPayload({ ...base, confirmSync: true, selectedFocusIds: ['unknown'] }), null)
  assert.equal(validateSyncPayload({ ...base, confirmSync: true, goalCheckins: Array(3651).fill({}) }), null)
})

test('oversized account JSON is rejected before parsing', async () => {
  const request = new Request('https://gracegrip.app/api/account/sync', { method: 'POST', body: JSON.stringify({ text: 'x'.repeat(100) }) })
  assert.equal(await readJsonLimited(request, 32), null)
})

test('account endpoints fail closed without separate binding and origin', async () => {
  const request = new Request('https://gracegrip.app/api/account/session')
  const response = await handleAccountRequest(request, {}, 'session')
  assert.equal(response.status, 503)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
})
