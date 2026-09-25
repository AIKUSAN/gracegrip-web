import { notFound } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { FOCUS_AREAS, getFocusArea } from '@/content/focusAreas'
import { GoalChoice } from '@/components/GoalChoice'

export function generateStaticParams() { return FOCUS_AREAS.map(({ id }) => ({ slug: id })) }

export async function generateMetadata({ params }) {
  const { slug } = await params
  const area = getFocusArea(slug)
  if (!area) return { title: 'Focus not found | GraceGrip' }
  return { title: `${area.title} support | GraceGrip`, description: area.summary, alternates: { canonical: `https://gracegrip.app/focus/${slug}` } }
}

export default async function FocusGuide({ params }) {
  const { slug } = await params
  const area = getFocusArea(slug)
  if (!area) notFound()
  return <AppShell allowBeforeOnboarding><article className="v2-page v2-guide">
    <Link className="v2-back" href="/focus">← All focus areas</Link>
    <header className="v2-intro"><h1>{area.title}</h1><p>{area.summary}</p></header>
    <div className="v2-guide-columns"><div>
      <section><h2>One next step</h2><p>{area.firstStep}</p><Link className="v2-action" href="/emergency">Open Help Now</Link></section>
      <section><h2>Notice the pattern</h2><p>{area.reflection}</p><p>You can reflect privately in your journal. You decide what to write and whether to keep it.</p><Link href="/journal">Open Journal</Link></section>
      <section><h2>If faith helps</h2><p>Prayer and Scripture are available when you want them. They are never required for this path.</p><Link href="/scripture">Explore Scripture</Link></section>
    </div><aside><section className="v2-guide-caution"><h2>When to seek help</h2><p>{area.caution}</p><p>{area.professional}</p><p>If there is immediate danger, contact local emergency services. For country-searchable emotional support, use the <a href="https://www.iasp.info/crisis-centres-helplines/" target="_blank" rel="noopener noreferrer">IASP helpline directory</a>.</p></section><GoalChoice area={area} /></aside></div>
    <p className="v2-disclosure">GraceGrip offers nonclinical self-help. It does not diagnose, treat withdrawal, prescribe medication, or replace a qualified professional. <a href={area.source} target="_blank" rel="noopener noreferrer">Source for further reading</a>.</p>
  </article></AppShell>
}
