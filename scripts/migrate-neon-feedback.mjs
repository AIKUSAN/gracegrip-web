/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
// Run only from a trusted terminal. Feedback stays in memory and is never written to a file.
import { neon } from '@neondatabase/serverless'
import { fingerprintRow, validateD1Count } from './lib/feedback-reconciliation.mjs'

const args = new Set(process.argv.slice(2))
const selectedTargets = ['production', 'preview'].filter((name) => args.has(`--target=${name}`))
const target = selectedTargets[0] ?? null
const inspectSource = args.has('--inspect-source')
const verifyOnly = args.has('--verify-only')
const allowD1Only = args.has('--allow-d1-only')
const pageSize = 100

if (selectedTargets.length > 1 || (inspectSource && target)) {
  console.error('Choose one target or --inspect-source, not both.')
  process.exit(1)
}
if (!inspectSource && !target) {
  console.error('Choose --target=preview or --target=production (or --inspect-source).')
  process.exit(1)
}
if (target === 'production' && !verifyOnly && !args.has('--confirm-production')) {
  console.error('Production import requires --confirm-production after preview verification.')
  process.exit(1)
}

const sourceUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL
const required = inspectSource
  ? []
  : [
      'CLOUDFLARE_API_TOKEN',
      'CLOUDFLARE_ACCOUNT_ID',
      target === 'production' ? 'D1_PRODUCTION_DATABASE_ID' : 'D1_PREVIEW_DATABASE_ID',
    ]
const missing = required.filter((name) => !process.env[name])
if (!sourceUrl) missing.unshift('NEON_DATABASE_URL or DATABASE_URL')
if (missing.length) {
  console.error(`Migration needs: ${missing.join(', ')}`)
  process.exit(1)
}
if (!inspectSource) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const databaseId = process.env[target === 'production' ? 'D1_PRODUCTION_DATABASE_ID' : 'D1_PREVIEW_DATABASE_ID']
  if (!/^[a-f0-9]{32}$/i.test(accountId) || !/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(databaseId)) {
    console.error('Cloudflare account or D1 database ID is malformed.')
    process.exit(1)
  }
  if (process.env.D1_PREVIEW_DATABASE_ID && process.env.D1_PREVIEW_DATABASE_ID === process.env.D1_PRODUCTION_DATABASE_ID) {
    console.error('Preview and production D1 IDs must differ.')
    process.exit(1)
  }
}

const sql = neon(sourceUrl)

async function inspect() {
  const columns = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_feedback'
    ORDER BY ordinal_position
  `
  const count = await sql`SELECT count(*)::integer AS count FROM user_feedback`
  console.log(JSON.stringify({ columns, rowCount: count[0].count }))
}

async function sourcePage(cursor) {
  return sql`
    SELECT id::text AS id,
      to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS created_at,
      rating::integer AS rating, message
    FROM user_feedback
    WHERE id > ${cursor}::uuid
    ORDER BY id
    LIMIT ${pageSize}
  `
}

async function d1Query(body) {
  const databaseId = process.env[target === 'production' ? 'D1_PRODUCTION_DATABASE_ID' : 'D1_PREVIEW_DATABASE_ID']
  const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${databaseId}/query`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  })
  // Do not print the API body: write failures may echo message parameters.
  if (!response.ok) throw new Error(`D1 query failed with HTTP ${response.status}.`)
  const payload = await response.json()
  if (!payload.success || !Array.isArray(payload.result) || payload.result.some((part) => !part.success)) {
    throw new Error('D1 query was rejected; inspect Cloudflare D1 configuration.')
  }
  return payload.result
}

async function importPage(rows) {
  for (let start = 0; start < rows.length; start += 25) {
    const batch = rows.slice(start, start + 25).map((row) => ({
      sql: `INSERT OR IGNORE INTO user_feedback (id, created_at, rating, message) VALUES (?, ?, ?, ${row.message === null ? 'NULL' : '?'})`,
      params: row.message === null
        ? [row.id, row.created_at, String(row.rating)]
        : [row.id, row.created_at, String(row.rating), row.message],
    }))
    await d1Query({ batch })
  }
}

async function* sourceRows() {
  let cursor = '00000000-0000-0000-0000-000000000000'
  while (true) {
    const rows = await sourcePage(cursor)
    if (!rows.length) return
    yield rows
    cursor = rows.at(-1).id
  }
}

async function importAll() {
  let examined = 0
  for await (const rows of sourceRows()) {
    await importPage(rows)
    examined += rows.length
  }
  console.log(`Examined ${examined} Neon rows for idempotent ${target} import.`)
}

async function verifySourceRows() {
  let count = 0
  for await (const source of sourceRows()) {
    const placeholders = source.map(() => '?').join(', ')
    const [result] = await d1Query({
      sql: `SELECT id, created_at, rating, message FROM user_feedback WHERE id IN (${placeholders}) ORDER BY id`,
      params: source.map((row) => row.id),
    })
    const destination = result.results ?? []
    if (destination.length !== source.length) throw new Error('D1 is missing Neon feedback rows.')
    for (let index = 0; index < source.length; index += 1) {
      if (fingerprintRow(source[index]) !== fingerprintRow(destination[index])) {
        throw new Error('A D1 row differs from its Neon source.')
      }
    }
    count += source.length
  }
  return count
}

async function main() {
  if (inspectSource) {
    await inspect()
    return
  }
  if (!verifyOnly) await importAll()
  const count = await verifySourceRows()
  const [result] = await d1Query({ sql: 'SELECT count(*) AS row_count FROM user_feedback' })
  const d1Count = Number(result.results?.[0]?.row_count)
  const additional = validateD1Count(count, d1Count, allowD1Only)
  console.log(`Verified ${count} Neon rows in ${target} D1 by stable ID and content hash. D1 total: ${d1Count}; D1-only: ${additional}.`)
}

main().catch(() => {
  console.error('Feedback migration or verification failed; no feedback content was logged.')
  process.exitCode = 1
})
