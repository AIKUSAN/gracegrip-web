import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { FOCUS_AREAS } from '@/content/focusAreas'

export const metadata = {
  title: 'Choose a focus | GraceGrip',
  description: 'Explore seven self-chosen paths for practical, private support. Choosing a path does not give you a diagnosis.',
  alternates: { canonical: 'https://gracegrip.app/focus' },
}

export default function FocusPage() {
  return <AppShell allowBeforeOnboarding><div className="v2-page">
    <header className="v2-intro"><h1>What would you like support with?</h1><p>Choose a topic that matters to you. You do not need to call it an addiction, make an account, or choose a goal today.</p></header>
    <div className="v2-focus-grid">{FOCUS_AREAS.map((area) => <Link className="v2-focus-link" href={`/focus/${area.id}`} key={area.id}><strong>{area.title}</strong><span>{area.summary}</span><span className="v2-link-end">Explore this path →</span></Link>)}</div>
    <aside className="v2-note"><h2>Related pressures matter too</h2><p>Stress, loneliness, grief, and relationship pressure can shape what you are facing. You can use Help Now for a private next step at any time.</p><Link href="/emergency">Open Help Now</Link></aside>
  </div></AppShell>
}
