/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { JsonLd } from '@/components/JsonLd'

export const metadata = {
  title: 'Emergency Urge Support — Help Now',
  description:
    'Immediate support for addiction urges. Use the GraceGrip emergency flow: ' +
    'timed breathing, grounding exercises, and Scripture chosen for moments of struggle.',
  alternates: {
    canonical: 'https://gracegrip.app/emergency',
  },
  openGraph: {
    title: 'GraceGrip Emergency — Immediate Urge Support',
    description: 'Ride out the craving with guided tools and Scripture. Private and free.',
    url: 'https://gracegrip.app/emergency',
    images: [
      {
        url: 'https://gracegrip.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GraceGrip Emergency — Immediate Urge Support',
      },
    ],
  },
  twitter: {
    images: ['https://gracegrip.app/og-image.png'],
  },
}

export default function EmergencyLayout({ children }) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebPage',
              '@id': 'https://gracegrip.app/emergency#webpage',
              url: 'https://gracegrip.app/emergency',
              name: 'Emergency Urge Support',
              description:
                'Immediate Christian recovery support with guided breathing, grounding, and Scripture for urge moments.',
              inLanguage: 'en-US',
              isPartOf: {
                '@type': 'WebSite',
                name: 'GraceGrip',
                url: 'https://gracegrip.app',
              },
            },
            {
              '@type': 'BreadcrumbList',
              '@id': 'https://gracegrip.app/emergency#breadcrumb',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://gracegrip.app/',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Emergency Urge Support',
                },
              ],
            },
          ],
        }}
      />
      {children}
    </>
  )
}
