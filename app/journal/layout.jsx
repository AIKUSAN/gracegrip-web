/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
export const metadata = {
  title: 'Encrypted Journal — Private Recovery Space',
  description:
    'A private device-local journal. Entries are encrypted before local storage when Web Crypto is available.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://gracegrip.app/journal',
  },
  openGraph: {
    title: 'GraceGrip Journal — Encrypted & Private',
    description: 'A private space for reflection with device-local entries and portable backups.',
    url: 'https://gracegrip.app/journal',
  },
}

export default function JournalLayout({ children }) {
  return <>{children}</>
}
