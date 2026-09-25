import { getAccountSession } from './account.js'
import { readJsonLimited } from './accountSafety.js'
import { eraseCommunityMember } from './communityDeletion.js'
import { CHAT_DAYS, COMMUNITY_RULES_VERSION, INCIDENT_DAYS, freshAlias, retentionDate, validateAlias, validateAvatar, validatePost } from '../../src/lib/communityPolicy.js'

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer',
} })
const now = () => new Date().toISOString()
const room = (env) => env.COMMUNITY_ROOM.getByName('one-room')
const roomCall = (env, path, method = 'GET', body) => room(env).fetch(new Request(`https://internal${path}`, {
  method,
  headers: body ? { 'Content-Type': 'application/json' } : undefined,
  body: body ? JSON.stringify(body) : undefined,
}))

async function memberFor(request, env) {
  const session = await getAccountSession(request, env.ACCOUNT_DB)
  if (!session) return { session: null, member: null }
  const member = await env.COMMUNITY_DB.prepare('SELECT id, account_id, alias, avatar_id, rules_version, banned_at FROM members WHERE account_id = ? AND removed_at IS NULL')
    .bind(session.account_id).first()
  return { session, member }
}

async function roomStatus(env) {
  const settings = await env.COMMUNITY_DB.prepare('SELECT next_session_at, shutdown FROM room_settings WHERE id = 1').first()
  const response = await roomCall(env, '/state')
  const live = await response.json()
  return { open: settings?.shutdown !== 1 && live.open === true, nextSessionAt: settings?.next_session_at ?? null, shutdown: settings?.shutdown === 1 }
}

export async function handleCommunityRequest(request, env, action) {
  if (!env.ACCOUNT_DB || !env.COMMUNITY_DB || !env.COMMUNITY_ROOM || !env.PASSKEY_ORIGIN) return json({ error: 'Community is unavailable.' }, 503)
  const origin = new URL(env.PASSKEY_ORIGIN).origin
  if (new URL(request.url).origin !== origin) return json({ error: 'Community is unavailable.' }, 503)
  if (request.method !== 'GET' && request.headers.get('Origin') !== origin) return json({ error: 'Request origin denied.' }, 403)
  try {
    if (action === 'status' && request.method === 'GET') return json(await roomStatus(env))
    const { session, member } = await memberFor(request, env)
    if (!session) return json({ error: 'Sign in required.' }, 401)
    if (action === 'join' && request.method === 'POST') {
      const payload = await readJsonLimited(request, 1024)
      if (payload?.acceptRules !== true || payload?.rulesVersion !== COMMUNITY_RULES_VERSION) return json({ error: 'Accept the current room rules first.' }, 400)
      const avatarId = validateAvatar(payload.avatarId)
      if (!avatarId) return json({ error: 'Choose a catalog avatar.' }, 400)
      if (member?.banned_at) return json({ error: 'Community access is unavailable.' }, 403)
      if (member) return json({ memberId: member.id, alias: member.alias, avatarId: member.avatar_id })
      const old = await env.COMMUNITY_DB.prepare('SELECT id, banned_at FROM members WHERE account_id = ?').bind(session.account_id).first()
      if (old?.banned_at) return json({ error: 'Community access is unavailable.' }, 403)
      const alias = freshAlias()
      const id = crypto.randomUUID()
      if (old) await env.COMMUNITY_DB.prepare('UPDATE members SET id = ?, alias = ?, avatar_id = ?, rules_version = ?, joined_at = ?, removed_at = NULL WHERE account_id = ?').bind(id, alias, avatarId, COMMUNITY_RULES_VERSION, now(), session.account_id).run()
      else await env.COMMUNITY_DB.prepare('INSERT INTO members (id, account_id, alias, avatar_id, rules_version, joined_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, session.account_id, alias, avatarId, COMMUNITY_RULES_VERSION, now()).run()
      return json({ memberId: id, alias, avatarId })
    }
    if (action === 'me' && request.method === 'GET') return json({ joined: Boolean(member && !member.banned_at && member.rules_version === COMMUNITY_RULES_VERSION), alias: member?.alias ?? null, avatarId: member?.avatar_id ?? null, memberId: member?.id ?? null })
    if (!member || member.banned_at || member.rules_version !== COMMUNITY_RULES_VERSION) return json({ error: 'Join the room and accept its rules first.' }, 403)
    if (action === 'leave' && request.method === 'POST') {
      await eraseCommunityMember(env.COMMUNITY_DB, session.account_id)
      return json({ ok: true, incidentEvidenceMayRemainUntil: retentionDate(INCIDENT_DAYS) })
    }
    if (action === 'alias' && request.method === 'POST') {
      const payload = await readJsonLimited(request, 512)
      const alias = validateAlias(payload?.alias)
      if (!alias) return json({ error: 'Use 3–24 letters, numbers, spaces, hyphens, or underscores.' }, 400)
      const pending = await env.COMMUNITY_DB.prepare('SELECT id FROM alias_requests WHERE member_id = ? AND status = ?').bind(member.id, 'pending').first()
      if (pending) return json({ error: 'An alias request is already awaiting review.' }, 409)
      await env.COMMUNITY_DB.prepare('INSERT INTO alias_requests (id, member_id, requested_alias, status, created_at) VALUES (?, ?, ?, ?, ?)')
        .bind(crypto.randomUUID(), member.id, alias, 'pending', now()).run()
      return json({ ok: true, pendingApproval: true })
    }
    if (action === 'messages' && request.method === 'GET') {
      const rows = await env.COMMUNITY_DB.prepare(`SELECT p.id, p.body, p.reviewed_at, m.id AS member_id, m.alias, m.avatar_id FROM posts p JOIN members m ON m.id = p.member_id
        WHERE p.status = 'approved' AND p.expires_at > ? AND m.removed_at IS NULL AND m.banned_at IS NULL
        AND NOT EXISTS (SELECT 1 FROM member_blocks b WHERE b.blocker_id = ? AND b.blocked_id = m.id)
        ORDER BY p.reviewed_at DESC LIMIT 50`).bind(now(), member.id).all()
      return json({ messages: rows.results.reverse().map((row) => ({ id: row.id, body: row.body, at: row.reviewed_at, senderId: row.member_id, alias: row.alias, avatarId: row.avatar_id })) })
    }
    if (action === 'socket' && request.method === 'GET' && request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
      return room(env).fetch(new Request('https://internal/socket', { headers: { Upgrade: 'websocket' } }))
    }
    if (action === 'post' && request.method === 'POST') {
      const status = await roomStatus(env)
      if (!status.open) return json({ error: 'The room is read-only until the owner hosts a session.' }, 409)
      const payload = await readJsonLimited(request, 2048)
      const body = validatePost(payload?.body)
      if (!body) return json({ error: 'Use text only, up to 700 characters, without links or contact details.' }, 400)
      const pending = await env.COMMUNITY_DB.prepare('SELECT COUNT(*) AS count FROM posts WHERE member_id = ? AND status = ?').bind(member.id, 'pending').first()
      if (pending.count >= 3) return json({ error: 'Please wait for your earlier posts to be reviewed.' }, 429)
      const time = now()
      const threshold = new Date(Date.now() - 30_000).toISOString()
      const rate = await env.COMMUNITY_DB.prepare(`INSERT INTO post_rate (member_id, last_post_at) VALUES (?, ?) ON CONFLICT(member_id) DO UPDATE SET last_post_at = excluded.last_post_at WHERE last_post_at < ? RETURNING last_post_at`)
        .bind(member.id, time, threshold).first()
      if (!rate) return json({ error: 'Wait a moment before posting again.' }, 429)
      const id = crypto.randomUUID()
      await env.COMMUNITY_DB.prepare('INSERT INTO posts (id, member_id, body, status, submitted_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(id, member.id, body, 'pending', time, retentionDate(CHAT_DAYS)).run()
      return json({ ok: true, postId: id, pendingApproval: true })
    }
    if (action === 'report' && request.method === 'POST') {
      const payload = await readJsonLimited(request, 512)
      const reason = payload?.reason
      if (!['harm', 'harassment', 'privacy', 'other'].includes(reason) || typeof payload?.postId !== 'string') return json({ error: 'Choose a report reason.' }, 400)
      const recent = await env.COMMUNITY_DB.prepare('SELECT COUNT(*) AS count FROM incident_evidence WHERE reporter_id = ? AND created_at > ?').bind(member.id, new Date(Date.now() - 86_400_000).toISOString()).first()
      if (recent.count >= 5) return json({ error: 'Report limit reached. Contact the owner if urgent.' }, 429)
      const post = await env.COMMUNITY_DB.prepare('SELECT id, member_id, body FROM posts WHERE id = ? AND status = ?').bind(payload.postId, 'approved').first()
      if (!post) return json({ error: 'Post not found.' }, 404)
      await env.COMMUNITY_DB.prepare('INSERT INTO incident_evidence (id, reporter_id, reported_member_id, post_id, reason, body_snapshot, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(crypto.randomUUID(), member.id, post.member_id, post.id, reason, post.body, now(), retentionDate(INCIDENT_DAYS)).run()
      return json({ ok: true })
    }
    if (['block', 'unblock'].includes(action) && request.method === 'POST') {
      const payload = await readJsonLimited(request, 512)
      if (typeof payload?.memberId !== 'string' || payload.memberId === member.id) return json({ error: 'Choose another member.' }, 400)
      const target = await env.COMMUNITY_DB.prepare('SELECT id FROM members WHERE id = ? AND removed_at IS NULL').bind(payload.memberId).first()
      if (!target) return json({ error: 'Member not found.' }, 404)
      if (action === 'block') await env.COMMUNITY_DB.prepare('INSERT OR IGNORE INTO member_blocks (blocker_id, blocked_id) VALUES (?, ?)').bind(member.id, target.id).run()
      else await env.COMMUNITY_DB.prepare('DELETE FROM member_blocks WHERE blocker_id = ? AND blocked_id = ?').bind(member.id, target.id).run()
      return json({ ok: true })
    }
    return json({ error: 'Not found.' }, 404)
  } catch { return json({ error: 'Community is temporarily unavailable.' }, 503) }
}
