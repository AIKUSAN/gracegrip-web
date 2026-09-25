'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function UnsubscribePage() {
  const [token, setToken] = useState('')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let active = true
    queueMicrotask(() => {
      if (!active) return
      setToken(window.location.hash.slice(1))
      window.history.replaceState(null, '', '/unsubscribe')
    })
    return () => { active = false }
  }, [])
  const unsubscribe = async () => {
    setBusy(true); setStatus('')
    try {
      const response = await fetch('/api/account/article-unsubscribe', { method: 'POST', credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
      if (!response.ok) throw new Error('This link is invalid or the email service is unavailable.')
      setToken(''); setStatus('Article emails are off. Your account and community membership remain.')
    } catch (issue) { setStatus(issue.message) }
    finally { setBusy(false) }
  }
  return <div className="v2-page"><header className="v2-intro"><h1>Article email preference</h1><p>Article emails are optional and separate from account recovery and community membership.</p></header><section className="v2-note"><p role="status">{status || (token ? 'Ready to unsubscribe.' : 'Open the link from a GraceGrip article email, or sign in to change your choice.')}</p>{token && <button type="button" className="v2-action" disabled={busy} onClick={unsubscribe}>Unsubscribe from article emails</button>}<p><Link href="/account">Open private membership</Link></p></section></div>
}
