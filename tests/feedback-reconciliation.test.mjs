/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { d1FeedbackPageRequest, fingerprintRow, reconcileRows, validateD1Count } from '../scripts/lib/feedback-reconciliation.mjs'

const example = {
  id: '11111111-1111-4111-8111-111111111111',
  created_at: '2026-09-23T12:34:56.123Z',
  rating: 4,
  message: null,
}

test('D1 pagination request serializes every API parameter as a string', () => {
  const requestBody = JSON.parse(JSON.stringify(d1FeedbackPageRequest(example.id, 100)))
  assert.deepEqual(requestBody, {
    sql: 'SELECT id, created_at, rating, message FROM user_feedback WHERE id > ? ORDER BY id LIMIT ?',
    params: [example.id, '100'],
  })
  assert.ok(requestBody.params.every((param) => typeof param === 'string'))
  assert.throws(() => d1FeedbackPageRequest('', 0), /Invalid D1 feedback page request/)
})

test('reconciliation is idempotent and normalizes D1 millisecond timestamps', async () => {
  const rows = new Map()
  const operations = {
    insert: async (row) => {
      if (!rows.has(row.id)) rows.set(row.id, { ...row, created_at: '2026-09-23T12:34:56.123000Z' })
    },
    lookup: async (id) => rows.get(id) ?? null,
  }

  assert.equal(await reconcileRows([example], operations), 1)
  assert.equal(await reconcileRows([example], operations), 1)
  assert.equal(rows.size, 1)
  assert.equal(fingerprintRow(example), fingerprintRow(rows.get(example.id)))
})

test('reconciliation rejects an existing row with the same ID but different content', async () => {
  const rows = new Map([[example.id, { ...example, rating: 2 }]])
  await assert.rejects(
    reconcileRows([example], {
      insert: async () => {},
      lookup: async (id) => rows.get(id) ?? null,
    }),
    /reconciliation mismatch/,
  )
})

test('verify-only reconciliation rejects a missing target row', async () => {
  await assert.rejects(
    reconcileRows([example], {
      insert: async () => {},
      lookup: async () => null,
    }),
    /reconciliation mismatch/,
  )
})

test('D1 count gate requires explicit allowance for post-cutover rows', () => {
  assert.equal(validateD1Count(1, 1), 0)
  assert.throws(() => validateD1Count(1, 2), /additional rows/)
  assert.equal(validateD1Count(1, 2, true), 1)
  assert.throws(() => validateD1Count(2, 1, true), /lower than/)
})
