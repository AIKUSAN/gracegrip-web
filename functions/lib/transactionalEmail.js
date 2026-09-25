export function emailIsConfigured(env) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM) return false
  return /^GraceGrip <[A-Za-z0-9._+-]+@gracegrip\.app>$/.test(env.RESEND_FROM)
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

export async function unsubscribeToken(env, accountId, email) {
  if (!env.EMAIL_UNSUB_SECRET || env.EMAIL_UNSUB_SECRET.length < 32) throw new Error('Unsubscribe secret unavailable')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.EMAIL_UNSUB_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return base64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`unsubscribe:${accountId}:${email}`))))
}

async function incrementQuota(db, key, limit, expiry) {
  await db.prepare('INSERT OR IGNORE INTO email_quota (quota_key, used, expires_at) VALUES (?, 0, ?)').bind(key, expiry).run()
  return Boolean(await db.prepare('UPDATE email_quota SET used = used + 1 WHERE quota_key = ? AND used < ? RETURNING quota_key').bind(key, limit).first())
}

async function sendEmail(env, { to, subject, text, idempotencyKey }, kind, fetcher) {
  if (!emailIsConfigured(env) || !env.ACCOUNT_DB) throw new Error('Transactional email unavailable')
  const date = new Date()
  const day = date.toISOString().slice(0, 10)
  const month = day.slice(0, 7)
  const expiry = new Date(date.getTime() + 33 * 86400_000).toISOString()
  // Preserve 80 of the provider's 100 free daily slots for account recovery.
  if (!(await incrementQuota(env.ACCOUNT_DB, `${kind}:${day}`, kind === 'account' ? 80 : 20, expiry))) throw new Error(`${kind} email cap reached`)
  if (!(await incrementQuota(env.ACCOUNT_DB, `all:${day}`, 100, expiry))) throw new Error('Daily email cap reached')
  if (!(await incrementQuota(env.ACCOUNT_DB, `all:${month}`, 2800, expiry))) throw new Error('Monthly email cap reached')
  const response = await fetcher('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({ from: env.RESEND_FROM, to: [to], subject, text }),
  })
  if (!response.ok) throw new Error('Transactional email provider rejected request')
}

export const sendAccountEmail = (env, message, fetcher = fetch) => sendEmail(env, message, 'account', fetcher)
export const sendArticleEmail = (env, message, fetcher = fetch) => sendEmail(env, message, 'article', fetcher)
