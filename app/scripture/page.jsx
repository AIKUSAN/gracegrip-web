/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { ScriptureRouteClient } from '@/components/routes/ScriptureRouteClient'
import { PublicPageIntro } from '@/components/seo/PublicPageIntro'
import { verses } from '@/content/loaders'

export default function Page() {
  const categoryLabels = ['temptation', 'identity', 'forgiveness', 'strength', 'peace', 'freedom']
  const categorySummary = categoryLabels.map((category) => {
    const label = category[0].toUpperCase() + category.slice(1)
    const count = verses.filter((verse) => verse.category === category).length
    return `${label}: ${count} verses`
  })

  return (
    <div className="screen-stack">
      <PublicPageIntro
        eyebrow="Recovery Scripture library"
        title="Bible verses for temptation, shame, identity, peace, strength, and freedom."
        description="GraceGrip organizes recovery-focused Scripture so you can reach for a verse that matches the battle in front of you instead of searching blindly in the middle of stress, panic, or relapse pressure."
        highlights={categorySummary}
        links={[
          { href: '/emergency', label: 'Get Emergency Help' },
          { href: '/devotional', label: 'Open Daily Devotional' },
          { href: '/', label: 'Return to Dashboard' },
        ]}
      />

      <section className="panel panel-wide">
        <h2 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Scripture built for use, not browsing only</h2>
        <p style={{ marginTop: 0 }}>
          The GraceGrip library is designed around real recovery patterns. Temptation verses help in the moment,
          identity verses fight shame, peace verses slow anxious thinking, and freedom verses re-center the mind
          on what God says is possible.
        </p>
        <p style={{ marginBottom: 0 }}>
          Save the verses that anchor you most, then come back to them quickly when the next hard day arrives.
        </p>
      </section>

      <ScriptureRouteClient />
    </div>
  )
}
