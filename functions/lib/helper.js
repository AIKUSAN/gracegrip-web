import { readJsonLimited } from './accountSafety.js'
import { classifyHelperInput, filterHelperOutput, HELPER_SYSTEM } from '../../src/lib/helperSafety.js'

const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer' }
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers })

function originFromEnv(env) {
  try { const url = new URL(env.HELPER_ORIGIN); return url.protocol === 'https:' && url.pathname === '/' ? url.origin : null } catch { return null }
}

async function quotaKey(ip, secret) {
  const data = new TextEncoder().encode(ip)
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const digest = await crypto.subtle.sign('HMAC', key, data)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function reserveQuota(db, key, limit, expires) {
  await db.prepare('INSERT OR IGNORE INTO ai_daily_quota (quota_key, used, expires_at) VALUES (?, 0, ?)').bind(key, expires).run()
  return Boolean(await db.prepare('UPDATE ai_daily_quota SET used = used + 1 WHERE quota_key = ? AND used < ? RETURNING quota_key').bind(key, limit).first())
}

function localConfig(env) {
  const model = env.HELPER_MODEL_URL
  const library = env.HELPER_MODEL_LIB_URL
  const size = Number(env.HELPER_MODEL_DOWNLOAD_MB)
  if (!model || !library || !Number.isFinite(size) || size < 100 || size > 1000) return null
  try {
    const modelUrl = new URL(model)
    const libraryUrl = new URL(library)
    if (modelUrl.protocol !== 'https:' || libraryUrl.protocol !== 'https:' || modelUrl.hostname !== 'models.gracegrip.app' || libraryUrl.hostname !== 'models.gracegrip.app' || !modelUrl.pathname.includes('/resolve/')) return null
    return { modelUrl: modelUrl.href, libraryUrl: libraryUrl.href, downloadMB: size, modelId: 'gracegrip-smollm2-360m-v1' }
  } catch { return null }
}

export async function handleHelperRequest(request, env, action, deps = {}) {
  const origin = originFromEnv(env)
  if (!origin || new URL(request.url).origin !== origin) return json({ error: 'Reflection helper unavailable.' }, 503)
  if (request.method !== 'GET' && request.headers.get('Origin') !== origin) return json({ error: 'Request origin denied.' }, 403)
  if (action === 'config' && request.method === 'GET') return json({ local: localConfig(env), cloudAvailable: Boolean(env.AI && env.ACCOUNT_DB && env.AI_QUOTA_SECRET) })
  if (action === 'report' && request.method === 'POST') {
    if (!env.ACCOUNT_DB || !env.AI_QUOTA_SECRET) return json({ error: 'Report service unavailable.' }, 503)
    const payload = await readJsonLimited(request, 300)
    if (!['local', 'cloud'].includes(payload?.route) || !['unsafe', 'inaccurate', 'unhelpful', 'other'].includes(payload?.category)) return json({ error: 'Choose a report category.' }, 400)
    const ip = request.headers.get('CF-Connecting-IP')
    if (!ip) return json({ error: 'Report service unavailable.' }, 503)
    try {
      const day = new Date().toISOString().slice(0, 10)
      const hashed = await quotaKey(ip, env.AI_QUOTA_SECRET)
      if (!(await reserveQuota(env.ACCOUNT_DB, `report:${day}:${hashed}`, 10, new Date(Date.now() + 2 * 86400_000).toISOString()))) return json({ error: 'Today’s report limit has been reached.' }, 429)
      await env.ACCOUNT_DB.prepare('INSERT INTO ai_response_reports (id, route, category, created_at) VALUES (?, ?, ?, ?)')
        .bind(crypto.randomUUID(), payload.route, payload.category, new Date().toISOString()).run()
      return json({ ok: true })
    } catch { return json({ error: 'Report service unavailable.' }, 503) }
  }
  if (action !== 'reflection' || request.method !== 'POST') return json({ error: 'Not found.' }, 404)
  if (!env.AI || !env.ACCOUNT_DB || !env.AI_QUOTA_SECRET) return json({ error: 'Cloud reflection is unavailable. Use Help Now tools.' }, 503)
  const payload = await readJsonLimited(request, 800)
  const classified = classifyHelperInput(payload?.text)
  if (classified.kind === 'invalid') return json({ error: 'Write a short reflection of 4 to 600 characters.' }, 400)
  if (classified.kind !== 'reflection') return json({ answer: classified.answer, kind: classified.kind })
  const ip = request.headers.get('CF-Connecting-IP')
  if (!ip) return json({ error: 'Cloud reflection is unavailable. Use Help Now tools.' }, 503)
  try {
    const day = new Date().toISOString().slice(0, 10)
    const expires = new Date(Date.now() + 2 * 86400_000).toISOString()
    if (!(await reserveQuota(env.ACCOUNT_DB, `global:${day}`, 40, expires))) return json({ error: 'Today’s cloud reflection capacity is full. Help Now remains available.' }, 429)
    const hashed = await quotaKey(ip, env.AI_QUOTA_SECRET)
    if (!(await reserveQuota(env.ACCOUNT_DB, `client:${day}:${hashed}`, 3, expires))) return json({ error: 'You have used today’s cloud reflection limit. Help Now remains available.' }, 429)
    const result = await (deps.runAI ?? ((messages) => env.AI.run('@cf/meta/llama-3.2-1b-instruct', { messages, max_tokens: 160, temperature: 0.4 })))([
      { role: 'system', content: HELPER_SYSTEM },
      { role: 'user', content: classified.text },
    ])
    return json({ answer: filterHelperOutput(result?.response), kind: 'reflection' })
  } catch {
    return json({ error: 'Cloud reflection is unavailable. Help Now remains available.' }, 503)
  }
}
