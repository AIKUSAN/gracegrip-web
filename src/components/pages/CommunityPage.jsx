'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AVATARS, avatarPath } from '@/content/avatars'
import { COMMUNITY_RULES_VERSION } from '@/lib/communityPolicy'

async function request(action, method = 'GET', body) {
  const response = await fetch(`/api/community/${action}`, { method, credentials: 'same-origin', cache: 'no-store', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error ?? 'Community is unavailable.')
  return data
}

function CommunityPost({ post, onRefresh, onNotice, onError }) {
  const [reason, setReason] = useState('harm')
  const run = async (action, body) => {
    try {
      await request(action, 'POST', body)
      onNotice(action === 'report' ? 'Report sent to the owner.' : 'Member blocked. Their posts are hidden for you.')
      if (action === 'block') await onRefresh()
    } catch (issue) { onError(issue.message) }
  }
  return <li className="cc-community-post">
    <div className="cc-community-post-head"><img src={avatarPath(post.avatarId)} alt="" width="40" height="40" /><strong>{post.alias}</strong><time dateTime={post.at}>{new Date(post.at).toLocaleString()}</time></div>
    <p>{post.body}</p>
    <div className="cc-community-post-actions"><label>Report reason<select value={reason} onChange={(event) => setReason(event.target.value)}><option value="harm">Harmful content</option><option value="harassment">Harassment</option><option value="privacy">Privacy concern</option><option value="other">Other</option></select></label><button type="button" onClick={() => run('report', { postId: post.id, reason })}>Report</button><button type="button" onClick={() => run('block', { memberId: post.senderId })}>Block member</button></div>
  </li>
}

export function CommunityPage() {
  const [availability, setAvailability] = useState(null)
  const [member, setMember] = useState(null)
  const [messages, setMessages] = useState([])
  const [avatarId, setAvatarId] = useState(AVATARS[0])
  const [acceptRules, setAcceptRules] = useState(false)
  const [aliasInput, setAliasInput] = useState('')
  const [postInput, setPostInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const refreshMessages = async () => { const data = await request('messages'); setMessages(data.messages) }

  useEffect(() => {
    let active = true
    Promise.all([request('status'), request('me')]).then(([status, me]) => {
      if (active) { setAvailability(status); setMember(me) }
    }).catch((issue) => { if (active) setError(issue.message) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!member?.joined) return undefined
    let active = true
    request('messages').then((data) => { if (active) setMessages(data.messages) }).catch(() => {})
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const socket = new WebSocket(`${protocol}//${window.location.host}/api/community/socket`)
    socket.onmessage = (event) => {
      let update
      try { update = JSON.parse(event.data) } catch { return }
      if (update.type === 'status' && active) setAvailability((current) => ({ ...current, open: update.open === true, shutdown: update.shutdown === true }))
      if (update.type === 'post-available' && active) request('messages').then((data) => { if (active) setMessages(data.messages) }).catch(() => {})
    }
    return () => { active = false; socket.close() }
  }, [member?.joined])

  const run = async (work) => {
    setBusy(true); setError(''); setNotice('')
    try { await work() } catch (issue) { setError(issue.message || 'Please try again.') }
    finally { setBusy(false) }
  }

  const join = () => run(async () => {
    const data = await request('join', 'POST', { acceptRules, rulesVersion: COMMUNITY_RULES_VERSION, avatarId })
    setMember({ joined: true, memberId: data.memberId, alias: data.alias, avatarId: data.avatarId })
    setNotice('You joined with a private alias. Posting opens only during owner-hosted sessions.')
  })

  const post = () => run(async () => {
    await request('post', 'POST', { body: postInput })
    setPostInput('')
    setNotice('Sent to the owner for review. It is not visible to others yet.')
  })

  const leave = () => run(async () => {
    if (!window.confirm('Leave the community and remove your profile and posts? Your account and device data will remain.')) return
    await request('leave', 'POST')
    setMember({ joined: false }); setMessages([])
    setNotice('You left the community. Separately retained incident evidence may remain for up to 90 days.')
  })

  const requestAlias = () => run(async () => {
    await request('alias', 'POST', { alias: aliasInput })
    setAliasInput('')
    setNotice('Alias request sent to the owner. Your current alias remains until approval.')
  })

  return <div className="cc-page cc-community">
    <header className="cc-intro"><h1>Community sessions</h1><p>One text room for conversation and prayer, hosted by a person. The room is read-only when the owner is away. It is not an urgent-help service.</p></header>
    <div className="cc-community-status"><strong>{availability?.open ? 'A hosted session is open' : 'Room is read-only'}</strong><span>{availability?.nextSessionAt ? `Next planned session: ${new Date(availability.nextSessionAt).toLocaleString()}` : 'No next session is scheduled yet.'}</span></div>
    {error && <p role="alert" className="cc-account-error">{error}</p>}
    {notice && <p role="status" className="cc-account-notice">{notice}</p>}
    {!member?.joined && <section className="cc-community-join"><h2>Join by choice</h2><p>Membership uses a passkey. Other members see only an alias and avatar you choose, not your account, email, goals, or journal.</p>
      <fieldset><legend>Choose an avatar</legend><div className="cc-avatar-grid">{AVATARS.map((id) => <label key={id} className={avatarId === id ? 'selected' : ''}><input type="radio" name="avatar" value={id} checked={avatarId === id} onChange={() => setAvatarId(id)} /><img src={avatarPath(id)} alt="" width="52" height="52" /><span>{id}</span></label>)}</div></fieldset>
      <div className="cc-room-rules"><h3>Room rules</h3><ul><li>Share only what you choose; respect privacy and differences.</li><li>No threats, abuse, sexual content, direct messages, media, or outbound links.</li><li>Human approval is required before a post appears. Reports go to the owner.</li><li>Chat text is kept for 30 days; incident evidence can be kept for 90 days.</li></ul></div>
      <label className="cc-check-label"><input type="checkbox" checked={acceptRules} onChange={(event) => setAcceptRules(event.target.checked)} /> I accept these rules and understand the room is not monitored for urgent help.</label>
      <button type="button" className="cc-action" disabled={busy || !acceptRules} onClick={join}>Join community</button><p>Need a passkey first? <Link href="/account">Open private membership</Link>.</p>
    </section>}
    {member?.joined && <div className="cc-community-columns"><section><h2>Room conversation</h2><p>Only owner-approved posts appear here. You can report or block any member.</p><ol className="cc-community-posts">{messages.map((message) => <CommunityPost key={message.id} post={message} onRefresh={refreshMessages} onNotice={setNotice} onError={setError} />)}</ol>{messages.length === 0 && <p>No approved posts in the last 30 days.</p>}
      {availability?.open ? <div className="cc-community-compose"><label htmlFor="room-message">Share a short message or prayer request</label><textarea id="room-message" value={postInput} maxLength={700} rows={4} onChange={(event) => setPostInput(event.target.value)} placeholder="Your post will be reviewed before others see it." /><p>{postInput.length} / 700 · Text only. No links or contact details.</p><button type="button" className="cc-action" disabled={busy || !postInput.trim()} onClick={post}>Send for owner review</button></div> : <p className="cc-note">The owner is away. You can read approved posts; new posts wait for the next hosted session.</p>}</section>
      <aside><h2>Your community identity</h2><img src={avatarPath(member.avatarId)} alt="Your chosen avatar" width="72" height="72" /><p><strong>{member.alias}</strong> is what other members see.</p><label>Request a display alias<input value={aliasInput} maxLength={24} onChange={(event) => setAliasInput(event.target.value)} /></label><button type="button" disabled={busy || aliasInput.trim().length < 3} onClick={requestAlias}>Ask owner to approve alias</button><hr /><button type="button" onClick={leave} disabled={busy}>Leave community and remove posts</button></aside></div>}
    <aside className="cc-note"><h2>Need help now?</h2><p>This room is not a crisis service. Help Now gives immediate safety choices and private tools.</p><Link href="/emergency">Open Help Now</Link></aside>
  </div>
}
