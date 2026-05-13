import { neon } from '@neondatabase/serverless'

export const runtime = 'nodejs'

const MAX_MESSAGE_LENGTH = 500

function responseJson(payload, status) {
  return Response.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return responseJson({ ok: false, error: 'Invalid feedback payload.' }, 400)
  }

  const rating = body?.rating
  const message =
    typeof body?.message === 'string'
      ? body.message.trim()
      : ''

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return responseJson({ ok: false, error: 'Choose a rating from 1 to 5.' }, 400)
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return responseJson({ ok: false, error: 'Feedback note is too long.' }, 400)
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    return responseJson({ ok: false, error: 'Feedback not configured.' }, 503)
  }

  try {
    const sql = neon(databaseUrl)
    await sql`
      INSERT INTO user_feedback (rating, message)
      VALUES (${rating}, ${message || null})
    `

    return responseJson({ ok: true }, 200)
  } catch (error) {
    console.error('Feedback insert failed:', error?.message || error)
    return responseJson({ ok: false, error: 'Feedback could not be saved.' }, 500)
  }
}
