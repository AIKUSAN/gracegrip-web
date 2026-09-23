/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { onRequest, onRequestPost } from '../functions/api/feedback.js'

function request(body) {
  return new Request('https://gracegrip.app/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

test('valid feedback is inserted once with a UUID and the existing success contract', async () => {
  const inserts = []
  const env = {
    FEEDBACK_DB: {
      prepare(statement) {
        assert.match(statement, /^INSERT INTO user_feedback/)
        return {
          bind(...values) {
            inserts.push(values)
            return { run: async () => ({ success: true }) }
          },
        }
      },
    },
  }
  const response = await onRequestPost({ request: request({ rating: 4, message: '  helpful  ' }), env })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.match(inserts[0][0], /^[0-9a-f-]{36}$/)
  assert.deepEqual(inserts[0].slice(1), [4, 'helpful'])
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.equal(inserts.length, 1)
})

test('bad rating and oversized note keep the prior 400 responses', async () => {
  const invalidRating = await onRequestPost({ request: request({ rating: 0 }), env: {} })
  assert.deepEqual(await invalidRating.json(), { ok: false, error: 'Choose a rating from 1 to 5.' })
  const longNote = await onRequestPost({ request: request({ rating: 5, message: 'x'.repeat(501) }), env: {} })
  assert.deepEqual(await longNote.json(), { ok: false, error: 'Feedback note is too long.' })
  const jsonNull = await onRequestPost({ request: request('null'), env: {} })
  assert.deepEqual(await jsonNull.json(), { ok: false, error: 'Choose a rating from 1 to 5.' })
})

test('invalid and excessive JSON is rejected before D1 access', async () => {
  for (const body of ['{', 'x'.repeat(5000)]) {
    const response = await onRequestPost({ request: request(body), env: {} })
    assert.equal(response.status, 400)
    assert.deepEqual(await response.json(), { ok: false, error: 'Invalid feedback payload.' })
  }
})

test('unconfigured or failed D1 keeps the prior service errors without leaking details', async () => {
  const missing = await onRequestPost({ request: request({ rating: 5 }), env: {} })
  assert.equal(missing.status, 503)
  assert.deepEqual(await missing.json(), { ok: false, error: 'Feedback not configured.' })

  const failed = await onRequestPost({
    request: request({ rating: 5, message: 'private note' }),
    env: { FEEDBACK_DB: { prepare: () => ({ bind: () => ({ run: () => { throw Error('private note') } }) }) } },
  })
  assert.equal(failed.status, 500)
  const failedBody = await failed.text()
  assert.deepEqual(JSON.parse(failedBody), { ok: false, error: 'Feedback could not be saved.' })
  assert.equal(failedBody.includes('private note'), false)
})

test('other HTTP methods are denied', async () => {
  const response = onRequest()
  assert.equal(response.status, 405)
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
})
