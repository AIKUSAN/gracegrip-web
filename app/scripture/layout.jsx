/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { JsonLd } from '@/components/JsonLd'

export const metadata = {
  title: 'Scripture Library — Optional Christian Encouragement',
  description:
    'Curated Bible verses for temptation, identity, forgiveness, strength, peace, and freedom. Available by choice.',
  alternates: {
    canonical: 'https://gracegrip.app/scripture',
  },
  openGraph: {
    title: 'GraceGrip Scripture — Biblical Recovery Support',
    description: 'Bible verses for reflection and encouragement, available by choice. Free and private.',
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
                'Bible verses organized by temptation, identity, forgiveness, strength, peace, and freedom.',
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
