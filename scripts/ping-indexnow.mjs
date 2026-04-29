/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
/**
 * IndexNow ping — run once after each production deploy to gracegrip.app:
 *
 *   npm run ping:indexnow
 *
 * Notifies Bing, DuckDuckGo, Yandex, and Ecosia of all GraceGrip URLs instantly.
 * These engines process IndexNow submissions within minutes of receiving them.
 *
 * Note: Google does not support IndexNow. Use Google Search Console → URL Inspection
 * → "Request Indexing" to trigger Google crawls manually.
 *
 * API key verification: https://gracegrip.app/1a497fa5-7965-4791-b2a9-46aa47c55114.txt
 */

const API_KEY = '1a497fa5-7965-4791-b2a9-46aa47c55114'
const HOST = 'gracegrip.app'
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/emergency`,
  `https://${HOST}/scripture`,
  `https://${HOST}/devotional`,
]

const payload = {
  host: HOST,
  key: API_KEY,
  keyLocation: KEY_LOCATION,
  urlList: URLS,
}

console.log(`Pinging IndexNow for ${URLS.length} URLs on ${HOST}...`)

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
})

console.log(`IndexNow → ${res.status} ${res.statusText}`)

if (res.status === 200) {
  console.log('✅ All URLs submitted — Bing/DuckDuckGo/Yandex/Ecosia will index within minutes.')
} else if (res.status === 202) {
  console.log('✅ Accepted — URLs queued for indexing.')
} else if (res.status === 400) {
  console.error('❌ 400 Bad Request — check that urlList entries match the host.')
} else if (res.status === 403) {
  console.error('❌ 403 Forbidden — API key file not found or key mismatch. Ensure public/1a497fa5-7965-4791-b2a9-46aa47c55114.txt is deployed.')
} else if (res.status === 429) {
  console.error('❌ 429 Too Many Requests — already pinged today. IndexNow allows one batch submission per day per key.')
} else {
  console.error(`❌ Unexpected status ${res.status} — check IndexNow API docs.`)
}
