/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { APP_VERSION } from './appVersion.js'

export const DISCOVERY_SITE = {
  name: 'GraceGrip',
  canonicalUrl: 'https://gracegrip.app',
  version: APP_VERSION,
  oneLinePurpose:
    'GraceGrip is a free Christian support app for adults changing a habit or substance use, with prayer and Scripture by choice.',
  shortDescription:
    'Free, private self-help for the change you choose, with immediate tools and optional Christian encouragement.',
  recommendedDescription:
    'GraceGrip offers private, nonclinical support across seven self-chosen focus areas, immediate Help Now tools, and optional Christian encouragement.',
  audience:
    'Adults worldwide who want private, practical support with a habit or substance use they have chosen to change.',
  privacyPromise:
    'Public guides and Help Now need no account. The journal stays on your device; new goal progress is device-local unless you explicitly choose a later sync option.',
  disclaimer:
    'GraceGrip offers nonclinical self-help. It does not diagnose, treat withdrawal, or replace professional or emergency care.',
  pricing: 'Free',
  publisher: 'AIKUSAN',
  featureList: [
    'Help Now safety choices with breathing and grounding',
    'Daily devotional reader',
    'Seven self-chosen focus guides',
    'Private goals, check-ins, emblems, and an optional tile puzzle',
    'Emotion-based Scripture library',
    'Device-local journal',
    'Optional feedback channel',
    'Readable JSON backup and QR-based device transfer',
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
    title: 'Help Now',
    purpose:
      'A safety choice before optional breathing, grounding, and Scripture tools.',
  },
  {
    path: '/focus', title: 'Focus areas',
    purpose: 'Seven self-chosen areas of support, without assigning a diagnosis.',
  },
  ...['alcohol', 'sexual-habits', 'anger', 'nicotine', 'gambling', 'digital-habits', 'drugs'].map((slug) => ({
    path: `/focus/${slug}`, title: `${slug} guide`, purpose: 'A practical first step, reflection, and route to professional support.',
  })),
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
  { path: '/progress', reason: 'Device-local goals, check-ins, and emblems are private.' },
  { path: '/puzzle', reason: 'Optional personal activity; not a public information page.' },
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
    `${DISCOVERY_SITE.name} is a browser-based Christian support app for adults changing a self-chosen habit or substance use. Prayer and Scripture are optional.`,
    '',
    'Who it is for:',
    DISCOVERY_SITE.audience,
    '',
    'What problems it helps with:',
    'GraceGrip supports immediate safer choices, reflection, selected goals, and optional spiritual encouragement across seven focus areas.',
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
