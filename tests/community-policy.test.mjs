import assert from 'node:assert/strict'
import { test } from 'node:test'
import { freshAlias, validateAlias, validateAvatar, validatePost, retentionDate } from '../src/lib/communityPolicy.js'
import { CommunityRoom } from '../workers/community-room.js'

test('community inputs remain text-only, bounded, and anonymous by default', () => {
  assert.equal(freshAlias(new Uint8Array([0, 0, 7])), 'Quiet River 007')
  assert.equal(validateAvatar('cedar'), 'cedar')
  assert.equal(validateAvatar('selfie'), null)
  assert.equal(validateAlias('  Kind  River  '), 'Kind River')
  assert.equal(validateAlias('me@example.com'), null)
  assert.equal(validatePost('Please pray for me.'), 'Please pray for me.')
  assert.equal(validatePost('Find me at https://example.com'), null)
  assert.equal(validatePost('x'.repeat(701)), null)
  assert.equal(validatePost('hello\u0000there'), null)
  assert.equal(retentionDate(30, 0), '1970-01-31T00:00:00.000Z')
})

test('room is read-only without owner lease and shutdown overrides heartbeat', async () => {
  const values = new Map()
  const sockets = [{ messages: [], send(message) { this.messages.push(JSON.parse(message)) } }]
  const ctx = {
    storage: {
      get: async (key) => values.get(key),
      put: async (key, value) => values.set(key, value),
      setAlarm: async (value) => values.set('alarm', value),
    },
    getWebSockets: () => sockets,
  }
  const room = new CommunityRoom(ctx)
  const send = (path, body = {}) => room.fetch(new Request(`https://internal${path}`, { method: 'POST', body: JSON.stringify(body) }))
  assert.equal((await (await room.fetch(new Request('https://internal/state'))).json()).open, false)
  assert.equal((await send('/publish', { id: 'post-1' })).status, 409)
  assert.equal((await send('/heartbeat')).status, 200)
  assert.equal((await (await room.fetch(new Request('https://internal/state'))).json()).open, true)
  assert.equal((await send('/publish', { id: 'post-1' })).status, 200)
  assert.deepEqual(sockets[0].messages.at(-1), { type: 'post-available', id: 'post-1' })
  await send('/shutdown')
  assert.equal((await send('/heartbeat')).status, 409)
  assert.equal((await (await room.fetch(new Request('https://internal/state'))).json()).open, false)
})
