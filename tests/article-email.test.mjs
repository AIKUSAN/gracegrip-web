import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { runArticleEmail } from '../workers/article-email.js'

function d1(db) {
  return { prepare(sql) { return { bind(...values) {
    const statement = db.prepare(sql)
    return { first: async () => statement.get(...values) ?? null, all: async () => ({ results: statement.all(...values) }), run: async () => statement.run(...values) }
  } } } }
}

test('article notices send only approved articles once to opted-in verified accounts', async () => {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec('PRAGMA foreign_keys = ON')
  sqlite.exec(readFileSync(new URL('../d1/accounts/migrations/0001_accounts.sql', import.meta.url), 'utf8'))
  sqlite.prepare('INSERT INTO accounts (id, created_at, verified_email, article_email_opt_in) VALUES (?, ?, ?, ?)').run('member-1', '2026-01-01', 'member@example.com', 1)
  sqlite.prepare('INSERT INTO accounts (id, created_at, verified_email, article_email_opt_in) VALUES (?, ?, ?, ?)').run('member-2', '2026-01-01', 'other@example.com', 0)
  const env = { ACCOUNT_DB: d1(sqlite), RESEND_API_KEY: 'synthetic', EMAIL_UNSUB_SECRET: 'synthetic-secret-long-enough-for-hmac-test' }
  const approved = { slug: 'reviewed-guide', title: 'Reviewed guide', reviewStatus: 'approved' }
  const pending = { slug: 'draft-guide', title: 'Draft guide', reviewStatus: 'pending' }
  const messages = []
  const sender = async (_env, message) => { messages.push(message) }
  assert.equal(await runArticleEmail(env, [approved, pending], sender), 1)
  assert.equal(await runArticleEmail(env, [approved, pending], sender), 0)
  assert.equal(messages.length, 1)
  assert.equal(messages[0].to, 'member@example.com')
  assert.match(messages[0].text, /unsubscribe#/)
  assert.doesNotMatch(messages[0].text, /Draft guide/)
  sqlite.prepare('UPDATE accounts SET article_email_opt_in = 0 WHERE id = ?').run('member-1')
  assert.equal(await runArticleEmail(env, [{ ...approved, slug: 'second-guide' }], sender), 0)
})
