/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import { mkdir, writeFile } from 'fs/promises'

const USER_AGENT = 'GraceGripSEOHealth/1.0 (+https://gracegrip.app)'
const OUTPUT_DIR = process.env.SEO_HEALTH_OUTPUT_DIR || 'seo-health'
const INDEXABLE_URLS = [
  'https://gracegrip.app/',
  'https://gracegrip.app/emergency',
  'https://gracegrip.app/scripture',
  'https://gracegrip.app/devotional',
]

function statusLine(ok, label, detail) {
  return `${ok ? 'PASS' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    redirect: 'follow',
  })
  const text = await response.text()
  return { response, text }
}

async function fetchNoRedirect(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
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
  const { response, text } = await fetchText('https://gracegrip.app/robots.txt')
  assert(response.status === 200, 'robots.txt not 200')
  assert(text.includes('Sitemap: https://gracegrip.app/sitemap.xml'), 'robots.txt missing sitemap line')
  checks.push(statusLine(true, 'robots.txt', '200 + sitemap reference'))
} catch (error) {
  checks.push(statusLine(false, 'robots.txt', error.message))
}

try {
  const { response, text } = await fetchText('https://gracegrip.app/sitemap.xml')
  assert(response.status === 200, 'sitemap.xml not 200')
  for (const url of INDEXABLE_URLS) {
    assert(text.includes(url), `sitemap missing ${url}`)
  }
  assert(!text.includes('https://gracegrip.app/journal'), 'sitemap leaked /journal')
  assert(!text.includes('https://gracegrip.app/settings'), 'sitemap leaked /settings')
  checks.push(statusLine(true, 'sitemap.xml', '200 + expected urls only'))
} catch (error) {
  checks.push(statusLine(false, 'sitemap.xml', error.message))
}

try {
  const response = await fetchNoRedirect('https://www.gracegrip.app/')
  assert(response.status === 308, `expected 308, got ${response.status}`)
  assert(response.headers.get('location') === 'https://gracegrip.app/', 'wrong apex redirect target')
  checks.push(statusLine(true, 'www redirect', '308 -> apex'))
} catch (error) {
  checks.push(statusLine(false, 'www redirect', error.message))
}

for (const url of INDEXABLE_URLS) {
  try {
    const { response, text } = await fetchText(url)
    assert(response.status === 200, `${url} not 200`)
    assert(text.includes('https://gracegrip.app'), `${url} missing canonical host reference`)
    assert(text.includes('"@context":"https://schema.org"'), `${url} missing JSON-LD`)
    checks.push(statusLine(true, url, '200 + canonical/schema present'))
  } catch (error) {
    checks.push(statusLine(false, url, error.message))
  }
}

for (const url of ['https://gracegrip.app/journal', 'https://gracegrip.app/settings']) {
  try {
    const { response, text } = await fetchText(url)
    assert(response.status === 200, `${url} not 200`)
    assert(text.toLowerCase().includes('noindex'), `${url} missing noindex`)
    checks.push(statusLine(true, url, '200 + noindex present'))
  } catch (error) {
    checks.push(statusLine(false, url, error.message))
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
