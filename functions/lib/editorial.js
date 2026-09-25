import { readJsonLimited } from './accountSafety.js'
import { editorialRole } from './ownerAccess.js'
import { createPublishingPullRequest } from './githubPublish.js'
import { validateArticleDraft } from '../../src/lib/editorialDraft.js'

const responseHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
}
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: responseHeaders })
const now = () => new Date().toISOString()
const healthReviewNeeded = (category) => category !== 'Faith reflection'

function configuredOrigin(env) {
  try {
    const origin = new URL(env.EDITOR_ORIGIN)
    return origin.protocol === 'https:' && origin.pathname === '/' ? origin.origin : null
  } catch { return null }
}

function decodeDraft(row) {
  if (!row) return null
  return {
    id: row.id, slug: row.slug, title: row.title, description: row.description,
    category: row.category, sections: JSON.parse(row.sections_json), source: row.source_url,
    penName: row.pen_name, bylineConsent: row.byline_consent === 1,
    status: row.status, revision: row.revision, createdBy: row.created_by,
    updatedBy: row.updated_by, approvedBy: row.approved_by,
    qualifiedReviewer: row.qualified_reviewer,
    qualifiedReviewRevision: row.qualified_review_revision,
    prUrl: row.pr_url, updatedAt: row.updated_at,
  }
}

async function getDraft(db, id) {
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return null
  return db.prepare('SELECT * FROM drafts WHERE id = ?').bind(id).first()
}

export async function handleEditorialRequest(request, env, action, deps = {}) {
  const origin = configuredOrigin(env)
  if (!env.EDITORIAL_DB || !origin) return json({ error: 'Private editor is unavailable.' }, 503)
  if (new URL(request.url).origin !== origin) return json({ error: 'Private editor is unavailable.' }, 503)
  const identity = await (deps.getRole ?? editorialRole)(request, env)
  if (!identity) return json({ error: 'Editorial access required.' }, 403)
  if (request.method !== 'GET' && request.headers.get('Origin') !== origin) return json({ error: 'Request origin denied.' }, 403)
  const db = env.EDITORIAL_DB
  try {
    if (action === 'list' && request.method === 'GET') {
      const rows = await db.prepare('SELECT id, slug, title, category, status, revision, updated_at, qualified_reviewer, qualified_review_revision, pr_url FROM drafts ORDER BY updated_at DESC LIMIT 100').all()
      return json({ drafts: rows.results, role: identity.role, qualifiedReviewer: identity.qualifiedReviewer })
    }
    if (action === 'get' && request.method === 'GET') {
      const row = await getDraft(db, new URL(request.url).searchParams.get('id'))
      return row ? json({ draft: decodeDraft(row) }) : json({ error: 'Draft not found.' }, 404)
    }
    if (action === 'save' && request.method === 'POST') {
      const payload = await readJsonLimited(request, 22_000)
      const article = validateArticleDraft(payload?.article)
      if (!article) return json({ error: 'Complete the title, slug, description, category, and sections.' }, 400)
      const existing = payload.id ? await getDraft(db, payload.id) : null
      if (payload.id && !existing) return json({ error: 'Draft not found.' }, 404)
      if (existing && (existing.revision !== payload.revision || !['draft', 'changes_requested'].includes(existing.status))) {
        return json({ error: 'This draft changed. Reload before editing.' }, 409)
      }
      const timestamp = now()
      const id = existing?.id ?? crypto.randomUUID()
      const revision = existing ? existing.revision + 1 : 1
      const snapshot = JSON.stringify(article)
      if (existing) {
        const updated = await db.prepare(`UPDATE drafts SET slug = ?, title = ?, description = ?, category = ?, sections_json = ?, source_url = ?, pen_name = ?, byline_consent = ?, status = 'draft', revision = ?, updated_by = ?, updated_at = ?, approved_by = NULL, approved_at = NULL, qualified_reviewer = NULL, qualified_review_revision = NULL, qualified_reviewed_at = NULL WHERE id = ? AND revision = ? AND status IN ('draft', 'changes_requested') RETURNING id`)
          .bind(article.slug, article.title, article.description, article.category, JSON.stringify(article.sections), article.source, article.penName, article.bylineConsent ? 1 : 0, revision, identity.subject, timestamp, id, existing.revision).first()
        if (!updated) return json({ error: 'This draft changed. Reload before editing.' }, 409)
      } else {
        await db.prepare(`INSERT INTO drafts (id, slug, title, description, category, sections_json, source_url, pen_name, byline_consent, status, revision, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 1, ?, ?, ?, ?)`)
          .bind(id, article.slug, article.title, article.description, article.category, JSON.stringify(article.sections), article.source, article.penName, article.bylineConsent ? 1 : 0, identity.subject, identity.subject, timestamp, timestamp).run()
      }
      await db.prepare('INSERT INTO draft_revisions (id, draft_id, revision, content_json, edited_by, created_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(crypto.randomUUID(), id, revision, snapshot, identity.subject, timestamp).run()
      return json({ ok: true, id, revision })
    }
    const payload = await readJsonLimited(request, 1000)
    const row = await getDraft(db, payload?.id)
    if (!row) return json({ error: 'Draft not found.' }, 404)
    if (action === 'review' && request.method === 'POST') {
      if (!identity.qualifiedReviewer || identity.subject === row.created_by) return json({ error: 'An independent qualified reviewer is required.' }, 403)
      if (!['draft', 'changes_requested'].includes(row.status)) return json({ error: 'Draft is no longer reviewable.' }, 409)
      const reviewed = await db.prepare(`UPDATE drafts SET qualified_reviewer = ?, qualified_review_revision = ?, qualified_reviewed_at = ? WHERE id = ? AND revision = ? AND status IN ('draft', 'changes_requested') RETURNING id`)
        .bind(identity.subject, row.revision, now(), row.id, row.revision).first()
      return reviewed ? json({ ok: true, reviewedRevision: row.revision }) : json({ error: 'Draft changed before review.' }, 409)
    }
    if (action === 'request-changes' && request.method === 'POST') {
      if (identity.role !== 'owner') return json({ error: 'Owner approval required.' }, 403)
      if (!['draft', 'approved'].includes(row.status)) return json({ error: 'Draft cannot be returned now.' }, 409)
      const returned = await db.prepare(`UPDATE drafts SET status = 'changes_requested', approved_by = NULL, approved_at = NULL, updated_at = ? WHERE id = ? AND revision = ? AND status IN ('draft', 'approved') RETURNING id`)
        .bind(now(), row.id, row.revision).first()
      return returned ? json({ ok: true }) : json({ error: 'Draft changed before this request.' }, 409)
    }
    if (action === 'approve' && request.method === 'POST') {
      if (identity.role !== 'owner') return json({ error: 'Owner approval required.' }, 403)
      if (!['draft', 'changes_requested'].includes(row.status)) return json({ error: 'Draft is no longer approvable.' }, 409)
      if (healthReviewNeeded(row.category) && (row.qualified_review_revision !== row.revision || !row.qualified_reviewer)) {
        return json({ error: 'A qualified reviewer must sign off on this revision.' }, 409)
      }
      const updated = await db.prepare(`UPDATE drafts SET status = 'approved', approved_by = ?, approved_at = ?, updated_at = ? WHERE id = ? AND revision = ? AND status IN ('draft', 'changes_requested') RETURNING id`)
        .bind(identity.subject, now(), now(), row.id, row.revision).first()
      return updated ? json({ ok: true }) : json({ error: 'Draft changed before approval.' }, 409)
    }
    if (action === 'delete' && request.method === 'POST') {
      if (identity.role !== 'owner') return json({ error: 'Owner approval required.' }, 403)
      if (row.status === 'pr_open') return json({ error: 'Close the publishing pull request before deleting this draft.' }, 409)
      const removed = await db.prepare(`DELETE FROM drafts WHERE id = ? AND status != 'publishing' AND status != 'pr_open' RETURNING id`).bind(row.id).first()
      return removed ? json({ ok: true }) : json({ error: 'Draft is being published. Close the pull request first.' }, 409)
    }
    if (action === 'publish' && request.method === 'POST') {
      if (identity.role !== 'owner') return json({ error: 'Owner approval required.' }, 403)
      if (row.status === 'pr_open') return json({ ok: true, prUrl: row.pr_url })
      const stale = row.status === 'publishing' && Date.now() - Date.parse(row.updated_at) > 10 * 60_000
      if (row.status !== 'approved' && !stale) return json({ error: 'Approve the current revision before preparing a pull request.' }, 409)
      const claimed = await db.prepare(`UPDATE drafts SET status = 'publishing', updated_at = ? WHERE id = ? AND revision = ? AND status = ? RETURNING id`)
        .bind(now(), row.id, row.revision, row.status).first()
      if (!claimed) return json({ error: 'Another publishing attempt is running.' }, 409)
      try {
        const prUrl = await (deps.publish ?? createPublishingPullRequest)(row, env)
        await db.prepare(`UPDATE drafts SET status = 'pr_open', pr_url = ?, updated_at = ? WHERE id = ? AND status = 'publishing'`)
          .bind(prUrl, now(), row.id).run()
        return json({ ok: true, prUrl })
      } catch {
        await db.prepare(`UPDATE drafts SET status = 'approved', updated_at = ? WHERE id = ? AND status = 'publishing'`).bind(now(), row.id).run()
        return json({ error: 'Publishing pull request could not be prepared. Retry after checking the GitHub App.' }, 503)
      }
    }
    return json({ error: 'Not found.' }, 404)
  } catch {
    return json({ error: 'Private editor temporarily unavailable.' }, 503)
  }
}
