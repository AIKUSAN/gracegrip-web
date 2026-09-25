import { importPKCS8, SignJWT } from 'jose'
import { validateArticleDraft } from '../../src/lib/editorialDraft.js'

const OWNER = 'AIKUSAN'
const REPO = 'gracegrip-web'
const FILE = 'src/content/publishedArticles.js'
const API = `https://api.github.com/repos/${OWNER}/${REPO}`

async function githubJson(fetcher, url, token, options = {}) {
  const response = await fetcher(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2026-03-10',
      'User-Agent': 'GraceGrip-editorial-publisher',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
  if (!response.ok) throw new Error(`GitHub request failed (${response.status})`)
  return response.json()
}

async function installationToken(env, fetcher) {
  if (!env.GITHUB_APP_ID || !env.GITHUB_APP_INSTALLATION_ID || !env.GITHUB_APP_PRIVATE_KEY) throw new Error('Publishing integration is unavailable')
  const pem = env.GITHUB_APP_PRIVATE_KEY.replaceAll('\\n', '\n')
  const key = await importPKCS8(pem, 'RS256')
  const now = Math.floor(Date.now() / 1000)
  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt(now - 60)
    .setIssuer(env.GITHUB_APP_ID)
    .setExpirationTime(now + 540)
    .sign(key)
  const grant = await githubJson(fetcher, `https://api.github.com/app/installations/${env.GITHUB_APP_INSTALLATION_ID}/access_tokens`, jwt, {
    method: 'POST', body: JSON.stringify({ repositories: [REPO], permissions: { contents: 'write', pull_requests: 'write' } }),
  })
  if (!grant.token) throw new Error('Publishing token is unavailable')
  return grant.token
}

function encodeUtf8(value) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (let index = 0; index < bytes.length; index += 8192) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 8192))
  }
  return btoa(binary)
}
const decodeUtf8 = (value) => new TextDecoder().decode(Uint8Array.from(atob(value.replaceAll('\n', '')), (char) => char.charCodeAt(0)))

export function readPublishedRegistry(source) {
  const header = 'export default '
  if (!source.startsWith(header)) throw new Error('Published article registry is invalid')
  const articles = JSON.parse(source.slice(header.length).trim().replace(/;$/, ''))
  if (!Array.isArray(articles)) throw new Error('Published article registry is invalid')
  return articles
}

export function toPublishedArticle(draft) {
  const parsed = validateArticleDraft({
    slug: draft.slug, title: draft.title, description: draft.description,
    category: draft.category, sections: JSON.parse(draft.sections_json), source: draft.source_url,
    penName: draft.pen_name, bylineConsent: draft.byline_consent === 1,
  })
  if (!parsed) throw new Error('Approved draft is invalid')
  return {
    slug: parsed.slug, title: parsed.title, description: parsed.description,
    category: parsed.category, sections: parsed.sections, source: parsed.source,
    byline: parsed.penName ?? 'GraceGrip', reviewStatus: 'approved',
  }
}

export async function createPublishingPullRequest(draft, env, fetcher = fetch) {
  const article = toPublishedArticle(draft)
  if (!/^[0-9a-f-]{36}$/i.test(draft.id)) throw new Error('Invalid draft ID')
  const token = await installationToken(env, fetcher)
  const branch = `codex/editorial-${article.slug.slice(0, 35)}-${draft.id.slice(0, 8)}-r${draft.revision}`
  const openPulls = await githubJson(fetcher, `${API}/pulls?state=open&head=${encodeURIComponent(`${OWNER}:${branch}`)}`, token)
  if (openPulls.length > 0) return openPulls[0].html_url
  const mainRef = await githubJson(fetcher, `${API}/git/ref/heads/main`, token)
  if (!mainRef.object?.sha) throw new Error('Protected main reference is unavailable')
  try {
    await githubJson(fetcher, `${API}/git/refs`, token, { method: 'POST', body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: mainRef.object.sha }) })
  } catch (error) {
    // A retry may find a branch created by an earlier interrupted attempt.
    if (!String(error.message).includes('(422)')) throw error
  }
  const file = await githubJson(fetcher, `${API}/contents/${FILE}?ref=${encodeURIComponent(branch)}`, token)
  const articles = readPublishedRegistry(decodeUtf8(file.content))
  const updated = [...articles.filter((item) => item.slug !== article.slug), article]
  if (JSON.stringify(articles) !== JSON.stringify(updated)) {
    await githubJson(fetcher, `${API}/contents/${FILE}`, token, {
      method: 'PUT',
      body: JSON.stringify({ message: `docs: prepare reviewed GraceGrip resource ${article.slug}`, content: encodeUtf8(`export default ${JSON.stringify(updated, null, 2)}\n`), sha: file.sha, branch }),
    })
  }
  const pull = await githubJson(fetcher, `${API}/pulls`, token, {
    method: 'POST',
    body: JSON.stringify({ title: `Publish resource: ${article.title}`, head: branch, base: 'main', draft: true,
      body: 'Owner-approved editorial draft. Review the article text, sources, Scripture and claims, protected Cloudflare preview, accessibility, and SEO before marking this pull request ready and merging. AI assistance never publishes automatically.' }),
  })
  if (!pull.html_url) throw new Error('GitHub did not return a pull request URL')
  return pull.html_url
}
