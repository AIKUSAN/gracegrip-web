import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { RESOURCE_ARTICLES } from '@/content/resources'

export const metadata = {
  title: 'Resources | GraceGrip',
  description: 'GraceGrip guidance and faith reflections for the change you choose.',
  alternates: { canonical: 'https://gracegrip.app/resources' },
  robots: { index: RESOURCE_ARTICLES.every((article) => article.reviewStatus === 'approved'), follow: true },
}

export default function ResourcesPage() {
  return <AppShell><div className="cc-page cc-resources">
    <header className="cc-intro"><h1>Resources for your next step</h1><p>Practical guides and optional faith reflections.{RESOURCE_ARTICLES.some((article) => article.reviewStatus !== 'approved') ? ' Some preview drafts are still in review.' : ''}</p></header>
    <div className="cc-resource-grid">{RESOURCE_ARTICLES.map((article) => <Link href={`/resources/${article.slug}`} key={article.slug} className="cc-resource-card"><span>{article.category}</span><h2>{article.title}</h2><p>{article.description}</p><strong>{article.reviewStatus === 'approved' ? 'Read article →' : 'Read draft →'}</strong></Link>)}</div>
    <aside className="cc-note"><h2>Need help now?</h2><p>If you are facing an immediate decision or safety concern, start with Help Now.</p><Link href="/emergency">Open Help Now</Link></aside>
  </div></AppShell>
}
