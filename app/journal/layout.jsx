/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */

export const metadata = {
  title: 'Private Journal — GraceGrip',
  description:
    'An AES-encrypted private journal for your recovery journey. ' +
    'Your entries never leave your device — no account, no cloud, completely private.',
  alternates: {
    canonical: 'https://gracegrip.app/journal',
  },
  openGraph: {
    title: 'Private Journal — GraceGrip',
    description:
      'AES-encrypted private journal. Your entries stay on your device — no account, no cloud.',
    url: 'https://gracegrip.app/journal',
  },
}

export default function JournalLayout({ children }) {
  return children
}
