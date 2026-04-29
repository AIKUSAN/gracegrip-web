/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { EmergencyRouteClient } from '@/components/routes/EmergencyRouteClient'
import { PublicPageIntro } from '@/components/seo/PublicPageIntro'

export default function Page() {
  return (
    <div className="screen-stack">
      <PublicPageIntro
        eyebrow="Immediate urge support"
        title="Emergency help for temptation, panic, and relapse-risk moments."
        description="The GraceGrip emergency flow is built for the exact moment an urge hits. Instead of leaving you alone with a spiral, it walks you through a timer, calming exercises, and recovery-focused Scripture you can act on right away."
        highlights={[
          'Ride out the first wave of temptation with an urge timer designed for the hardest minutes.',
          'Calm your body with guided breathing and grounding exercises before shame or panic takes over.',
          'Read and copy Scripture chosen for high-pressure moments when you need a fast way back to truth.',
          'Choose one next action immediately so the recovery process moves from thought to motion.',
        ]}
        links={[
          { href: '/', label: 'Back to GraceGrip Home' },
          { href: '/scripture', label: 'Browse Recovery Verses' },
          { href: '/journal', label: 'Reflect in Journal' },
        ]}
      />

      <section className="panel panel-wide">
        <h2 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Built for the hardest minute, not the ideal day</h2>
        <p style={{ margin: 0 }}>
          This page is intentionally direct. It is meant for moments when the mind is scattered, shame feels close,
          and you need simple next steps that interrupt the pattern fast. The interactive tools below stay private
          and work inside the GraceGrip app without asking for a login.
        </p>
      </section>

      <EmergencyRouteClient />
    </div>
  )
}
