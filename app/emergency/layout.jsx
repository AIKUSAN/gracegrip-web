/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { JsonLd } from '@/components/JsonLd'

export const metadata = {
  title: 'Help Now — Choose a Safe Next Step',
  description:
    'Choose a safety route first, then use private breathing, grounding, and optional Scripture tools when appropriate.',
  alternates: {
    canonical: 'https://gracegrip.app/emergency',
  },
  openGraph: {
    title: 'GraceGrip Help Now — A Safe Next Step',
    description: 'Immediate safety guidance and optional private support tools. Free and open without an account.',
    url: 'https://gracegrip.app/emergency',
    images: [
      {
        url: 'https://gracegrip.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GraceGrip Help Now — A Safe Next Step',
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
              name: 'Help Now',
              description:
                'Safety choice followed by private breathing, grounding, and optional Scripture tools.',
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
                  name: 'Help Now',
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
