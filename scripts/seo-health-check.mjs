/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import { mkdir, writeFile } from 'fs/promises'

const USER_AGENT = 'Mozilla/5.0 (compatible; GraceGripSEOHealth/1.0; +https://gracegrip.app/robots.txt)'
const OUTPUT_DIR = process.env.SEO_HEALTH_OUTPUT_DIR || 'seo-health'
const ACCESS_CLIENT_ID = process.env.CF_ACCESS_CLIENT_ID || ''
const ACCESS_CLIENT_SECRET = process.env.CF_ACCESS_CLIENT_SECRET || ''

// Public canonical URLs (checked via gracegrip.app for robots/redirect tests)
const INDEXABLE_PATHS = ['/', '/emergency', '/scripture', '/devotional']
const PRIVATE_PATHS = ['/journal', '/settings']
const CANONICAL_BASE = 'https://gracegrip.app'

// Use a protected Pages preview URL for release checks, or the live apex for weekly checks.
const TEST_BASE = (process.env.SEO_HEALTH_BASE_URL || CANONICAL_BASE).replace(/\/$/, '')

function statusLine(ok, label, detail) {
  return `${ok ? 'PASS' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`
}

function buildHeaders(extra = {}) {
  const headers = {
    'User-Agent': USER_AGENT,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    ...extra,
  }
  if (ACCESS_CLIENT_ID && ACCESS_CLIENT_SECRET) {
    headers['CF-Access-Client-Id'] = ACCESS_CLIENT_ID
    headers['CF-Access-Client-Secret'] = ACCESS_CLIENT_SECRET
  }
  return headers
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: buildHeaders(),
    redirect: 'follow',
  })
  const text = await response.text()
  return { response, text }
}

async function fetchNoRedirect(url) {
  try {
    const response = await fetch(url, {
      headers: buildHeaders(),
      redirect: 'manual',
    })
    return response
  } catch (error) {
    throw new Error(`${url}: ${error.message}`)
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

await mkdir(OUTPUT_DIR, { recursive: true })

const checks = []

try {
  const { response, text } = await fetchText(`${TEST_BASE}/robots.txt`)
  assert(response.status === 200, `robots.txt returned ${response.status}`)
  assert(text.includes('Sitemap: https://gracegrip.app/sitemap.xml'), 'robots.txt missing sitemap line')
  checks.push(statusLine(true, 'robots.txt', '200 + sitemap reference'))
} catch (error) {
  checks.push(statusLine(false, 'robots.txt', error.message))
}

try {
  const { response, text } = await fetchText(`${TEST_BASE}/sitemap.xml`)
  assert(response.status === 200, `sitemap.xml returned ${response.status}`)
  for (const path of INDEXABLE_PATHS) {
    assert(text.includes(`${CANONICAL_BASE}${path}`), `sitemap missing ${CANONICAL_BASE}${path}`)
  }
  assert(!text.includes(`${CANONICAL_BASE}/journal`), 'sitemap leaked /journal')
  assert(!text.includes(`${CANONICAL_BASE}/settings`), 'sitemap leaked /settings')
  checks.push(statusLine(true, 'sitemap.xml', '200 + expected urls only'))
} catch (error) {
  checks.push(statusLine(false, 'sitemap.xml', error.message))
}

if (TEST_BASE === CANONICAL_BASE) {
  try {
    const response = await fetchNoRedirect('https://www.gracegrip.app/')
    assert([301, 308].includes(response.status), `expected permanent redirect, got ${response.status}`)
    assert(response.headers.get('location') === `${CANONICAL_BASE}/`, 'wrong apex redirect target')
    checks.push(statusLine(true, 'www redirect', 'permanent -> apex'))
  } catch (error) {
    checks.push(statusLine(false, 'www redirect', error.message))
  }
}

for (const path of INDEXABLE_PATHS) {
  const label = `${CANONICAL_BASE}${path}`
  try {
    const { response, text } = await fetchText(`${TEST_BASE}${path}`)
    assert(response.status === 200, `${label} returned ${response.status}`)
    assert(text.includes(CANONICAL_BASE), `${label} missing canonical host reference`)
    assert(text.includes('"@context":"https://schema.org"'), `${label} missing JSON-LD`)
    checks.push(statusLine(true, label, '200 + canonical/schema present'))
  } catch (error) {
    checks.push(statusLine(false, label, error.message))
  }
}

for (const path of PRIVATE_PATHS) {
  const label = `${CANONICAL_BASE}${path}`
  try {
    const { response, text } = await fetchText(`${TEST_BASE}${path}`)
    assert(response.status === 200, `${label} returned ${response.status}`)
    assert(text.toLowerCase().includes('noindex'), `${label} missing noindex`)
    checks.push(statusLine(true, label, '200 + noindex present'))
  } catch (error) {
    checks.push(statusLine(false, label, error.message))
  }
}

const failed = checks.filter((line) => line.startsWith('FAIL'))
const markdown = ['# GraceGrip SEO Health', '', ...checks.map((line) => `- ${line}`), ''].join('\n')

await writeFile(`${OUTPUT_DIR}/seo-health-report.md`, markdown, 'utf8')
await writeFile(
  `${OUTPUT_DIR}/seo-health-report.json`,
  JSON.stringify({ checks, failed }, null, 2),
  'utf8',
)

console.log(markdown)

if (failed.length) {
  process.exit(1)
}
