/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import { mkdir, writeFile } from 'fs/promises'
import { googleApiRequest, getGscConfig, hasGscSecrets } from './lib/gsc-client.mjs'

const PUBLIC_URLS = [
  'https://gracegrip.app/',
  'https://gracegrip.app/emergency',
  'https://gracegrip.app/scripture',
  'https://gracegrip.app/devotional',
]

const SITEMAP_URL = 'https://gracegrip.app/sitemap.xml'

function safePath(pathname) {
  return pathname === '/' ? 'home' : pathname.replaceAll('/', '_').replace(/^_/, '')
}

async function ensureOutputDir(dir) {
  await mkdir(dir, { recursive: true })
}

async function writeSkippedReport(config, reason) {
  await ensureOutputDir(config.outputDir)
  const markdown = `# GraceGrip GSC Sync\n\nStatus: skipped\n\nReason: ${reason}\n`
  await writeFile(`${config.outputDir}/gsc-report.md`, markdown, 'utf8')
  await writeFile(
    `${config.outputDir}/gsc-report.json`,
    JSON.stringify({ status: 'skipped', reason }, null, 2),
    'utf8',
  )
  console.log(markdown)
}

async function submitSitemap(config) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    config.siteUrl,
  )}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`

  const response = await googleApiRequest(
    endpoint,
    {
      method: 'PUT',
    },
    config,
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Sitemap submit failed: ${response.status} ${response.statusText}\n${text}`)
  }
}

async function inspectUrl(url, config) {
  const response = await googleApiRequest(
    'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl: config.siteUrl,
      }),
    },
    config,
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`URL inspection failed for ${url}: ${response.status} ${response.statusText}\n${text}`)
  }

  return response.json()
}

function toReportRow(url, data) {
  const result = data?.inspectionResult?.indexStatusResult ?? {}
  return {
    url,
    verdict: result.verdict ?? 'UNKNOWN',
    coverageState: result.coverageState ?? 'UNKNOWN',
    lastCrawlTime: result.lastCrawlTime ?? null,
    googleCanonical: result.googleCanonical ?? null,
    userCanonical: result.userCanonical ?? null,
    indexingState: result.indexingState ?? null,
    robotsTxtState: result.robotsTxtState ?? null,
  }
}

function toMarkdown(config, rows) {
  const lines = [
    '# GraceGrip GSC Sync',
    '',
    `Property: \`${config.siteUrl}\``,
    `Sitemap: ${SITEMAP_URL}`,
    '',
    '| URL | Verdict | Coverage | Last Crawl | Google Canonical | User Canonical |',
    '|-----|---------|----------|------------|------------------|----------------|',
  ]

  for (const row of rows) {
    lines.push(
      `| ${row.url} | ${row.verdict} | ${row.coverageState} | ${row.lastCrawlTime ?? 'n/a'} | ${
        row.googleCanonical ?? 'n/a'
      } | ${row.userCanonical ?? 'n/a'} |`,
    )
  }

  lines.push('', '## Flags', '')

  for (const row of rows) {
    const flags = []
    if (row.coverageState?.toLowerCase().includes('unknown')) flags.push('unknown to Google')
    if (row.coverageState?.toLowerCase().includes('crawled')) flags.push('crawled not indexed')
    if (row.coverageState?.toLowerCase().includes('duplicate')) flags.push('duplicate canonical issue')
    if (row.robotsTxtState?.toLowerCase().includes('blocked')) flags.push('blocked by robots')
    if (row.coverageState?.toLowerCase().includes('indexed')) flags.push('indexed')
    lines.push(`- ${row.url}: ${flags.length ? flags.join(', ') : 'no special flag'}`)
  }

  return `${lines.join('\n')}\n`
}

const config = getGscConfig()

if (!hasGscSecrets(config)) {
  await writeSkippedReport(config, 'Missing GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY secret.')
  process.exit(0)
}

await ensureOutputDir(config.outputDir)
await submitSitemap(config)

const rawResults = []
for (const url of PUBLIC_URLS) {
  const data = await inspectUrl(url, config)
  rawResults.push({ url, data })
  const pathname = new URL(url).pathname
  await writeFile(
    `${config.outputDir}/${safePath(pathname)}.json`,
    JSON.stringify(data, null, 2),
    'utf8',
  )
}

const reportRows = rawResults.map(({ url, data }) => toReportRow(url, data))
const markdown = toMarkdown(config, reportRows)

await writeFile(`${config.outputDir}/gsc-report.md`, markdown, 'utf8')
await writeFile(
  `${config.outputDir}/gsc-report.json`,
  JSON.stringify({ sitemapUrl: SITEMAP_URL, siteUrl: config.siteUrl, urls: reportRows }, null, 2),
  'utf8',
)

console.log(markdown)
