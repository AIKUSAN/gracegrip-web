import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { FOCUS_AREAS } from '../src/content/focusAreas.js'
import { RESOURCE_ARTICLES } from '../src/content/resources.js'

const evidence = JSON.parse(await readFile(new URL('../docs/v2-release-evidence.json', import.meta.url), 'utf8'))
const required = [
  'cloudflareAccountConfirmed', 'protectedPreviewVerified', 'qualifiedSubstanceAndSafeguardingReview',
  'allNineArticlesReviewed', 'editorialAccessAndGitHubAppVerified', 'accountRecoveryEmailVerified', 'articleEmailDeliveryVerified',
  'communityHumanModerationVerified', 'aiSafetyAndQuotaVerified', 'androidClosedTestAndPlayApproval',
  'webAndAndroidAccessibilityVerified', 'ownerReleaseApproval',
]
const pending = required.filter((key) => evidence[key] !== true)
if (evidence.status !== 'ready') pending.push('release status')
if (!Array.isArray(evidence.evidence) || evidence.evidence.length < required.length) pending.push('review evidence references')
if (FOCUS_AREAS.length !== 7) pending.push('seven focus guides')
if (RESOURCE_ARTICLES.length < 9 || RESOURCE_ARTICLES.some((article) => article.reviewStatus !== 'approved')) pending.push('nine approved articles')
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
if (packageJson.version !== '2.0.0') pending.push('2.0.0 version')

const logoBlobs = {
  'public/logo.svg': 'cb808692554172000c4f2c226c32611729b8b0cf',
  'app/icon.svg': '3adba8a69863d9bd9e9af483a61ad67ce1728dca',
  'public/favicon.svg': '32b52db7354f2791d49f76ba08562b02ad395580',
}
for (const [path, expected] of Object.entries(logoBlobs)) {
  const current = execFileSync('git', ['hash-object', path], { encoding: 'utf8' }).trim()
  if (current !== expected) pending.push(`trademark asset ${path}`)
}

if (pending.length > 0) {
  console.error(`GraceGrip 2.0 release is blocked by: ${pending.join(', ')}.`)
  process.exitCode = 1
} else {
  console.log('GraceGrip 2.0 release evidence gate passed.')
}
