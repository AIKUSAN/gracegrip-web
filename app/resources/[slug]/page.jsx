import Link from 'next/link'
import { notFound } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { RESOURCE_ARTICLES, getResourceArticle } from '@/content/resources'

export function generateStaticParams() { return RESOURCE_ARTICLES.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = getResourceArticle(slug)
  if (!article) return { title: 'Resource not found | GraceGrip' }
  return {
    title: `${article.title} | GraceGrip`,
    description: article.description,
    alternates: { canonical: `https://gracegrip.app/resources/${slug}` },
    robots: article.reviewStatus === 'approved' ? { index: true, follow: true } : { index: false, follow: false },
  }
}

export default async function ResourceArticle({ params }) {
  const { slug } = await params
  const article = getResourceArticle(slug)
  if (!article) notFound()
  return <AppShell allowBeforeOnboarding><article className="v2-page v2-article">
    <Link href="/resources" className="v2-back">← All resources</Link>
    <header className="v2-intro"><span className="v2-kicker">{article.category}{article.reviewStatus === 'approved' ? '' : ' · Draft under review'}</span><h1>{article.title}</h1><p>{article.description}</p></header>
    <div className="v2-article-content">{article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
      {article.source && <p className="v2-source">Further reading: <a href={article.source} target="_blank" rel="noopener noreferrer">original source</a>.</p>}
      {article.focusId && <p><Link href={`/focus/${article.focusId}`}>Open the related focus path →</Link></p>}
      <p className="v2-disclosure">GraceGrip offers nonclinical self-help and does not replace professional care. In immediate danger, contact local emergency services.</p>
    </div>
  </article></AppShell>
}
