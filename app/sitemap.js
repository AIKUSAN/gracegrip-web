import { DISCOVERY_PUBLIC_ROUTES, getDiscoveryUrl } from '../src/lib/discoveryMetadata.js'
import publishedArticles from '../src/content/publishedArticles.json' with { type: 'json' }
import { RESOURCE_ARTICLES } from '../src/content/resources.js'

export const dynamic = 'force-static'

export default function sitemap() {
  const currentDate = new Date().toISOString()
  const routeSettings = {
    '/': { changeFrequency: 'weekly', priority: 1.0 },
    '/emergency': { changeFrequency: 'monthly', priority: 0.9 },
    '/scripture': { changeFrequency: 'monthly', priority: 0.8 },
    '/devotional': { changeFrequency: 'weekly', priority: 0.8 },
    '/focus': { changeFrequency: 'monthly', priority: 0.8 },
  }

  const publicRoutes = [
    ...DISCOVERY_PUBLIC_ROUTES,
    ...publishedArticles.filter((article) => article.reviewStatus === 'approved').map((article) => ({ path: `/resources/${article.slug}` })),
  ]
  if (RESOURCE_ARTICLES.length > 0 && RESOURCE_ARTICLES.every((article) => article.reviewStatus === 'approved')) publicRoutes.push({ path: '/resources' })

  return publicRoutes.map((route) => ({
    url: getDiscoveryUrl(route.path),
    lastModified: currentDate,
    changeFrequency: routeSettings[route.path]?.changeFrequency ?? 'monthly',
    priority: routeSettings[route.path]?.priority ?? 0.6,
  }))
}
