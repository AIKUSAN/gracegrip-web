import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { runCommunityRetention } from '../workers/community-retention.js'

function adapter(db) {
  return { prepare(sql) { return { bind(...values) { const statement = db.prepare(sql); return { run: () => statement.run(...values) } } } } }
}

test('30-day chat and 90-day incident expiry remove old text but keep recent records', async () => {
  const community = new DatabaseSync(':memory:')
  const account = new DatabaseSync(':memory:')
  community.exec(readFileSync(new URL('../d1/community/migrations/0001_community.sql', import.meta.url), 'utf8'))
  account.exec(readFileSync(new URL('../d1/accounts/migrations/0001_accounts.sql', import.meta.url), 'utf8'))
  community.prepare('INSERT INTO members (id, account_id, alias, avatar_id, rules_version, joined_at) VALUES (?, ?, ?, ?, ?, ?)').run('m1', 'a1', 'Quiet River', 'cedar', 1, '2026-01-01')
  community.prepare('INSERT INTO posts (id, member_id, body, status, submitted_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)').run('old', 'm1', 'old synthetic text', 'approved', '2026-01-01', '2026-09-24')
  community.prepare('INSERT INTO posts (id, member_id, body, status, submitted_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)').run('recent', 'm1', 'recent synthetic text', 'approved', '2026-09-24', '2026-10-24')
  community.prepare('INSERT INTO incident_evidence (id, reporter_id, reason, body_snapshot, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)').run('e-old', 'm1', 'harm', 'old incident', '2026-06-01', '2026-09-24')
  community.prepare('INSERT INTO incident_evidence (id, reporter_id, reason, body_snapshot, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)').run('e-recent', 'm1', 'harm', 'recent incident', '2026-09-20', '2026-12-20')
  await runCommunityRetention({ COMMUNITY_DB: adapter(community), ACCOUNT_DB: adapter(account) }, new Date('2026-09-25T00:00:00Z'))
  assert.deepEqual(community.prepare('SELECT id FROM posts ORDER BY id').all().map((row) => row.id), ['recent'])
  assert.deepEqual(community.prepare('SELECT id FROM incident_evidence ORDER BY id').all().map((row) => row.id), ['e-recent'])
})
