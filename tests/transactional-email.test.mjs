import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { sendAccountEmail, emailIsConfigured } from '../functions/lib/transactionalEmail.js'
import { unsubscribeToken } from '../functions/lib/transactionalEmail.js'
import { handleAccountRequest } from '../functions/lib/account.js'

function d1(db) {
  return { prepare(sql) { return { bind(...values) {
    const statement = db.prepare(sql)
    return { first: async () => statement.get(...values) ?? null, run: async () => statement.run(...values) }
  } } } }
}

test('account mail requires a GraceGrip sender and caps daily free-tier use', async () => {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec(readFileSync(new URL('../d1/accounts/migrations/0001_accounts.sql', import.meta.url), 'utf8'))
  const env = { ACCOUNT_DB: d1(sqlite), RESEND_API_KEY: 'test-key', RESEND_FROM: 'GraceGrip <no-reply@gracegrip.app>' }
  assert.equal(emailIsConfigured(env), true)
  assert.equal(emailIsConfigured({ ...env, RESEND_FROM: 'Other <no-reply@example.com>' }), false)
  let sent = 0
  const fakeFetch = async (_url, options) => {
    assert.equal(options.headers['Idempotency-Key'].startsWith('test-'), true)
    sent++
    return { ok: true }
  }
  for (let index = 0; index < 80; index++) {
    await sendAccountEmail(env, { to: 'person@example.com', subject: 'One-use code', text: 'Synthetic code', idempotencyKey: `test-${index}` }, fakeFetch)
  }
  await assert.rejects(sendAccountEmail(env, { to: 'person@example.com', subject: 'One-use code', text: 'Synthetic code', idempotencyKey: 'test-81' }, fakeFetch), /cap reached/)
  assert.equal(sent, 80)
  const quota = sqlite.prepare('SELECT used FROM email_quota WHERE quota_key LIKE ?').get('account:%')
  assert.equal(quota.used, 80)
})

test('article unsubscribe is independent of membership and synced progress', async () => {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec(readFileSync(new URL('../d1/accounts/migrations/0001_accounts.sql', import.meta.url), 'utf8'))
  sqlite.prepare('INSERT INTO accounts (id, created_at, verified_email, synced_progress) VALUES (?, ?, ?, ?)').run('member-1', '2026-01-01', 'member@example.com', '{"goals":[]}')
  const sessionToken = 'a'.repeat(43)
  const hash = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(sessionToken))))).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
  sqlite.prepare('INSERT INTO sessions (token_hash, account_id, authenticated_at, expires_at) VALUES (?, ?, ?, ?)').run(hash, 'member-1', new Date().toISOString(), '2099-01-01')
  const env = { ACCOUNT_DB: d1(sqlite), ACCOUNT_RATE_SECRET: 'a'.repeat(32), RECOVERY_PEPPER: 'b'.repeat(32), PASSKEY_ORIGIN: 'https://gracegrip.app', EMAIL_UNSUB_SECRET: 'c'.repeat(32), RESEND_API_KEY: 'synthetic', RESEND_FROM: 'GraceGrip <no-reply@gracegrip.app>' }
  const request = (action, body, withSession = false) => handleAccountRequest(new Request(`https://gracegrip.app/api/account/${action}`, { method: 'POST', headers: { Origin: 'https://gracegrip.app', 'Content-Type': 'application/json', ...(withSession ? { Cookie: `__Host-gg_session=${sessionToken}` } : {}) }, body: JSON.stringify(body) }), env, action)
  assert.equal((await request('article-preference', { optIn: true }, true)).status, 200)
  assert.equal(sqlite.prepare('SELECT article_email_opt_in FROM accounts WHERE id = ?').get('member-1').article_email_opt_in, 1)
  const token = await unsubscribeToken(env, 'member-1', 'member@example.com')
  assert.equal((await request('article-unsubscribe', { token })).status, 200)
  const row = sqlite.prepare('SELECT article_email_opt_in, verified_email, synced_progress FROM accounts WHERE id = ?').get('member-1')
  assert.equal(row.article_email_opt_in, 0)
  assert.equal(row.verified_email, 'member@example.com')
  assert.equal(row.synced_progress, '{"goals":[]}')
})

test('another signed-in account cannot consume an email verification code', async () => {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec(readFileSync(new URL('../d1/accounts/migrations/0001_accounts.sql', import.meta.url), 'utf8'))
  const encode = (bytes) => btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
  const digest = async (value) => encode(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))))
  const pepper = 'b'.repeat(32)
  const signKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(pepper), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const code = 'v'.repeat(43)
  const tokenHash = encode(new Uint8Array(await crypto.subtle.sign('HMAC', signKey, new TextEncoder().encode(`email:${code}`))))
  for (const accountId of ['owner', 'other']) {
    sqlite.prepare('INSERT INTO accounts (id, created_at) VALUES (?, ?)').run(accountId, '2026-01-01')
    sqlite.prepare('INSERT INTO sessions (token_hash, account_id, authenticated_at, expires_at) VALUES (?, ?, ?, ?)')
      .run(await digest(accountId.repeat(43).slice(0, 43)), accountId, new Date().toISOString(), '2099-01-01')
  }
  sqlite.prepare('INSERT INTO email_tokens (token_hash, account_id, kind, pending_email, expires_at) VALUES (?, ?, ?, ?, ?)')
    .run(tokenHash, 'owner', 'verify', 'owner@example.com', '2099-01-01')
  const env = { ACCOUNT_DB: d1(sqlite), ACCOUNT_RATE_SECRET: 'a'.repeat(32), RECOVERY_PEPPER: pepper, PASSKEY_ORIGIN: 'https://gracegrip.app' }
  const verify = (accountId) => handleAccountRequest(new Request('https://gracegrip.app/api/account/email-verify', {
    method: 'POST', headers: { Origin: 'https://gracegrip.app', Cookie: `__Host-gg_session=${accountId.repeat(43).slice(0, 43)}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  }), env, 'email-verify')
  assert.equal((await verify('other')).status, 400)
  assert.equal(sqlite.prepare('SELECT consumed_at FROM email_tokens WHERE token_hash = ?').get(tokenHash).consumed_at, null)
  assert.equal((await verify('owner')).status, 200)
  assert.equal(sqlite.prepare('SELECT verified_email FROM accounts WHERE id = ?').get('owner').verified_email, 'owner@example.com')
})
