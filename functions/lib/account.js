import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import { readJsonLimited, validateSyncPayload } from './accountSafety.js'
import { eraseCommunityMember } from './communityDeletion.js'
import { emailIsConfigured, sendAccountEmail, unsubscribeToken } from './transactionalEmail.js'
import approvedArticles from '../../src/content/publishedArticles.json' with { type: 'json' }

const SESSION_SECONDS = 14 * 24 * 60 * 60
const CHALLENGE_SECONDS = 5 * 60
const EMAIL_TOKEN_SECONDS = 10 * 60
const textEncoder = new TextEncoder()

const nowIso = () => new Date().toISOString()
const futureIso = (seconds) => new Date(Date.now() + seconds * 1000).toISOString()
const randomToken = (length = 32) => base64url(crypto.getRandomValues(new Uint8Array(length)))
const base64url = (bytes) => btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
const bytesFromBase64url = (value) => Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - value.length % 4) % 4)), (char) => char.charCodeAt(0))
const sha256 = async (value) => base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', textEncoder.encode(value))))

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey('raw', textEncoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return base64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, textEncoder.encode(value))))
}

const json = (body, status = 200, cookie = null) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Robots-Tag': 'noindex, nofollow',
    ...(cookie ? { 'Set-Cookie': cookie } : {}),
  },
})

const cookie = (name, value, seconds) => `${name}=${value}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${seconds}`
const clearCookie = (name) => cookie(name, '', 0)
const getCookie = (request, name) => request.headers.get('Cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) ?? null

export async function getAccountSession(request, db) {
  const token = getCookie(request, '__Host-gg_session')
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null
  return db.prepare('SELECT account_id, authenticated_at FROM sessions WHERE token_hash = ? AND expires_at > ?')
    .bind(await sha256(token), nowIso()).first()
}

async function newSession(db, accountId) {
  const token = randomToken()
  await db.prepare('INSERT INTO sessions (token_hash, account_id, authenticated_at, expires_at) VALUES (?, ?, ?, ?)')
    .bind(await sha256(token), accountId, nowIso(), futureIso(SESSION_SECONDS)).run()
  return cookie('__Host-gg_session', token, SESSION_SECONDS)
}

async function rateLimit(request, env, group, limit = 12) {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unidentified'
  const bucket = Math.floor(Date.now() / 3_600_000)
  const key = await hmac(`${group}:${bucket}:${ip}`, env.ACCOUNT_RATE_SECRET)
  await env.ACCOUNT_DB.prepare('INSERT INTO auth_rate (key, attempts, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET attempts = attempts + 1')
    .bind(key, futureIso(7200)).run()
  const row = await env.ACCOUNT_DB.prepare('SELECT attempts FROM auth_rate WHERE key = ?').bind(key).first()
  return row?.attempts > limit
}

async function issueChallenge(db, kind, accountId, challenge) {
  const id = randomToken(24)
  await db.prepare('INSERT INTO auth_challenges (id, kind, account_id, challenge, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(id, kind, accountId, challenge, futureIso(CHALLENGE_SECONDS)).run()
  return cookie('__Host-gg_flow', id, CHALLENGE_SECONDS)
}

async function consumeChallenge(request, db, kind) {
  const id = getCookie(request, '__Host-gg_flow')
  if (!id || !/^[A-Za-z0-9_-]{32}$/.test(id)) return null
  return db.prepare('UPDATE auth_challenges SET consumed_at = ? WHERE id = ? AND kind = ? AND consumed_at IS NULL AND expires_at > ? RETURNING account_id, challenge')
    .bind(nowIso(), id, kind, nowIso()).first()
}

function configFor(request, env) {
  if (!env.ACCOUNT_DB || !env.ACCOUNT_RATE_SECRET || env.ACCOUNT_RATE_SECRET.length < 32 || !env.RECOVERY_PEPPER || env.RECOVERY_PEPPER.length < 32 || !env.PASSKEY_ORIGIN) return null
  try {
    const configured = new URL(env.PASSKEY_ORIGIN)
    if (configured.origin !== new URL(request.url).origin || configured.protocol !== 'https:') return null
    return { origin: configured.origin, rpID: configured.hostname }
  } catch { return null }
}

async function registerOptions(request, env, config) {
  if (await rateLimit(request, env, 'register', 10)) return json({ error: 'Try again later.' }, 429)
  const session = await getAccountSession(request, env.ACCOUNT_DB)
  const accountId = session?.account_id ?? crypto.randomUUID()
  if (session && Date.now() - Date.parse(session.authenticated_at) > 10 * 60_000) return json({ error: 'Sign in again before adding a passkey.' }, 403)
  const oldCredentials = session ? await env.ACCOUNT_DB.prepare('SELECT id, transports FROM credentials WHERE account_id = ?').bind(accountId).all() : { results: [] }
  const options = await generateRegistrationOptions({
    rpName: 'GraceGrip', rpID: config.rpID, userID: textEncoder.encode(accountId),
    userName: `member-${accountId.slice(0, 8)}`, userDisplayName: 'GraceGrip member',
    attestationType: 'none',
    authenticatorSelection: { residentKey: 'required', userVerification: 'required' },
    excludeCredentials: oldCredentials.results.map((row) => ({ id: row.id, transports: JSON.parse(row.transports) })),
  })
  return json({ options }, 200, await issueChallenge(env.ACCOUNT_DB, 'register', accountId, options.challenge))
}

async function registerVerify(request, env, config) {
  const payload = await readJsonLimited(request, 16 * 1024)
  const flow = await consumeChallenge(request, env.ACCOUNT_DB, 'register')
  if (!payload?.credential || !flow?.account_id) return json({ error: 'Registration expired. Start again.' }, 400, clearCookie('__Host-gg_flow'))
  const existing = await env.ACCOUNT_DB.prepare('SELECT id FROM accounts WHERE id = ?').bind(flow.account_id).first()
  if (!existing && payload.adultConfirmed !== true) return json({ error: 'Membership is for adults 18 and older.' }, 400)
  if (existing) {
    const session = await getAccountSession(request, env.ACCOUNT_DB)
    if (session?.account_id !== flow.account_id || Date.now() - Date.parse(session.authenticated_at) > 10 * 60_000) return json({ error: 'Sign in again.' }, 403)
  }
  let result
  try {
    result = await verifyRegistrationResponse({ response: payload.credential, expectedChallenge: flow.challenge, expectedOrigin: config.origin, expectedRPID: config.rpID, requireUserVerification: true })
  } catch { return json({ error: 'Passkey verification failed.' }, 400) }
  if (!result.verified || !result.registrationInfo?.userVerified) return json({ error: 'Passkey verification failed.' }, 400)
  const info = result.registrationInfo
  const cred = info.credential
  const insertCredential = env.ACCOUNT_DB.prepare('INSERT INTO credentials (id, account_id, public_key, counter, transports, device_type, backed_up, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(cred.id, flow.account_id, base64url(cred.publicKey), cred.counter, JSON.stringify(cred.transports ?? []), info.credentialDeviceType, info.credentialBackedUp ? 1 : 0, nowIso())
  if (existing) {
    try { await insertCredential.run() } catch { return json({ error: 'Could not add this passkey.' }, 409) }
    return json({ ok: true, addedPasskey: true })
  }
  const codes = Array.from({ length: 8 }, () => `GG-${randomToken(16)}`)
  const statements = [
    env.ACCOUNT_DB.prepare('INSERT INTO accounts (id, created_at) VALUES (?, ?)').bind(flow.account_id, nowIso()),
    insertCredential,
    ...await Promise.all(codes.map(async (code) => env.ACCOUNT_DB.prepare('INSERT INTO recovery_codes (code_hash, account_id) VALUES (?, ?)').bind(await hmac(`recovery:${code}`, env.RECOVERY_PEPPER), flow.account_id))),
  ]
  try { await env.ACCOUNT_DB.batch(statements) } catch { return json({ error: 'Could not finish registration.' }, 409) }
  return json({ ok: true, recoveryCodes: codes }, 200, await newSession(env.ACCOUNT_DB, flow.account_id))
}

async function loginOptions(request, env, config) {
  if (await rateLimit(request, env, 'login', 20)) return json({ error: 'Try again later.' }, 429)
  const options = await generateAuthenticationOptions({ rpID: config.rpID, userVerification: 'required' })
  return json({ options }, 200, await issueChallenge(env.ACCOUNT_DB, 'login', null, options.challenge))
}

async function loginVerify(request, env, config) {
  const payload = await readJsonLimited(request, 16 * 1024)
  const flow = await consumeChallenge(request, env.ACCOUNT_DB, 'login')
  const credentialId = payload?.credential?.id
  if (!flow || typeof credentialId !== 'string' || credentialId.length > 1024) return json({ error: 'Sign-in expired. Start again.' }, 400)
  const row = await env.ACCOUNT_DB.prepare('SELECT id, account_id, public_key, counter, transports FROM credentials WHERE id = ?').bind(credentialId).first()
  if (!row) return json({ error: 'Passkey not recognized.' }, 401)
  let result
  try {
    result = await verifyAuthenticationResponse({
      response: payload.credential, expectedChallenge: flow.challenge,
      expectedOrigin: config.origin, expectedRPID: config.rpID, requireUserVerification: true,
      credential: { id: row.id, publicKey: bytesFromBase64url(row.public_key), counter: row.counter, transports: JSON.parse(row.transports) },
    })
  } catch { return json({ error: 'Passkey verification failed.' }, 401) }
  if (!result.verified || !result.authenticationInfo.userVerified) return json({ error: 'Passkey verification failed.' }, 401)
  const update = await env.ACCOUNT_DB.prepare('UPDATE credentials SET counter = ? WHERE id = ? AND counter = ?')
    .bind(result.authenticationInfo.newCounter, row.id, row.counter).run()
  if (update.meta?.changes !== 1) return json({ error: 'Please try signing in again.' }, 409)
  return json({ ok: true }, 200, await newSession(env.ACCOUNT_DB, row.account_id))
}

async function recover(request, env) {
  if (await rateLimit(request, env, 'recover', 8)) return json({ error: 'Try again later.' }, 429)
  const payload = await readJsonLimited(request, 512)
  const code = payload?.code?.trim()
  if (typeof code !== 'string' || !/^GG-[A-Za-z0-9_-]{22}$/.test(code)) return json({ error: 'Invalid recovery code.' }, 400)
  const digest = await hmac(`recovery:${code}`, env.RECOVERY_PEPPER)
  const row = await env.ACCOUNT_DB.prepare('UPDATE recovery_codes SET used_at = ? WHERE code_hash = ? AND used_at IS NULL RETURNING account_id')
    .bind(nowIso(), digest).first()
  if (!row) return json({ error: 'Invalid or used recovery code.' }, 401)
  return json({ ok: true, addPasskeySoon: true }, 200, await newSession(env.ACCOUNT_DB, row.account_id))
}

async function sessionInfo(request, env) {
  const session = await getAccountSession(request, env.ACCOUNT_DB)
  if (!session) return json({ signedIn: false })
  const row = await env.ACCOUNT_DB.prepare('SELECT sync_revision, synced_at, verified_email, article_email_opt_in FROM accounts WHERE id = ?').bind(session.account_id).first()
  if (!row) return json({ signedIn: false })
  return json({ signedIn: true, accountId: session.account_id, syncRevision: row.sync_revision, syncedAt: row.synced_at, hasVerifiedEmail: Boolean(row.verified_email), verifiedEmail: row.verified_email, articleEmailOptIn: row.article_email_opt_in === 1 })
}

const normalizeEmail = (value) => {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return email.length <= 254 && /^[^\s@]{1,64}@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
}

async function issueEmailToken(env, accountId, kind, email) {
  const token = randomToken(32)
  const digest = await hmac(`email:${token}`, env.RECOVERY_PEPPER)
  await env.ACCOUNT_DB.prepare('INSERT INTO email_tokens (token_hash, account_id, kind, pending_email, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(digest, accountId, kind, kind === 'verify' ? email : null, futureIso(EMAIL_TOKEN_SECONDS)).run()
  await sendAccountEmail(env, {
    to: email, subject: kind === 'verify' ? 'Verify your GraceGrip email' : 'Recover your GraceGrip account',
    text: `Your one-use GraceGrip ${kind === 'verify' ? 'email verification' : 'account recovery'} code is:\n\n${token}\n\nIt expires in 10 minutes. If you did not request it, you can ignore this email. GraceGrip does not ask for journal content by email.`,
    idempotencyKey: `gracegrip-${kind}-${digest.slice(0, 40)}`,
  })
}

async function consumeEmailToken(env, code, kind, accountId = null) {
  if (typeof code !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(code)) return null
  const digest = await hmac(`email:${code}`, env.RECOVERY_PEPPER)
  return env.ACCOUNT_DB.prepare('UPDATE email_tokens SET consumed_at = ? WHERE token_hash = ? AND kind = ? AND (? IS NULL OR account_id = ?) AND consumed_at IS NULL AND expires_at > ? RETURNING account_id, pending_email')
    .bind(nowIso(), digest, kind, accountId, accountId, nowIso()).first()
}

async function emailStart(request, env) {
  if (!emailIsConfigured(env)) return json({ error: 'Verified email is not configured.' }, 503)
  const session = await getAccountSession(request, env.ACCOUNT_DB)
  if (!session || Date.now() - Date.parse(session.authenticated_at) > 10 * 60_000) return json({ error: 'Sign in again before changing your email.' }, 403)
  if (await rateLimit(request, env, 'email-start', 5)) return json({ error: 'Try again later.' }, 429)
  const payload = await readJsonLimited(request, 512)
  const email = normalizeEmail(payload?.email)
  if (!email) return json({ error: 'Enter a valid email address.' }, 400)
  const claimed = await env.ACCOUNT_DB.prepare('SELECT id FROM accounts WHERE verified_email = ?').bind(email).first()
  if (claimed && claimed.id !== session.account_id) return json({ error: 'This address cannot be attached.' }, 409)
  await issueEmailToken(env, session.account_id, 'verify', email)
  return json({ ok: true, message: 'A verification code was sent if the provider accepted it.' })
}

async function emailVerify(request, env) {
  const session = await getAccountSession(request, env.ACCOUNT_DB)
  if (!session) return json({ error: 'Sign in required.' }, 401)
  if (await rateLimit(request, env, 'email-verify', 10)) return json({ error: 'Try again later.' }, 429)
  const payload = await readJsonLimited(request, 512)
  const row = await consumeEmailToken(env, payload?.code?.trim(), 'verify', session.account_id)
  if (!row) return json({ error: 'Verification code is invalid or expired.' }, 400)
  await env.ACCOUNT_DB.prepare('UPDATE accounts SET verified_email = ?, article_email_opt_in = 0, unsubscribe_token_hash = NULL WHERE id = ?')
    .bind(row.pending_email, session.account_id).run()
  await env.ACCOUNT_DB.prepare('DELETE FROM email_tokens WHERE account_id = ?').bind(session.account_id).run()
  return json({ ok: true })
}

async function emailRemove(request, env) {
  const session = await getAccountSession(request, env.ACCOUNT_DB)
  if (!session || Date.now() - Date.parse(session.authenticated_at) > 10 * 60_000) return json({ error: 'Sign in again before removing your email.' }, 403)
  await env.ACCOUNT_DB.prepare('UPDATE accounts SET verified_email = NULL, article_email_opt_in = 0, unsubscribe_token_hash = NULL WHERE id = ?')
    .bind(session.account_id).run()
  await env.ACCOUNT_DB.prepare('DELETE FROM email_tokens WHERE account_id = ?').bind(session.account_id).run()
  return json({ ok: true })
}

async function emailRecoverStart(request, env) {
  if (!emailIsConfigured(env)) return json({ error: 'Email recovery is unavailable.' }, 503)
  if (await rateLimit(request, env, 'email-recover', 6)) return json({ error: 'Try again later.' }, 429)
  const payload = await readJsonLimited(request, 512)
  const email = normalizeEmail(payload?.email)
  if (!email) return json({ error: 'Enter a valid email address.' }, 400)
  const row = await env.ACCOUNT_DB.prepare('SELECT id FROM accounts WHERE verified_email = ?').bind(email).first()
  if (row) {
    try { await issueEmailToken(env, row.id, 'recover', email) } catch { /* Keep account existence private. */ }
  }
  return json({ ok: true, message: 'If this address is verified on an account, a one-use code has been sent.' })
}

async function emailRecoverVerify(request, env) {
  if (!emailIsConfigured(env)) return json({ error: 'Email recovery is unavailable.' }, 503)
  if (await rateLimit(request, env, 'email-recover-verify', 8)) return json({ error: 'Try again later.' }, 429)
  const payload = await readJsonLimited(request, 512)
  const row = await consumeEmailToken(env, payload?.code?.trim(), 'recover')
  if (!row) return json({ error: 'Recovery code is invalid or expired.' }, 401)
  await env.ACCOUNT_DB.prepare('DELETE FROM email_tokens WHERE account_id = ?').bind(row.account_id).run()
  return json({ ok: true, addPasskeySoon: true }, 200, await newSession(env.ACCOUNT_DB, row.account_id))
}

async function articlePreference(request, env) {
  const session = await getAccountSession(request, env.ACCOUNT_DB)
  if (!session) return json({ error: 'Sign in required.' }, 401)
  const payload = await readJsonLimited(request, 256)
  if (typeof payload?.optIn !== 'boolean') return json({ error: 'Choose whether to receive article updates.' }, 400)
  if (payload.optIn && (!emailIsConfigured(env) || !env.EMAIL_UNSUB_SECRET || env.EMAIL_UNSUB_SECRET.length < 32)) return json({ error: 'Article email is unavailable.' }, 503)
  const row = await env.ACCOUNT_DB.prepare('SELECT verified_email FROM accounts WHERE id = ?').bind(session.account_id).first()
  if (payload.optIn && !row?.verified_email) return json({ error: 'Verify a private email first.' }, 409)
  const unsubscribe = payload.optIn ? await unsubscribeToken(env, session.account_id, row.verified_email) : null
  await env.ACCOUNT_DB.prepare('UPDATE accounts SET article_email_opt_in = ?, unsubscribe_token_hash = ? WHERE id = ?')
    .bind(payload.optIn ? 1 : 0, unsubscribe ? await sha256(unsubscribe) : null, session.account_id).run()
  if (payload.optIn) {
    for (const article of approvedArticles.filter((item) => item.reviewStatus === 'approved')) {
      await env.ACCOUNT_DB.prepare('INSERT OR IGNORE INTO article_email_sent (account_id, slug, sent_at) VALUES (?, ?, ?)')
        .bind(session.account_id, article.slug, nowIso()).run()
    }
  }
  return json({ ok: true, articleEmailOptIn: payload.optIn })
}

async function articleUnsubscribe(request, env) {
  const payload = await readJsonLimited(request, 256)
  if (typeof payload?.token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(payload.token)) return json({ error: 'Invalid unsubscribe link.' }, 400)
  await env.ACCOUNT_DB.prepare('UPDATE accounts SET article_email_opt_in = 0, unsubscribe_token_hash = NULL WHERE unsubscribe_token_hash = ?')
    .bind(await sha256(payload.token)).run()
  return json({ ok: true })
}

async function logout(request, env) {
  const token = getCookie(request, '__Host-gg_session')
  if (token) await env.ACCOUNT_DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run()
  return json({ ok: true }, 200, clearCookie('__Host-gg_session'))
}

async function sync(request, env) {
  const session = await getAccountSession(request, env.ACCOUNT_DB)
  if (!session) return json({ error: 'Sign in required.' }, 401)
  if (request.method === 'GET') {
    const row = await env.ACCOUNT_DB.prepare('SELECT synced_progress, sync_revision, synced_at FROM accounts WHERE id = ?').bind(session.account_id).first()
    return json({ revision: row.sync_revision, syncedAt: row.synced_at, progress: row.synced_progress ? JSON.parse(row.synced_progress) : null })
  }
  const payload = await readJsonLimited(request)
  const progress = validateSyncPayload(payload)
  if (!progress) return json({ error: 'Invalid sync selection.' }, 400)
  const update = await env.ACCOUNT_DB.prepare('UPDATE accounts SET synced_progress = ?, sync_revision = sync_revision + 1, synced_at = ? WHERE id = ? AND sync_revision = ?')
    .bind(JSON.stringify(progress), nowIso(), session.account_id, payload.baseRevision).run()
  if (update.meta?.changes !== 1) return json({ error: 'Synced data changed on another device. Review it before replacing.' }, 409)
  return json({ ok: true, revision: payload.baseRevision + 1, syncedFocusCount: progress.goals.length })
}

async function deleteAccount(request, env) {
  const session = await getAccountSession(request, env.ACCOUNT_DB)
  if (!session) return json({ error: 'Sign in required.' }, 401)
  if (Date.now() - Date.parse(session.authenticated_at) > 10 * 60_000) return json({ error: 'Sign in again before deletion.' }, 403)
  const payload = await readJsonLimited(request, 256)
  if (payload?.confirmation !== 'DELETE MY ACCOUNT') return json({ error: 'Type the confirmation phrase.' }, 400)
  if (!env.COMMUNITY_DB) return json({ error: 'Account deletion is temporarily unavailable.' }, 503)
  await eraseCommunityMember(env.COMMUNITY_DB, session.account_id)
  await env.ACCOUNT_DB.prepare('DELETE FROM accounts WHERE id = ?').bind(session.account_id).run()
  return json({ ok: true }, 200, clearCookie('__Host-gg_session'))
}

export async function handleAccountRequest(request, env, action) {
  const config = configFor(request, env)
  if (!config) return json({ error: 'Membership is unavailable in this environment.' }, 503)
  if (request.method !== 'GET' && request.headers.get('Origin') !== config.origin) return json({ error: 'Request origin denied.' }, 403)
  try {
    if (action === 'register-options' && request.method === 'POST') return await registerOptions(request, env, config)
    if (action === 'register-verify' && request.method === 'POST') return await registerVerify(request, env, config)
    if (action === 'login-options' && request.method === 'POST') return await loginOptions(request, env, config)
    if (action === 'login-verify' && request.method === 'POST') return await loginVerify(request, env, config)
    if (action === 'recover' && request.method === 'POST') return await recover(request, env)
    if (action === 'email-start' && request.method === 'POST') return await emailStart(request, env)
    if (action === 'email-verify' && request.method === 'POST') return await emailVerify(request, env)
    if (action === 'email-remove' && request.method === 'POST') return await emailRemove(request, env)
    if (action === 'email-recover-start' && request.method === 'POST') return await emailRecoverStart(request, env)
    if (action === 'email-recover-verify' && request.method === 'POST') return await emailRecoverVerify(request, env)
    if (action === 'article-preference' && request.method === 'POST') return await articlePreference(request, env)
    if (action === 'article-unsubscribe' && request.method === 'POST') return await articleUnsubscribe(request, env)
    if (action === 'session' && request.method === 'GET') return await sessionInfo(request, env)
    if (action === 'logout' && request.method === 'POST') return await logout(request, env)
    if (action === 'sync' && ['GET', 'PUT'].includes(request.method)) return await sync(request, env)
    if (action === 'delete' && request.method === 'POST') return await deleteAccount(request, env)
  } catch {
    return json({ error: 'Membership is temporarily unavailable.' }, 503)
  }
  return json({ error: 'Not found.' }, 404)
}
