/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import { readFile } from 'fs/promises'

const CANONICAL_HOST = 'https://gracegrip.app'
const INDEXABLE_PATHS = ['/', '/emergency', '/scripture', '/devotional']
const NON_INDEXABLE_PATHS = ['/journal', '/settings']

async function loadSitemapUrls() {
  const { default: sitemap } = await import('../app/sitemap.js')
  const entries = await sitemap()
  return entries.map((entry) => new URL(entry.url).pathname || '/')
}

async function loadIndexNowUrls() {
  const script = await readFile(new URL('./ping-indexnow.mjs', import.meta.url), 'utf8')
  const urlBlock = script.match(/const URLS = \[([\s\S]*?)\]/)

  if (!urlBlock) {
    throw new Error('Could not find URLS block in ping-indexnow.mjs')
  }

  return Array.from(
    urlBlock[1].matchAll(/`https:\/\/\$\{HOST\}(\/[^`]*)?`/g),
    (match) => match[1] || '/',
  )
}

async function assertNoindexMetadata(pathname) {
  const localPath =
    pathname === '/journal' ? '../app/journal/layout.jsx' : '../app/settings/layout.jsx'
  const file = await readFile(new URL(localPath, import.meta.url), 'utf8')

  if (!/index:\s*false/.test(file) || !/follow:\s*true/.test(file)) {
    throw new Error(`${pathname} metadata drift: expected robots index:false follow:true`)
  }
}

function normalizePaths(paths) {
  return [...new Set(paths.map((path) => (path === '' ? '/' : path)))]
}

function assertEqualSets(name, actual, expected) {
  const actualSet = normalizePaths(actual).sort()
  const expectedSet = [...expected].sort()

  if (JSON.stringify(actualSet) !== JSON.stringify(expectedSet)) {
    throw new Error(
      `${name} mismatch\nactual: ${actualSet.join(', ')}\nexpected: ${expectedSet.join(', ')}`,
    )
  }
}

const sitemapPaths = await loadSitemapUrls()
const indexNowPaths = await loadIndexNowUrls()

assertEqualSets('sitemap urls', sitemapPaths, INDEXABLE_PATHS)
assertEqualSets('IndexNow urls', indexNowPaths, INDEXABLE_PATHS)

for (const pathname of NON_INDEXABLE_PATHS) {
  await assertNoindexMetadata(pathname)
}

for (const pathname of [...sitemapPaths, ...indexNowPaths]) {
  if (NON_INDEXABLE_PATHS.includes(pathname)) {
    throw new Error(`Non-indexable route leaked into crawl surface: ${pathname}`)
  }
}

console.log(`SEO guard OK for ${CANONICAL_HOST}`)
