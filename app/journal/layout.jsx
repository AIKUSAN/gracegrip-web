/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
export const metadata = {
  title: 'Encrypted Journal — Private Recovery Space',
  description:
    'Private, AES-encrypted journaling for recovery. Safely log your ' +
    'thoughts and progress without worrying about your data leaving your device.',
  alternates: {
    canonical: 'https://gracegrip.app/journal',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'GraceGrip Journal — Encrypted & Private',
    description: 'A safe, offline space to process your journey with encryption you can trust.',
    url: 'https://gracegrip.app/journal',
  },
}

export default function JournalLayout({ children }) {
  return <>{children}</>
}
