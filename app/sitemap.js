import { DISCOVERY_PUBLIC_ROUTES, getDiscoveryUrl } from '../src/lib/discoveryMetadata.js'

export default function sitemap() {
  const currentDate = new Date().toISOString()
  const routeSettings = {
    '/': { changeFrequency: 'weekly', priority: 1.0 },
    '/emergency': { changeFrequency: 'monthly', priority: 0.9 },
    '/scripture': { changeFrequency: 'monthly', priority: 0.8 },
    '/devotional': { changeFrequency: 'weekly', priority: 0.8 },
  }

  return DISCOVERY_PUBLIC_ROUTES.map((route) => ({
    url: getDiscoveryUrl(route.path),
    lastModified: currentDate,
    changeFrequency: routeSettings[route.path].changeFrequency,
    priority: routeSettings[route.path].priority,
  }))
}
