/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import Link from 'next/link'

export function PublicPageIntro({ eyebrow, title, description, highlights = [], links = [] }) {
  return (
    <section className="panel panel-wide">
      {eyebrow ? (
        <p className="muted" style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {eyebrow}
        </p>
      ) : null}

      <h1 style={{ marginTop: 0, marginBottom: '0.75rem' }}>{title}</h1>
      <p style={{ marginTop: 0, marginBottom: highlights.length > 0 ? '1rem' : 0 }}>{description}</p>

      {highlights.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {links.length > 0 ? (
        <nav aria-label="Explore GraceGrip" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="btn-ghost">
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  )
}
