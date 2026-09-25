import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { handleEditorialRequest } from '../functions/lib/editorial.js'
import { readPublishedRegistry } from '../functions/lib/githubPublish.js'
import { parseChatGPTDraft } from '../src/lib/editorialDraft.js'

function d1(db) {
  return { prepare(sql) { return { bind(...values) {
    const statement = db.prepare(sql)
    return {
      first: async () => statement.get(...values) ?? null,
      all: async () => ({ results: statement.all(...values) }),
      run: async () => statement.run(...values),
    }
  } } } }
}

function setup() {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec('PRAGMA foreign_keys = ON')
  sqlite.exec(readFileSync(new URL('../d1/editorial/migrations/0001_drafts.sql', import.meta.url), 'utf8'))
  const env = { EDITORIAL_DB: d1(sqlite), EDITOR_ORIGIN: 'https://preview.gracegrip.app' }
  const request = (action, role, body, origin = env.EDITOR_ORIGIN) => handleEditorialRequest(new Request(`${env.EDITOR_ORIGIN}/api/editor/${action}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { Origin: origin, 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }), env, action, { getRole: async () => role, publish: async () => 'https://github.com/AIKUSAN/gracegrip-web/pull/123' })
  return { sqlite, request }
}

const editor = { role: 'editor', subject: 'writer', qualifiedReviewer: false }
const reviewer = { role: 'editor', subject: 'qualified-reviewer', qualifiedReviewer: true }
const owner = { role: 'owner', subject: 'owner', qualifiedReviewer: false }
const article = {
  slug: 'first-guide', title: 'First guide', description: 'A test guide.', category: 'Focus guide',
  sections: [{ heading: 'Start', body: 'A reviewed paragraph.' }], source: 'https://www.who.int/',
  penName: '', bylineConsent: false,
}

test('editorial health guide requires independent reviewer and owner before a draft PR', async () => {
  const { sqlite, request } = setup()
  let response = await request('save', editor, { article })
  assert.equal(response.status, 200)
  const { id } = await response.json()
  response = await request('approve', owner, { id })
  assert.equal(response.status, 409)
  response = await request('review', editor, { id })
  assert.equal(response.status, 403)
  response = await request('review', reviewer, { id })
  assert.equal(response.status, 200)
  response = await request('approve', editor, { id })
  assert.equal(response.status, 403)
  response = await request('approve', owner, { id })
  assert.equal(response.status, 200)
  response = await request('publish', owner, { id })
  assert.equal(response.status, 200)
  assert.match((await response.json()).prUrl, /\/pull\/123$/)
  assert.equal(sqlite.prepare('SELECT status FROM drafts WHERE id = ?').get(id).status, 'pr_open')
})

test('revising a private draft clears qualified review and rejects stale saves', async () => {
  const { sqlite, request } = setup()
  const saved = await (await request('save', editor, { article })).json()
  await request('review', reviewer, { id: saved.id })
  const revised = await request('save', editor, { id: saved.id, revision: 1, article: { ...article, title: 'Revised guide' } })
  assert.equal(revised.status, 200)
  assert.equal((await revised.json()).revision, 2)
  assert.equal((await request('approve', owner, { id: saved.id })).status, 409)
  assert.equal((await request('save', editor, { id: saved.id, revision: 1, article })).status, 409)
  assert.equal(sqlite.prepare('SELECT qualified_reviewer FROM drafts WHERE id = ?').get(saved.id).qualified_reviewer, null)
  assert.equal((await request('delete', owner, { id: saved.id })).status, 200)
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM draft_revisions').get().count, 0)
})

test('editorial edits cannot replace a publishing draft', async () => {
  const { sqlite, request } = setup()
  const saved = await (await request('save', editor, { article })).json()
  sqlite.prepare("UPDATE drafts SET status = 'publishing' WHERE id = ?").run(saved.id)
  assert.equal((await request('save', editor, { id: saved.id, revision: 1, article: { ...article, title: 'Late edit' } })).status, 409)
  assert.equal((await request('request-changes', owner, { id: saved.id })).status, 409)
  assert.equal(sqlite.prepare('SELECT title FROM drafts WHERE id = ?').get(saved.id).title, 'First guide')
})

test('editorial requests reject cross-site mutations and fail closed without a separate D1 store', async () => {
  const { request } = setup()
  assert.equal((await request('save', editor, { article }, 'https://attacker.example')).status, 403)
  const response = await handleEditorialRequest(new Request('https://preview.gracegrip.app/api/editor/list'), { EDITOR_ORIGIN: 'https://preview.gracegrip.app' }, 'list', { getRole: async () => owner })
  assert.equal(response.status, 503)
})

test('ChatGPT import fills only a valid Markdown draft', () => {
  assert.deepEqual(parseChatGPTDraft('# Title\n## Part\nDraft content'), { title: 'Title', sections: [{ heading: 'Part', body: 'Draft content' }] })
  assert.equal(parseChatGPTDraft('No headings'), null)
})

test('publishing registry parses a data-only JavaScript module for Pages Functions', () => {
  assert.deepEqual(readPublishedRegistry('export default [{"slug":"guide-alcohol"}]\n'), [{ slug: 'guide-alcohol' }])
  assert.throws(() => readPublishedRegistry('export default (() => [])()'), SyntaxError)
  assert.throws(() => readPublishedRegistry('const articles = []'), /registry is invalid/)
})
