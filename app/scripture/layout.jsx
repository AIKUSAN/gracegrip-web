/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
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
  },
}

export default function ScriptureLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Scripture Library',
            url: 'https://gracegrip.app/scripture',
            description:
              'Recovery-focused Bible verses organized by temptation, identity, forgiveness, strength, peace, and freedom.',
            inLanguage: 'en-US',
            isPartOf: {
              '@type': 'WebSite',
              name: 'GraceGrip',
              url: 'https://gracegrip.app',
            },
            about: {
              '@type': 'Thing',
              name: 'Bible verses for addiction recovery',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
