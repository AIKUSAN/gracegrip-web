/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import { createSign } from 'crypto'

const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters'
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'

function readEnv(name) {
  const value = process.env[name]
  return value && value.trim() ? value.trim() : ''
}

export function getGscConfig() {
  const clientEmail = readEnv('GSC_CLIENT_EMAIL')
  const privateKeyRaw = readEnv('GSC_PRIVATE_KEY')
  const siteUrl = readEnv('GSC_SITE_URL') || 'sc-domain:gracegrip.app'
  const outputDir = readEnv('GSC_OUTPUT_DIR') || 'seo-report'

  return {
    clientEmail,
    privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
    siteUrl,
    outputDir,
  }
}

export function hasGscSecrets(config = getGscConfig()) {
  return Boolean(config.clientEmail && config.privateKey)
}

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function buildJwt(config) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: config.clientEmail,
      scope: GSC_SCOPE,
      aud: TOKEN_ENDPOINT,
      exp: now + 3600,
      iat: now,
    }),
  )

  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${payload}`)
  signer.end()

  const signature = signer
    .sign(config.privateKey, 'base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

  return `${header}.${payload}.${signature}`
}

export async function getAccessToken(config = getGscConfig()) {
  const assertion = buildJwt(config)

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Google OAuth failed: ${response.status} ${response.statusText}\n${text}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function googleApiRequest(url, options, config = getGscConfig()) {
  const token = await getAccessToken(config)

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  })

  return response
}
