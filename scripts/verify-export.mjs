/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const output = 'out'
const publicRoutes = ['/', '/emergency', '/scripture', '/devotional']
const privateRoutes = ['/journal', '/settings']

async function routeHtml(path) {
  const slug = path === '/' ? 'index' : path.slice(1)
  const candidates = [join(output, `${slug}.html`), join(output, slug, 'index.html')]
  for (const candidate of candidates) {
    try {
      return await readFile(candidate, 'utf8')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  throw new Error(`Static export missing ${path}`)
}

const home = await routeHtml('/')
for (const path of [...publicRoutes, ...privateRoutes]) {
  const html = await routeHtml(path)
  if (!html.includes('https://gracegrip.app')) throw new Error(`${path} lacks canonical host`)
  if (privateRoutes.includes(path) && !/noindex/i.test(html)) {
    throw new Error(`${path} lacks noindex metadata`)
  }
  if (path !== '/' && html.includes('static.cloudflareinsights.com/beacon.min.js')) {
    throw new Error(`Analytics script leaked into ${path}`)
  }
}

if (!home.includes('https://gracegrip.app/')) throw new Error('Homepage canonical missing')
if (process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN && !home.includes('static.cloudflareinsights.com/beacon.min.js')) {
  throw new Error('Production analytics token was set but homepage beacon is absent')
}
for (const file of ['_headers', '_routes.json', 'robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt', 'og-image.png']) {
  await access(join(output, file))
}
const routes = JSON.parse(await readFile(join(output, '_routes.json'), 'utf8'))
if (JSON.stringify(routes.include) !== JSON.stringify(['/api/feedback'])) {
  throw new Error('Pages Functions invocation scope drifted')
}

console.log('Static export verified: six routes, discovery files, privacy metadata, and feedback-only Function routing.')
