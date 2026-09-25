import { createRemoteJWKSet, jwtVerify } from 'jose'

let cachedKeySet
let cachedIssuer

async function accessSubject(request, env) {
  if (!env.ACCESS_ISSUER || !env.ACCESS_AUD) return null
  let issuer
  try { issuer = new URL(env.ACCESS_ISSUER) } catch { return null }
  if (issuer.protocol !== 'https:' || !issuer.hostname.endsWith('.cloudflareaccess.com') || issuer.pathname !== '/') return null
  const token = request.headers.get('CF-Access-Jwt-Assertion')
  if (!token) return null
  if (cachedIssuer !== issuer.origin) {
    cachedIssuer = issuer.origin
    cachedKeySet = createRemoteJWKSet(new URL('/cdn-cgi/access/certs', issuer.origin))
  }
  try {
    const { payload } = await jwtVerify(token, cachedKeySet, { issuer: issuer.origin, audience: env.ACCESS_AUD })
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch { return null }
}

export async function verifyOwnerAccess(request, env) {
  if (!env.OWNER_ACCESS_SUB) return false
  return (await accessSubject(request, env)) === env.OWNER_ACCESS_SUB
}

export async function editorialRole(request, env) {
  const subject = await accessSubject(request, env)
  if (!subject) return null
  const reviewers = (env.REVIEWER_ACCESS_SUBS ?? '').split(',').map((item) => item.trim()).filter(Boolean)
  if (subject === env.OWNER_ACCESS_SUB) return { role: 'owner', subject, qualifiedReviewer: reviewers.includes(subject) }
  const editors = (env.EDITOR_ACCESS_SUBS ?? '').split(',').map((item) => item.trim()).filter(Boolean)
  if (editors.includes(subject) || reviewers.includes(subject)) return { role: 'editor', subject, qualifiedReviewer: reviewers.includes(subject) }
  return null
}
