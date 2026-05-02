/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { JsonLd } from '@/components/JsonLd'

export const metadata = {
  title: 'Scripture Library — Bible Verses for Addiction Recovery',
  description:
    'Curated Scripture library for addiction recovery. Bible verses for temptation, ' +
    'shame, identity, and peace — indexed to speak to your recovery journey.',
  alternates: {
    canonical: 'https://gracegrip.app/scripture',
  },
  openGraph: {
    title: 'GraceGrip Scripture — Biblical Recovery Support',
    description: 'Find strength in God’s Word with recovery-focused Bible verses. Free and private.',
    url: 'https://gracegrip.app/scripture',
    images: [
      {
        url: 'https://gracegrip.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GraceGrip Scripture — Biblical Recovery Support',
      },
    ],
  },
  twitter: {
    images: ['https://gracegrip.app/og-image.png'],
  },
}

export default function ScriptureLayout({ children }) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              '@id': 'https://gracegrip.app/scripture#webpage',
              url: 'https://gracegrip.app/scripture',
              name: 'Scripture Library',
              description:
                'Recovery-focused Bible verses organized by temptation, identity, forgiveness, strength, peace, and freedom.',
              inLanguage: 'en-US',
              isPartOf: {
                '@type': 'WebSite',
                name: 'GraceGrip',
                url: 'https://gracegrip.app',
              },
            },
            {
              '@type': 'BreadcrumbList',
              '@id': 'https://gracegrip.app/scripture#breadcrumb',
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
                  name: 'Scripture Library',
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
