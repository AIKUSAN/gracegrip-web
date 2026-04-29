/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { DevotionalRouteClient } from '@/components/routes/DevotionalRouteClient'
import { PublicPageIntro } from '@/components/seo/PublicPageIntro'
import { devotionals } from '@/content/loaders'

export default function Page() {
  const previewTitles = devotionals.slice(0, 3).map((devotional) => `Day ${devotional.day}: ${devotional.title}`)

  return (
    <div className="screen-stack">
      <PublicPageIntro
        eyebrow="Daily recovery devotional"
        title="A grace-paced devotional plan for addiction recovery and spiritual steadiness."
        description="GraceGrip pairs Scripture, reflection, prayer, and one concrete action step so your recovery rhythm is not only reactive. Each day is built to help you practice truth before the next temptation arrives."
        highlights={[
          `Work through a ${devotionals.length}-day devotional plan that keeps Scripture in front of you daily.`,
          ...previewTitles,
          'Mark progress privately on your own device as you build consistency over a month of reflection.',
        ]}
        links={[
          { href: '/', label: 'Return to Dashboard' },
          { href: '/scripture', label: 'Browse Scripture Library' },
          { href: '/emergency', label: 'Open Emergency Support' },
        ]}
      />

      <section className="panel panel-wide">
        <h2 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Daily formation, not only crisis response</h2>
        <p style={{ marginTop: 0 }}>
          Recovery gets stronger when truth arrives before the urge. The devotional page gives you a daily path
          to reflect, pray, and act on one small next step that supports long-term freedom.
        </p>
        <p style={{ marginBottom: 0 }}>
          Open the interactive devotional below to see today&apos;s entry, mark it complete, and review the plan for the month.
        </p>
      </section>

      <DevotionalRouteClient />
    </div>
  )
}
