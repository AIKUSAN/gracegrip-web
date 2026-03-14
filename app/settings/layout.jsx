/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */

export const metadata = {
  title: 'Settings — GraceGrip',
  description:
    'Customize GraceGrip: set your profile name, choose light or dark mode, ' +
    'export or import your encrypted backup, and manage your recovery data privately.',
  alternates: {
    canonical: 'https://gracegrip.app/settings',
  },
  openGraph: {
    title: 'Settings — GraceGrip',
    description:
      'Manage your profile, theme, and encrypted backup. All data stays on your device.',
    url: 'https://gracegrip.app/settings',
  },
}

export default function SettingsLayout({ children }) {
  return children
}
