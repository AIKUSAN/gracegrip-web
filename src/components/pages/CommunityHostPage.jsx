'use client'

import { useEffect, useState } from 'react'

async function ownerRequest(action, method = 'GET', body) {
  const response = await fetch(`/api/community/owner/${action}`, { method, credentials: 'same-origin', cache: 'no-store', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error ?? 'Owner controls are unavailable.')
  return data
}

export function CommunityHostPage() {
  const [queue, setQueue] = useState({ posts: [], aliases: [], reports: [] })
  const [hosting, setHosting] = useState(false)
  const [nextSession, setNextSession] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = async () => setQueue(await ownerRequest('queue'))
  useEffect(() => {
    let active = true
    ownerRequest('queue').then((data) => { if (active) setQueue(data) }).catch((issue) => { if (active) setError(issue.message) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!hosting) return undefined
    const timer = window.setInterval(() => {
      ownerRequest('heartbeat', 'POST').catch((issue) => { setError(issue.message); setHosting(false) })
      refresh().catch(() => {})
    }, 45_000)
    return () => window.clearInterval(timer)
  }, [hosting])

  const run = async (work) => {
    setBusy(true); setError(''); setNotice('')
    try { await work(); await refresh() } catch (issue) { setError(issue.message || 'Please try again.') }
    finally { setBusy(false) }
  }

  const start = () => run(async () => {
    await ownerRequest('heartbeat', 'POST')
    setHosting(true)
    setNotice('Session open. Leave this page open to keep your hosting lease active.')
  })
  const close = () => run(async () => {
    setHosting(false)
    await ownerRequest('close', 'POST')
    setNotice('Room is read-only.')
  })

  return <div className="v2-page v2-host">
    <header className="v2-intro"><h1>Host the room</h1><p>Human review controls. This page and its API require Cloudflare Access; every action is checked on the server.</p></header>
    {error && <p role="alert" className="v2-account-error">{error}</p>}
    {notice && <p role="status" className="v2-account-notice">{notice}</p>}
    <section className="v2-host-controls"><h2>Session</h2><p>{hosting ? 'Hosting lease active; refreshed every 45 seconds.' : 'Room is read-only unless a hosted lease is active.'}</p><div className="v2-host-actions"><button type="button" disabled={busy || hosting} onClick={start}>Open hosted session</button><button type="button" disabled={busy} onClick={close}>Close session</button><button type="button" disabled={busy} onClick={() => run(async () => { setHosting(false); await ownerRequest('shutdown', 'POST'); setNotice('Emergency shutdown is on.') })}>Emergency shutdown</button><button type="button" disabled={busy} onClick={() => run(async () => { await ownerRequest('enable', 'POST'); setNotice('Shutdown cleared. The room remains read-only until you open a session.') })}>Clear shutdown</button></div><label>Next planned session<input type="datetime-local" value={nextSession} onChange={(event) => setNextSession(event.target.value)} /></label><button type="button" disabled={busy} onClick={() => run(async () => { await ownerRequest('schedule', 'POST', { nextSessionAt: nextSession ? new Date(nextSession).toISOString() : null }); setNotice('Session schedule updated.') })}>Save schedule</button></section>
    <section><h2>Posts awaiting review</h2>{queue.posts.length === 0 && <p>No pending posts.</p>}<ul className="v2-host-list">{queue.posts.map((post) => <li key={post.id}><p><strong>{post.alias}</strong> · {new Date(post.submitted_at).toLocaleString()}</p><p>{post.body}</p>{post.ai_flag && <p>AI flag: {post.ai_flag}. Review this yourself.</p>}<div className="v2-host-actions"><button type="button" disabled={busy || !hosting} onClick={() => run(async () => { await ownerRequest('approve', 'POST', { postId: post.id }); setNotice('Post approved.') })}>Approve and publish</button><button type="button" disabled={busy} onClick={() => run(async () => { await ownerRequest('reject', 'POST', { postId: post.id }); setNotice('Post rejected.') })}>Reject</button><button type="button" disabled={busy} onClick={() => run(async () => { if (window.confirm('Remove this member and hide their posts?')) await ownerRequest('remove', 'POST', { memberId: post.member_id }) })}>Remove member</button></div></li>)}</ul></section>
    <section><h2>Alias requests</h2>{queue.aliases.length === 0 && <p>No alias requests.</p>}<ul className="v2-host-list">{queue.aliases.map((item) => <li key={item.id}><p>{item.current_alias} → <strong>{item.requested_alias}</strong></p><div className="v2-host-actions"><button type="button" disabled={busy} onClick={() => run(async () => { await ownerRequest('approve-alias', 'POST', { requestId: item.id }) })}>Approve alias</button><button type="button" disabled={busy} onClick={() => run(async () => { await ownerRequest('reject-alias', 'POST', { requestId: item.id }) })}>Reject alias</button></div></li>)}</ul></section>
    <section><h2>Reports and incident evidence</h2><p>Evidence is kept separately for up to 90 days. Review promptly; urgent danger needs local emergency services.</p>{queue.reports.length === 0 && <p>No retained reports.</p>}<ul className="v2-host-list">{queue.reports.map((report) => <li key={report.id}><p><strong>{report.reason}</strong> · {new Date(report.created_at).toLocaleString()}</p><p>{report.body_snapshot}</p>{report.reported_member_id && <button type="button" disabled={busy} onClick={() => run(async () => { if (window.confirm('Remove the reported member and hide their posts?')) await ownerRequest('remove', 'POST', { memberId: report.reported_member_id }) })}>Remove reported member</button>}</li>)}</ul></section>
  </div>
}
