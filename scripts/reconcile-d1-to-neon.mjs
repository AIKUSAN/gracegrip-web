/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
// Use before a planned rollback or after an emergency route-back; rerun after DNS propagation.
// Feedback text stays in memory and never enters command arguments or logs.
import { neon } from '@neondatabase/serverless'
import { d1FeedbackPageRequest, reconcileRows } from './lib/feedback-reconciliation.mjs'

const args = new Set(process.argv.slice(2))
const verifyOnly = args.has('--verify-only')
if (!verifyOnly && !args.has('--confirm-neon-write')) {
  console.error('Neon reconciliation writes require --confirm-neon-write after a Vercel rollback.')
  process.exit(1)
}
if (verifyOnly && args.has('--confirm-neon-write')) {
  console.error('Choose --verify-only or --confirm-neon-write, not both.')
  process.exit(1)
}

const neonUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL
const required = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID', 'D1_PRODUCTION_DATABASE_ID']
const missing = required.filter((name) => !process.env[name])
if (!neonUrl) missing.unshift('NEON_DATABASE_URL or DATABASE_URL')
if (missing.length) {
  console.error(`Reconciliation needs: ${missing.join(', ')}`)
  process.exit(1)
}
if (!/^[a-f0-9]{32}$/i.test(process.env.CLOUDFLARE_ACCOUNT_ID) ||
    !/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(process.env.D1_PRODUCTION_DATABASE_ID)) {
  console.error('Cloudflare account or production D1 database ID is malformed.')
  process.exit(1)
}
if (process.env.D1_PREVIEW_DATABASE_ID === process.env.D1_PRODUCTION_DATABASE_ID) {
  console.error('Production D1 ID must differ from preview D1 ID.')
  process.exit(1)
}

const sql = neon(neonUrl)
const pageSize = 100

async function d1Query(query) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.D1_PRODUCTION_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
      signal: AbortSignal.timeout(30000),
    },
  )
  // Never print the response body: API errors may include query parameters.
  if (!response.ok) throw new Error(`D1 read failed with HTTP ${response.status}.`)
  const payload = await response.json()
  if (!payload.success || !payload.result?.[0]?.success) {
    throw new Error('D1 read was rejected; inspect account and database access.')
  }
  return payload.result[0].results ?? []
}

async function insertIntoNeon(row) {
  await sql`
    INSERT INTO user_feedback (id, created_at, rating, message)
    VALUES (${row.id}::uuid, ${row.created_at}::timestamptz, ${Number(row.rating)}::smallint, ${row.message})
    ON CONFLICT (id) DO NOTHING
  `
}

async function lookupNeon(id) {
  const rows = await sql`
    SELECT id::text AS id,
      to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS created_at,
      rating::integer AS rating, message
    FROM user_feedback
    WHERE id = ${id}::uuid
  `
  return rows[0] ?? null
}

async function main() {
  let cursor = ''
  let verified = 0
  while (true) {
    const rows = await d1Query(d1FeedbackPageRequest(cursor, pageSize))
    if (!rows.length) break
    verified += await reconcileRows(rows, {
      insert: verifyOnly ? async () => {} : insertIntoNeon,
      lookup: lookupNeon,
    })
    cursor = rows.at(-1).id
  }
  const totals = await d1Query({ sql: 'SELECT count(*) AS row_count FROM user_feedback', params: [] })
  const d1Count = Number(totals[0]?.row_count)
  if (!Number.isSafeInteger(d1Count) || d1Count !== verified) {
    throw new Error('D1 row count changed or pagination missed rows; rerun reconciliation.')
  }
  console.log(`${verifyOnly ? 'Verified' : 'Reconciled and verified'} ${verified} production D1 rows in Neon by stable ID and content hash.`)
}

main().catch(() => {
  console.error('D1-to-Neon reconciliation failed; no feedback content was logged.')
  process.exitCode = 1
})
