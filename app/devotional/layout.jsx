/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
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
  },
}

export default function DevotionalLayout({ children }) {
  return <>{children}</>
}
