/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { PublicPageIntro } from '@/components/seo/PublicPageIntro'
import { HomeRouteClient } from '@/components/routes/HomeRouteClient'
import { devotionals, verses } from '@/content/loaders'

export default function Page() {
  const categoryCount = new Set(verses.map((verse) => verse.category)).size

  return (
    <div className="screen-stack">
      <PublicPageIntro
        eyebrow="Private Christian recovery support"
        title="GraceGrip is a free Scripture-based recovery app for pornography and masturbation addiction."
        description="GraceGrip gives people a private, grace-first place to fight temptation, steady anxious thoughts, and build honest daily recovery habits without creating an account or sending personal data to a server."
        highlights={[
          `Browse ${categoryCount} recovery-focused Scripture categories for temptation, identity, peace, strength, forgiveness, and freedom.`,
          `Read rotating daily devotionals drawn from a ${devotionals.length}-day Scripture plan and mark progress on your own device.`,
          'Use emergency urge support tools like guided breathing, grounding exercises, and panic verses for hard moments.',
          'Track your clean streak, keep an AES-encrypted journal, and move your data between devices without cloud sync.',
        ]}
        links={[
          { href: '/emergency', label: 'Open Emergency Support' },
          { href: '/scripture', label: 'Browse Scripture Library' },
          { href: '/devotional', label: 'Read Daily Devotional' },
        ]}
      />

      <section className="panel panel-wide">
        <h2 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Why GraceGrip is different</h2>
        <p style={{ marginTop: 0 }}>
          Most recovery products ask for an account before they help. GraceGrip does not. It loads fast,
          works in a browser, keeps your recovery data on your device, and centers every feature around
          Scripture, practical interruption tools, and grace instead of shame.
        </p>
        <p style={{ marginBottom: 0 }}>
          Use the interactive app below to check your streak, read today&apos;s verse, and move straight into
          the next action that helps you stay grounded.
        </p>
      </section>

      <HomeRouteClient />
    </div>
  )
}
