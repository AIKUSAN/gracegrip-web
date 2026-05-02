/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
export const metadata = {
  title: 'Settings — GraceGrip Recovery',
  description: 'Manage your profile, theme, and private data backup for the GraceGrip app.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://gracegrip.app/settings',
  },
}

export default function SettingsLayout({ children }) {
  return <>{children}</>
}
