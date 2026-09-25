/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import { readFile } from 'fs/promises'
import { DISCOVERY_PUBLIC_ROUTES } from '../src/lib/discoveryMetadata.js'
import publishedArticles from '../src/content/publishedArticles.js'
import { RESOURCE_ARTICLES } from '../src/content/resources.js'

const CANONICAL_HOST = 'https://gracegrip.app'
const INDEXABLE_PATHS = [
  ...DISCOVERY_PUBLIC_ROUTES.map((route) => route.path),
  ...publishedArticles.filter((article) => article.reviewStatus === 'approved').map((article) => `/resources/${article.slug}`),
  ...(RESOURCE_ARTICLES.length > 0 && RESOURCE_ARTICLES.every((article) => article.reviewStatus === 'approved') ? ['/resources'] : []),
]
const NON_INDEXABLE_PATHS = ['/journal', '/settings', '/progress', '/puzzle', '/account', '/community', '/community/host', '/editor', '/helper', '/unsubscribe',
  ...(INDEXABLE_PATHS.includes('/resources') ? [] : ['/resources'])]

async function loadSitemapUrls() {
  const { default: sitemap } = await import('../app/sitemap.js')
  const entries = await sitemap()
  return entries.map((entry) => new URL(entry.url).pathname || '/')
}

async function loadIndexNowUrls() {
  const script = await readFile(new URL('./ping-indexnow.mjs', import.meta.url), 'utf8')
  if (!script.includes("import('../app/sitemap.js')")) throw new Error('IndexNow must use the sitemap route list')
  return loadSitemapUrls()
}

async function assertNoindexMetadata(pathname) {
  const localPath = pathname === '/journal' || pathname === '/settings'
    ? `../app${pathname}/layout.jsx` : `../app${pathname}/page.jsx`
  const file = await readFile(new URL(localPath, import.meta.url), 'utf8')

  if (pathname === '/resources') {
    if (!file.includes("RESOURCE_ARTICLES.every((article) => article.reviewStatus === 'approved')")) throw new Error('Resources listing review gate drifted')
  } else if (!/index:\s*false/.test(file)) {
    throw new Error(`${pathname} metadata drift: expected robots index:false`)
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
