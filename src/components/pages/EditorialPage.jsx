'use client'

import { useEffect, useState } from 'react'
import { parseChatGPTDraft } from '@/lib/editorialDraft'

const blank = { slug: '', title: '', description: '', category: 'Practical help', sections: [{ heading: '', body: '' }], source: '', penName: '', bylineConsent: false }

async function editorialRequest(action, method = 'GET', body, query = '') {
  const response = await fetch(`/api/editor/${action}${query}`, {
    method, credentials: 'same-origin', cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error ?? 'Private editor is unavailable.')
  return data
}

export function EditorialPage() {
  const [drafts, setDrafts] = useState([])
  const [role, setRole] = useState('editor')
  const [qualifiedReviewer, setQualifiedReviewer] = useState(false)
  const [id, setId] = useState(null)
  const [revision, setRevision] = useState(null)
  const [status, setStatus] = useState('draft')
  const [article, setArticle] = useState(blank)
  const [reviewed, setReviewed] = useState(false)
  const [importText, setImportText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadList = async () => {
    const result = await editorialRequest('list')
    setDrafts(result.drafts)
    setRole(result.role)
    setQualifiedReviewer(result.qualifiedReviewer)
  }
  useEffect(() => {
    let active = true
    editorialRequest('list').then((result) => {
      if (!active) return
      setDrafts(result.drafts)
      setRole(result.role)
      setQualifiedReviewer(result.qualifiedReviewer)
    }).catch((issue) => { if (active) setError(issue.message) })
    return () => { active = false }
  }, [])

  const run = async (work) => {
    setBusy(true); setError(''); setNotice('')
    try { await work(); await loadList() } catch (issue) { setError(issue.message ?? 'Please try again.') }
    finally { setBusy(false) }
  }
  const openDraft = (draftId) => run(async () => {
    const { draft } = await editorialRequest('get', 'GET', null, `?id=${encodeURIComponent(draftId)}`)
    setId(draft.id); setRevision(draft.revision); setStatus(draft.status)
    setArticle({ slug: draft.slug, title: draft.title, description: draft.description, category: draft.category,
      sections: draft.sections, source: draft.source ?? '', penName: draft.penName ?? '', bylineConsent: draft.bylineConsent })
    setReviewed(draft.qualifiedReviewRevision === draft.revision)
  })
  const update = (key, value) => setArticle((current) => ({ ...current, [key]: value }))
  const updateSection = (index, key, value) => setArticle((current) => ({ ...current, sections: current.sections.map((section, position) => position === index ? { ...section, [key]: value } : section) }))
  const save = () => run(async () => {
    const result = await editorialRequest('save', 'POST', { id, revision, article })
    setId(result.id); setRevision(result.revision); setStatus('draft'); setReviewed(false)
    setNotice('Private draft saved. Any earlier review was cleared for this revision.')
  })
  const act = (action, success) => run(async () => {
    const result = await editorialRequest(action, 'POST', { id })
    if (action === 'delete') { setId(null); setRevision(null); setStatus('draft'); setArticle(blank) }
    else if (action === 'review') setReviewed(true)
    else if (action === 'approve') setStatus('approved')
    else if (action === 'request-changes') setStatus('changes_requested')
    else if (action === 'publish') setStatus('pr_open')
    setNotice(result.prUrl ? <span>Draft publishing pull request: <a href={result.prUrl} target="_blank" rel="noopener noreferrer">review on GitHub</a>. The article is not live until protected main merges.</span> : success)
  })
  const importDraft = () => {
    const parsed = parseChatGPTDraft(importText)
    if (!parsed) { setError('Paste Markdown with a # title and at least one ## section.'); return }
    setArticle((current) => ({ ...current, title: parsed.title, sections: parsed.sections }))
    setError(''); setNotice('Imported into this form only. Review and save the draft yourself.')
  }

  return <div className="cc-page cc-editor">
    <header className="cc-intro"><h1>Private article editor</h1><p>Drafts stay in editorial D1. Owner approval prepares a draft publishing pull request; merging protected main publishes an article.</p></header>
    {error && <p role="alert" className="cc-account-error">{error}</p>}
    {notice && <p role="status" className="cc-account-notice">{notice}</p>}
    <div className="cc-editor-layout"><aside><h2>Drafts</h2><button type="button" onClick={() => { setId(null); setRevision(null); setStatus('draft'); setArticle(blank); setReviewed(false) }}>New private draft</button><ul>{drafts.map((draft) => <li key={draft.id}><button type="button" onClick={() => openDraft(draft.id)}>{draft.title} <small>({draft.status})</small></button></li>)}</ul></aside>
      <div><section><h2>{id ? 'Edit draft' : 'New draft'}</h2><p>State: {status}{id ? ` · revision ${revision}` : ''}{reviewed ? ' · qualified review current' : ''}</p>
        <label>Slug<input value={article.slug} maxLength={80} onChange={(event) => update('slug', event.target.value)} disabled={busy || !['draft', 'changes_requested'].includes(status)} /></label>
        <label>Title<input value={article.title} maxLength={120} onChange={(event) => update('title', event.target.value)} disabled={busy || !['draft', 'changes_requested'].includes(status)} /></label>
        <label>Description<textarea value={article.description} maxLength={250} onChange={(event) => update('description', event.target.value)} disabled={busy || !['draft', 'changes_requested'].includes(status)} /></label>
        <label>Category<select value={article.category} onChange={(event) => update('category', event.target.value)} disabled={busy || !['draft', 'changes_requested'].includes(status)}><option>Focus guide</option><option>Practical help</option><option>Faith reflection</option></select></label>
        <fieldset><legend>Sections</legend>{article.sections.map((section, index) => <div className="cc-editor-section" key={index}><label>Heading {index + 1}<input value={section.heading} maxLength={120} onChange={(event) => updateSection(index, 'heading', event.target.value)} disabled={busy || !['draft', 'changes_requested'].includes(status)} /></label><label>Body {index + 1}<textarea rows={8} value={section.body} maxLength={3000} onChange={(event) => updateSection(index, 'body', event.target.value)} disabled={busy || !['draft', 'changes_requested'].includes(status)} /></label><button type="button" disabled={busy || article.sections.length === 1} onClick={() => update('sections', article.sections.filter((_, position) => position !== index))}>Remove section</button></div>)}</fieldset>
        <button type="button" disabled={busy || article.sections.length >= 12} onClick={() => update('sections', [...article.sections, { heading: '', body: '' }])}>Add section</button>
        <label>Source URL (optional)<input type="url" value={article.source} maxLength={500} onChange={(event) => update('source', event.target.value)} /></label>
        <label>Approved contributor pen name (optional)<input value={article.penName} maxLength={80} onChange={(event) => update('penName', event.target.value)} /></label>
        <label className="cc-check-label"><input type="checkbox" checked={article.bylineConsent} onChange={(event) => update('bylineConsent', event.target.checked)} /> The contributor consented to this exact pen name.</label>
        <div className="cc-host-actions"><button type="button" disabled={busy || !['draft', 'changes_requested'].includes(status)} onClick={save}>Save private draft</button>{id && qualifiedReviewer && <button type="button" disabled={busy || reviewed || !['draft', 'changes_requested'].includes(status)} onClick={() => act('review', 'Qualified review recorded for this revision.')}>Sign off as qualified reviewer</button>}{id && role === 'owner' && <><button type="button" disabled={busy || !['draft', 'changes_requested'].includes(status)} onClick={() => act('approve', 'Owner approved this revision.')}>Approve revision</button><button type="button" disabled={busy || status !== 'approved'} onClick={() => act('publish', 'Pull request prepared.')}>Prepare draft PR</button><button type="button" disabled={busy || !['draft', 'approved'].includes(status)} onClick={() => act('request-changes', 'Changes requested.')}>Request changes</button><button type="button" disabled={busy || status === 'pr_open'} onClick={() => { if (window.confirm('Delete this private draft and its revision history?')) act('delete', 'Private draft deleted.') }}>Delete draft</button></>}</div>
      </section><section><h2>Import from ChatGPT</h2><p>Paste a draft using Markdown headings. Import fills the form; it never approves or publishes.</p><textarea rows={8} value={importText} maxLength={20_000} onChange={(event) => setImportText(event.target.value)} placeholder="# Title\n## First section\nDraft text..." /><button type="button" disabled={busy} onClick={importDraft}>Import into form</button></section></div>
    </div>
  </div>
}
