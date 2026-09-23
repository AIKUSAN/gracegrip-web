/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import { neon } from '@neondatabase/serverless'
import { feedbackMessageCutoff } from '../src/lib/feedbackRetention.js'

export async function redactExpiredFeedback(database, cutoff) {
  const result = await database.prepare(
    'UPDATE user_feedback SET message = NULL WHERE message IS NOT NULL AND julianday(created_at) < julianday(?)',
  ).bind(cutoff).run()
  return result.meta?.changes ?? 0
}

export async function runRetention(env, now, makeNeonClient = neon) {
  if (!env.FEEDBACK_DB) throw new Error('Feedback database binding is missing.')
  const neonRequired = env.NEON_RETENTION_REQUIRED === 'true'
  if (neonRequired && !env.NEON_DATABASE_URL) {
    throw new Error('Required Neon rollback binding is missing.')
  }

  const cutoff = feedbackMessageCutoff(now)
  let neonRedacted = 0
  if (neonRequired) {
    const sql = makeNeonClient(env.NEON_DATABASE_URL)
    const rows = await sql`
      WITH redacted AS (
        UPDATE public.user_feedback SET message = NULL
        WHERE message IS NOT NULL AND created_at < ${cutoff}::timestamptz
        RETURNING 1
      )
      SELECT count(*)::integer AS count FROM redacted
    `
    neonRedacted = Number(rows[0]?.count ?? 0)
  }
  const d1Redacted = await redactExpiredFeedback(env.FEEDBACK_DB, cutoff)
  return { cutoff, d1Redacted, neonRedacted }
}

export default {
  async scheduled(controller, env) {
    const { d1Redacted, neonRedacted } = await runRetention(env, controller.scheduledTime)
    // Only counts are logged. Feedback content and row identifiers never are.
    console.log(JSON.stringify({ event: 'feedback_retention', d1Redacted, neonRedacted }))
  },
}
