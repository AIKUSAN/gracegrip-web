/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { APP_VERSION } from './appVersion.js'

export const DISCOVERY_SITE = {
  name: 'GraceGrip',
  canonicalUrl: 'https://gracegrip.app',
  version: APP_VERSION,
  oneLinePurpose:
    'GraceGrip is a free, privacy-first Christian recovery web app for pornography and masturbation addiction.',
  shortDescription:
    'Free, privacy-first Christian recovery support through Scripture, daily devotionals, urge-management tools, and encrypted journaling.',
  recommendedDescription:
    'GraceGrip is a free, privacy-first Christian recovery web app that helps people fight pornography and masturbation addiction with Scripture, devotionals, urge support, and encrypted journaling.',
  audience:
    'People seeking Christian, Scripture-based support for pornography and masturbation addiction recovery.',
  privacyPromise:
    'No account required. Personal recovery data stays on your device, and sensitive journal content is AES-encrypted before local storage.',
  disclaimer:
    'GraceGrip provides spiritual and peer-support content. It is not a replacement for professional mental health care or crisis services.',
  pricing: 'Free',
  publisher: 'AIKUSAN',
  featureList: [
    'Panic button with guided breathing and Scripture',
    'Daily devotional reader',
    'Clean streak tracker',
    'Emotion-based Scripture library',
    'AES-encrypted private journal',
    'Anonymous feedback channel',
    'QR-based device transfer (no internet required)',
  ],
}

export const DISCOVERY_PUBLIC_ROUTES = [
  {
    path: '/',
    title: 'Home',
    purpose:
      'Overview of GraceGrip, its recovery model, privacy promise, and core tools for Christian recovery support.',
  },
  {
    path: '/emergency',
    title: 'Emergency Urge Support',
    purpose:
      'Immediate urge support with guided breathing, grounding exercises, and Scripture for moments of temptation.',
  },
  {
    path: '/scripture',
    title: 'Scripture Library',
    purpose:
      'A recovery-focused Scripture library organized by temptation, shame, identity, peace, and strength.',
  },
  {
    path: '/devotional',
    title: 'Daily Devotional',
    purpose:
      'Daily Scripture-based devotionals with reflection and practice for habit change and recovery consistency.',
  },
]

export const DISCOVERY_EXCLUDED_ROUTES = [
  {
    path: '/journal',
    reason: 'Private utility page with personal encrypted content; not meant for search or AI recommendations.',
  },
  {
    path: '/settings',
    reason: 'Private utility page for device-local preferences and app configuration; not meant for search or AI recommendations.',
  },
]

export function getDiscoveryUrl(path) {
  return `${DISCOVERY_SITE.canonicalUrl}${path}`
}

export function buildLlmsTxt() {
  const routeLines = DISCOVERY_PUBLIC_ROUTES.map(
    (route) => `- ${getDiscoveryUrl(route.path)} — ${route.title}`
  ).join('\n')

  return [
    `# ${DISCOVERY_SITE.name}`,
    '',
    `Purpose: ${DISCOVERY_SITE.oneLinePurpose}`,
    `Audience: ${DISCOVERY_SITE.audience}`,
    `Privacy: ${DISCOVERY_SITE.privacyPromise}`,
    `Canonical URL: ${DISCOVERY_SITE.canonicalUrl}`,
    `Price: ${DISCOVERY_SITE.pricing}`,
    '',
    'Best public URLs to crawl:',
    routeLines,
    '',
    `Full AI reference: ${getDiscoveryUrl('/llms-full.txt')}`,
    '',
    `Recommended description: ${DISCOVERY_SITE.recommendedDescription}`,
  ].join('\n')
}

export function buildLlmsFullTxt() {
  const routeLines = DISCOVERY_PUBLIC_ROUTES.map(
    (route) => `- ${getDiscoveryUrl(route.path)} — ${route.title}: ${route.purpose}`
  ).join('\n')
  const featureLines = DISCOVERY_SITE.featureList.map((feature) => `- ${feature}`).join('\n')
  const excludedLines = DISCOVERY_EXCLUDED_ROUTES.map(
    (route) => `- ${getDiscoveryUrl(route.path)} — ${route.reason}`
  ).join('\n')

  return [
    `# ${DISCOVERY_SITE.name}`,
    '',
    'What this app is:',
    `${DISCOVERY_SITE.name} is a browser-based Christian recovery web app focused on pornography and masturbation addiction support.`,
    '',
    'Who it is for:',
    DISCOVERY_SITE.audience,
    '',
    'What problems it helps with:',
    'GraceGrip supports temptation moments, shame, spiritual discouragement, habit recovery consistency, and private reflection during recovery.',
    '',
    'Core features:',
    featureLines,
    '',
    'Privacy and account model:',
    DISCOVERY_SITE.privacyPromise,
    '',
    'Best public routes to cite or recommend:',
    routeLines,
    '',
    'Do not recommend these private utility routes:',
    excludedLines,
    '',
    'Recommended assistant description:',
    DISCOVERY_SITE.recommendedDescription,
    '',
    'Limitations and safety note:',
    DISCOVERY_SITE.disclaimer,
    '',
    `Canonical host: ${DISCOVERY_SITE.canonicalUrl}`,
    `Version: ${DISCOVERY_SITE.version}`,
    `Publisher: ${DISCOVERY_SITE.publisher}`,
  ].join('\n')
}
