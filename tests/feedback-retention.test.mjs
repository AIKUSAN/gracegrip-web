/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DatabaseSync } from 'node:sqlite'
import { feedbackMessageCutoff } from '../src/lib/feedbackRetention.js'
import { redactExpiredFeedback, runRetention } from '../workers/feedback-retention.js'

function d1Adapter(database) {
  return {
    prepare(statement) {
      return {
        bind(...params) {
          return {
            async run() {
              const result = database.prepare(statement).run(...params)
              return { meta: { changes: Number(result.changes) } }
            },
          }
        },
      }
    },
  }
}

test('90-day cleanup clears only expired message text and keeps ratings and row IDs', async () => {
  const database = new DatabaseSync(':memory:')
  try {
    database.exec('CREATE TABLE user_feedback (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, rating INTEGER NOT NULL, message TEXT)')
    const insert = database.prepare('INSERT INTO user_feedback VALUES (?, ?, ?, ?)')
    const now = Date.parse('2026-09-23T12:00:00.000Z')
    insert.run('old', '2026-06-24T11:59:59.999000Z', 2, 'remove me')
    insert.run('boundary', feedbackMessageCutoff(now), 3, 'keep me')
    insert.run('recent', '2026-06-26T12:00:00.000Z', 5, 'keep me too')
    insert.run('empty-old', '2026-06-20T12:00:00.000Z', 4, null)

    const cutoff = feedbackMessageCutoff(now)
    const first = await redactExpiredFeedback(d1Adapter(database), cutoff)
    const second = await redactExpiredFeedback(d1Adapter(database), cutoff)
    assert.equal(first, 1)
    assert.equal(second, 0)
    assert.deepEqual(
      database.prepare('SELECT id, rating, message FROM user_feedback ORDER BY id').all().map((row) => ({ ...row })),
      [
        { id: 'boundary', rating: 3, message: 'keep me' },
        { id: 'empty-old', rating: 4, message: null },
        { id: 'old', rating: 2, message: null },
        { id: 'recent', rating: 5, message: 'keep me too' },
      ],
    )
  } finally {
    database.close()
  }
})

test('a note crossing the cutoff between Cron and rollback is cleared in both stores', async () => {
  const d1 = new DatabaseSync(':memory:')
  const neonCopy = new DatabaseSync(':memory:')
  try {
    for (const database of [d1, neonCopy]) {
      database.exec('CREATE TABLE user_feedback (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, rating INTEGER NOT NULL, message TEXT)')
      database.prepare('INSERT INTO user_feedback VALUES (?, ?, ?, ?)').run(
        'boundary-row', '2026-06-25T04:00:00.000Z', 4, 'sensitive note',
      )
    }

    const makeNeonClient = () => async (_strings, cutoff) => {
      const result = neonCopy.prepare(
        'UPDATE user_feedback SET message = NULL WHERE message IS NOT NULL AND julianday(created_at) < julianday(?)',
      ).run(cutoff)
      return [{ count: Number(result.changes) }]
    }
    const env = {
      FEEDBACK_DB: d1Adapter(d1),
      NEON_DATABASE_URL: 'postgres://example.neon.tech/feedback',
      NEON_RETENTION_REQUIRED: 'true',
    }
    const atCron = await runRetention(env, Date.parse('2026-09-23T03:00:00.000Z'), makeNeonClient)
    assert.deepEqual([atCron.d1Redacted, atCron.neonRedacted], [0, 0])

    const atRollback = await runRetention(env, Date.parse('2026-09-23T05:00:00.000Z'), makeNeonClient)
    assert.deepEqual([atRollback.d1Redacted, atRollback.neonRedacted], [1, 1])
    for (const database of [d1, neonCopy]) {
      assert.deepEqual({ ...database.prepare('SELECT id, rating, message FROM user_feedback').get() }, {
        id: 'boundary-row', rating: 4, message: null,
      })
    }
  } finally {
    d1.close()
    neonCopy.close()
  }
})

test('preview cleanup never connects to Neon, even if a secret is present', async () => {
  const database = new DatabaseSync(':memory:')
  try {
    database.exec('CREATE TABLE user_feedback (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, rating INTEGER NOT NULL, message TEXT)')
    const result = await runRetention({
      FEEDBACK_DB: d1Adapter(database),
      NEON_DATABASE_URL: 'postgres://example.neon.tech/feedback',
      NEON_RETENTION_REQUIRED: 'false',
    }, Date.parse('2026-09-23T03:00:00.000Z'), () => {
      throw new Error('Preview accessed Neon.')
    })
    assert.equal(result.neonRedacted, 0)
  } finally {
    database.close()
  }
})
