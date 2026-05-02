/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { JsonLd } from '@/components/JsonLd'

export const metadata = {
  title: 'Daily Devotional — Scripture-Based Habit Change',
  description:
    'A daily Christian devotional journey for addiction recovery. Scripture-based ' +
    'reflections, prayers, and practical action steps for healing.',
  alternates: {
    canonical: 'https://gracegrip.app/devotional',
  },
  openGraph: {
    title: 'GraceGrip Daily Devotional — Spiritual Recovery',
    description: 'Grow in your recovery journey with daily grace-first devotionals. Free and private.',
    url: 'https://gracegrip.app/devotional',
    images: [
      {
        url: 'https://gracegrip.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GraceGrip Daily Devotional — Spiritual Recovery',
      },
    ],
  },
  twitter: {
    images: ['https://gracegrip.app/og-image.png'],
  },
}

export default function DevotionalLayout({ children }) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              '@id': 'https://gracegrip.app/devotional#webpage',
              url: 'https://gracegrip.app/devotional',
              name: 'Daily Devotional',
              description:
                'Daily Scripture-based devotionals for Christian addiction recovery, reflection, and habit change.',
              inLanguage: 'en-US',
              isPartOf: {
                '@type': 'WebSite',
                name: 'GraceGrip',
                url: 'https://gracegrip.app',
              },
            },
            {
              '@type': 'BreadcrumbList',
              '@id': 'https://gracegrip.app/devotional#breadcrumb',
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
                  name: 'Daily Devotional',
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
