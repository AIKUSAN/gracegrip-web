/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */

const MAX_MESSAGE_LENGTH = 500
const MAX_PAYLOAD_BYTES = 4096
const INVALID_PAYLOAD = Symbol('invalid feedback payload')

function responseJson(payload, status) {
  return Response.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    },
  })
}

async function readLimitedJson(request) {
  if (!request.body) return INVALID_PAYLOAD

  const reader = request.body.getReader()
  const chunks = []
  let size = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_PAYLOAD_BYTES) return INVALID_PAYLOAD
      chunks.push(value)
    }
  } finally {
    await reader.cancel().catch(() => {})
  }

  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return INVALID_PAYLOAD
  }
}

export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await readLimitedJson(request)
  } catch {
    body = INVALID_PAYLOAD
  }
  if (body === INVALID_PAYLOAD) {
    return responseJson({ ok: false, error: 'Invalid feedback payload.' }, 400)
  }

  const rating = body?.rating
  const message = typeof body?.message === 'string' ? body.message.trim() : ''

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return responseJson({ ok: false, error: 'Choose a rating from 1 to 5.' }, 400)
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return responseJson({ ok: false, error: 'Feedback note is too long.' }, 400)
  }

  if (!env.FEEDBACK_DB) {
    return responseJson({ ok: false, error: 'Feedback not configured.' }, 503)
  }

  try {
    await env.FEEDBACK_DB.prepare(
      'INSERT INTO user_feedback (id, rating, message) VALUES (?, ?, ?)',
    ).bind(crypto.randomUUID(), rating, message || null).run()
    return responseJson({ ok: true }, 200)
  } catch {
    // No request body, database error, or message text is written to logs.
    return responseJson({ ok: false, error: 'Feedback could not be saved.' }, 500)
  }
}

export function onRequest() {
  return responseJson({ ok: false, error: 'Method not allowed.' }, 405)
}
