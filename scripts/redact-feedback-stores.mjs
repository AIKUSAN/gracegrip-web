/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
// Repair or verify the production D1 and temporary Neon rollback copy with one cutoff.
// Feedback text and row identifiers remain in the databases and never enter logs.
import { neon } from '@neondatabase/serverless'
import { feedbackMessageCutoff } from '../src/lib/feedbackRetention.js'
import { runRetention } from '../workers/feedback-retention.js'

const args = new Set(process.argv.slice(2))
const write = args.has('--confirm-both-writes')
const useRepoUrl = args.has('--use-repo-database-url')
if ([...args].some((arg) => !['--confirm-both-writes', '--use-repo-database-url'].includes(arg))) {
  console.error('Usage: redact-feedback-stores.mjs [--use-repo-database-url] [--confirm-both-writes]')
  process.exit(1)
}

const neonUrl = process.env.NEON_DATABASE_URL || (useRepoUrl ? process.env.DATABASE_URL : null)
const required = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID', 'D1_PRODUCTION_DATABASE_ID']
const missing = required.filter((name) => !process.env[name])
if (!neonUrl) missing.unshift(useRepoUrl ? 'DATABASE_URL' : 'NEON_DATABASE_URL')
if (missing.length) {
  console.error(`Feedback retention needs: ${missing.join(', ')}`)
  process.exit(1)
}
if (!/^[a-f0-9]{32}$/i.test(process.env.CLOUDFLARE_ACCOUNT_ID) ||
    !/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(process.env.D1_PRODUCTION_DATABASE_ID) ||
    process.env.D1_PRODUCTION_DATABASE_ID === process.env.D1_PREVIEW_DATABASE_ID) {
  console.error('Production Cloudflare account or D1 database ID is malformed.')
  process.exit(1)
}

let target
try {
  const url = new URL(neonUrl)
  const host = url.hostname.toLowerCase()
  if (!host.endsWith('.neon.tech') || (process.env.PGHOST && process.env.PGHOST !== host)) {
    throw new Error('Unexpected Neon host.')
  }
  target = { host, database: decodeURIComponent(url.pathname.slice(1)) }
  if (!target.database) throw new Error('Missing database name.')
} catch {
  console.error('Neon URL does not identify the expected database host.')
  process.exit(1)
}

const sql = neon(neonUrl)
const now = Date.now()
const cutoff = feedbackMessageCutoff(now)

async function d1Query(body) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.D1_PRODUCTION_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    },
  )
  if (!response.ok) throw new Error(`D1 query failed with HTTP ${response.status}.`)
  const payload = await response.json()
  if (!payload.success || !payload.result?.[0]?.success) {
    throw new Error('D1 query was rejected.')
  }
  return payload.result[0]
}

async function eligibleCounts() {
  const [d1, neonRows] = await Promise.all([
    d1Query({
      sql: 'SELECT count(*) AS count FROM user_feedback WHERE message IS NOT NULL AND julianday(created_at) < julianday(?)',
      params: [cutoff],
    }),
    sql`
      SELECT count(*)::integer AS count FROM public.user_feedback
      WHERE message IS NOT NULL AND created_at < ${cutoff}::timestamptz
    `,
  ])
  return { d1: Number(d1.results?.[0]?.count), neon: Number(neonRows[0]?.count) }
}

const remoteD1 = {
  prepare(statement) {
    return {
      bind(...params) {
        return {
          async run() {
            const result = await d1Query({ sql: statement, params })
            return { meta: result.meta }
          },
        }
      },
    }
  },
}

try {
  const before = await eligibleCounts()
  let redacted = null
  if (write) {
    redacted = await runRetention({
      FEEDBACK_DB: remoteD1,
      NEON_DATABASE_URL: neonUrl,
      NEON_RETENTION_REQUIRED: 'true',
    }, now)
  }
  const after = await eligibleCounts()
  if (write && (after.d1 !== 0 || after.neon !== 0)) {
    throw new Error('Expired message text remains in a feedback store.')
  }
  console.log(JSON.stringify({ mode: write ? 'redacted' : 'inspection', target, cutoff, before, after,
    redacted: redacted ? { d1: redacted.d1Redacted, neon: redacted.neonRedacted } : undefined }))
} catch {
  console.error('Feedback retention check failed; no feedback content was logged.')
  process.exitCode = 1
}
