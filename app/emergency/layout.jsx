/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
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
  },
}

export default function EmergencyLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Emergency Urge Support',
            url: 'https://gracegrip.app/emergency',
            description:
              'Immediate Christian recovery support with guided breathing, grounding, and Scripture for urge moments.',
            inLanguage: 'en-US',
            isPartOf: {
              '@type': 'WebSite',
              name: 'GraceGrip',
              url: 'https://gracegrip.app',
            },
            about: {
              '@type': 'Thing',
              name: 'Addiction recovery support',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
