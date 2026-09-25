import { readJsonLimited } from './accountSafety.js'
import { verifyOwnerAccess } from './ownerAccess.js'

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer',
} })
const now = () => new Date().toISOString()
const room = (env) => env.COMMUNITY_ROOM.getByName('one-room')
const roomCall = (env, path, body) => room(env).fetch(new Request(`https://internal${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body ?? {}) }))

export async function handleCommunityOwnerRequest(request, env, action) {
  if (!env.COMMUNITY_DB || !env.COMMUNITY_ROOM || !env.PASSKEY_ORIGIN) return json({ error: 'Owner controls unavailable.' }, 503)
  if (!(await verifyOwnerAccess(request, env))) return json({ error: 'Owner access required.' }, 403)
  const origin = new URL(env.PASSKEY_ORIGIN).origin
  if (new URL(request.url).origin !== origin) return json({ error: 'Owner controls unavailable.' }, 503)
  if (request.method !== 'GET' && request.headers.get('Origin') !== origin) return json({ error: 'Request origin denied.' }, 403)
  try {
    if (action === 'queue' && request.method === 'GET') {
      const posts = await env.COMMUNITY_DB.prepare(`SELECT p.id, p.body, p.submitted_at, p.ai_flag, m.id AS member_id, m.alias, m.avatar_id FROM posts p JOIN members m ON m.id = p.member_id WHERE p.status = 'pending' ORDER BY p.submitted_at ASC LIMIT 50`).all()
      const aliases = await env.COMMUNITY_DB.prepare(`SELECT a.id, a.requested_alias, a.created_at, m.alias AS current_alias FROM alias_requests a JOIN members m ON m.id = a.member_id WHERE a.status = 'pending' ORDER BY a.created_at ASC LIMIT 50`).all()
      const reports = await env.COMMUNITY_DB.prepare('SELECT id, reason, body_snapshot, reported_member_id, created_at FROM incident_evidence WHERE expires_at > ? ORDER BY created_at DESC LIMIT 30').bind(now()).all()
      return json({ posts: posts.results, aliases: aliases.results, reports: reports.results })
    }
    if (action === 'heartbeat' && request.method === 'POST') {
      const settings = await env.COMMUNITY_DB.prepare('SELECT shutdown FROM room_settings WHERE id = 1').first()
      if (settings?.shutdown === 1) return json({ error: 'Use Enable after a shutdown.' }, 409)
      const response = await roomCall(env, '/heartbeat')
      return json(await response.json(), response.status)
    }
    if (['close', 'shutdown', 'enable'].includes(action) && request.method === 'POST') {
      if (action === 'shutdown') await env.COMMUNITY_DB.prepare('UPDATE room_settings SET shutdown = 1 WHERE id = 1').run()
      if (action === 'enable') await env.COMMUNITY_DB.prepare('UPDATE room_settings SET shutdown = 0 WHERE id = 1').run()
      const response = await roomCall(env, `/${action}`)
      return json(await response.json(), response.status)
    }
    if (action === 'schedule' && request.method === 'POST') {
      const payload = await readJsonLimited(request, 512)
      const next = payload?.nextSessionAt
      if (next !== null && (typeof next !== 'string' || Number.isNaN(Date.parse(next)) || Date.parse(next) <= Date.now())) return json({ error: 'Choose a future session time or clear the schedule.' }, 400)
      await env.COMMUNITY_DB.prepare('UPDATE room_settings SET next_session_at = ? WHERE id = 1').bind(next ? new Date(next).toISOString() : null).run()
      return json({ ok: true, nextSessionAt: next })
    }
    if (['approve', 'reject'].includes(action) && request.method === 'POST') {
      const payload = await readJsonLimited(request, 512)
      if (typeof payload?.postId !== 'string') return json({ error: 'Choose a pending post.' }, 400)
      if (action === 'approve') {
        const stateResponse = await room(env).fetch('https://internal/state')
        const state = await stateResponse.json()
        if (!state.open) return json({ error: 'Open and host the room before approving posts.' }, 409)
      }
      const status = action === 'approve' ? 'approved' : 'rejected'
      const row = await env.COMMUNITY_DB.prepare('UPDATE posts SET status = ?, reviewed_at = ? WHERE id = ? AND status = ? RETURNING id')
        .bind(status, now(), payload.postId, 'pending').first()
      if (!row) return json({ error: 'Post is no longer pending.' }, 409)
      if (action === 'approve') {
        const response = await roomCall(env, '/publish', { id: row.id })
        return json({ ok: true, approved: true, liveNotificationSent: response.ok })
      }
      return json({ ok: true, approved: false })
    }
    if (['approve-alias', 'reject-alias'].includes(action) && request.method === 'POST') {
      const payload = await readJsonLimited(request, 512)
      if (typeof payload?.requestId !== 'string') return json({ error: 'Choose a pending alias.' }, 400)
      const row = await env.COMMUNITY_DB.prepare('SELECT id, member_id, requested_alias FROM alias_requests WHERE id = ? AND status = ?').bind(payload.requestId, 'pending').first()
      if (!row) return json({ error: 'Alias is no longer pending.' }, 409)
      const approved = action === 'approve-alias'
      const statements = [env.COMMUNITY_DB.prepare('UPDATE alias_requests SET status = ? WHERE id = ? AND status = ?').bind(approved ? 'approved' : 'rejected', row.id, 'pending')]
      if (approved) statements.push(env.COMMUNITY_DB.prepare('UPDATE members SET alias = ? WHERE id = ? AND removed_at IS NULL').bind(row.requested_alias, row.member_id))
      await env.COMMUNITY_DB.batch(statements)
      return json({ ok: true, approved })
    }
    if (action === 'remove' && request.method === 'POST') {
      const payload = await readJsonLimited(request, 512)
      if (typeof payload?.memberId !== 'string') return json({ error: 'Choose a member.' }, 400)
      await env.COMMUNITY_DB.batch([
        env.COMMUNITY_DB.prepare('UPDATE members SET banned_at = ? WHERE id = ?').bind(now(), payload.memberId),
        env.COMMUNITY_DB.prepare('UPDATE posts SET status = ?, reviewed_at = ? WHERE member_id = ? AND status IN (?, ?)').bind('rejected', now(), payload.memberId, 'pending', 'approved'),
      ])
      return json({ ok: true })
    }
    return json({ error: 'Not found.' }, 404)
  } catch { return json({ error: 'Owner controls temporarily unavailable.' }, 503) }
}
