'use client'

import { useEffect, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { useApp } from '@/context/AppContext'
import { FOCUS_AREAS } from '@/content/focusAreas'
import { PRACTICE_EMBLEMS } from '@/utils/progress'

async function accountRequest(action, method = 'GET', body) {
  const response = await fetch(`/api/account/${action}`, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error ?? 'Membership is unavailable.')
  return payload
}

export function AccountPage() {
  const { appState, onImportSyncedProgress } = useApp()
  const [session, setSession] = useState(null)
  const [remote, setRemote] = useState(null)
  const [selected, setSelected] = useState([])
  const [confirmedSync, setConfirmedSync] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState([])
  const [recoveryInput, setRecoveryInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [deletePhrase, setDeletePhrase] = useState('')
  const [adultConfirmed, setAdultConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    accountRequest('session').then((result) => { if (active) setSession(result) }).catch((issue) => { if (active) setError(issue.message) })
    return () => { active = false }
  }, [])

  const run = async (work) => {
    setBusy(true); setError(''); setNotice('')
    try { await work() } catch (issue) { setError(issue.message || 'Please try again.') }
    finally { setBusy(false) }
  }

  const refreshSession = async () => setSession(await accountRequest('session'))
  const loadRemote = async () => setRemote(await accountRequest('sync'))

  const createPasskey = () => run(async () => {
    const { options } = await accountRequest('register-options', 'POST')
    const credential = await startRegistration({ optionsJSON: options })
    const result = await accountRequest('register-verify', 'POST', { credential, adultConfirmed })
    if (result.recoveryCodes) setRecoveryCodes(result.recoveryCodes)
    await refreshSession()
    setNotice(result.addedPasskey ? 'Passkey added.' : 'Membership created. Save your recovery codes now; they are shown only once.')
  })

  const signIn = () => run(async () => {
    const { options } = await accountRequest('login-options', 'POST')
    const credential = await startAuthentication({ optionsJSON: options })
    await accountRequest('login-verify', 'POST', { credential })
    await refreshSession()
    setNotice('Signed in. Nothing on this device was uploaded or replaced.')
  })

  const recover = () => run(async () => {
    await accountRequest('recover', 'POST', { code: recoveryInput.trim() })
    setRecoveryInput('')
    await refreshSession()
    setNotice('Recovery code used. Add a new passkey soon.')
  })

  const emailStart = () => run(async () => {
    await accountRequest('email-start', 'POST', { email: emailInput })
    setNotice('If the email service accepted the request, a one-use verification code is on its way.')
  })

  const emailVerify = () => run(async () => {
    await accountRequest('email-verify', 'POST', { code: emailCode.trim() })
    setEmailCode(''); await refreshSession()
    setNotice('Private email verified. Article updates remain off until you opt in separately.')
  })

  const emailRecoverStart = () => run(async () => {
    await accountRequest('email-recover-start', 'POST', { email: emailInput })
    setNotice('If this address is verified on an account, a one-use recovery code is on its way.')
  })

  const emailRecoverVerify = () => run(async () => {
    await accountRequest('email-recover-verify', 'POST', { code: emailCode.trim() })
    setEmailCode(''); await refreshSession()
    setNotice('Signed in with a one-use email code. Add a passkey soon.')
  })

  const articlePreference = (optIn) => run(async () => {
    await accountRequest('article-preference', 'POST', { optIn })
    await refreshSession()
    setNotice(optIn ? 'Article emails are on. You can turn them off independently anytime.' : 'Article emails are off. Your account and community membership remain.')
  })

  const emailRemove = () => run(async () => {
    if (!window.confirm('Remove your verified email? Email recovery and article notices will stop.')) return
    await accountRequest('email-remove', 'POST')
    await refreshSession()
    setNotice('Private email removed. Passkeys and recovery codes remain available.')
  })

  const upload = () => run(async () => {
    if (!confirmedSync || selected.length === 0) throw new Error('Choose at least one goal and confirm the upload.')
    const chosen = new Set(selected)
    const goals = (appState.goals ?? []).filter((goal) => chosen.has(goal.focusId))
    const goalCheckins = (appState.goalCheckins ?? []).filter((entry) => chosen.has(entry.focusId))
    const emblems = (appState.emblems ?? []).filter((id) => PRACTICE_EMBLEMS.includes(id) || (id.startsWith('days:') && chosen.has(id.split(':')[2])))
    const result = await accountRequest('sync', 'PUT', {
      confirmSync: true, baseRevision: remote?.revision ?? session?.syncRevision ?? 0,
      selectedFocusIds: selected, goals, goalCheckins, emblems,
    })
    setConfirmedSync(false)
    await loadRemote()
    setNotice(`${result.syncedFocusCount} chosen ${result.syncedFocusCount === 1 ? 'goal' : 'goals'} uploaded. Journal and legacy streak were not sent.`)
  })

  const importRemote = () => run(async () => {
    if (!remote?.progress) throw new Error('No synced copy is available.')
    if (!window.confirm('Merge the selected cloud goals and check-ins into this device? Local entries for those goals will be replaced. Your journal and legacy streak will stay here.')) return
    onImportSyncedProgress(remote.progress)
    setNotice('Selected progress copied to this device. Journal and legacy streak were unchanged.')
  })

  const logout = () => run(async () => {
    await accountRequest('logout', 'POST')
    setSession({ signedIn: false }); setRemote(null); setRecoveryCodes([])
    setNotice('Signed out. Device-local data remains on this device.')
  })

  const deleteAccount = () => run(async () => {
    if (!window.confirm('Delete this account and its synced progress? Device-local data will remain.')) return
    await accountRequest('delete', 'POST', { confirmation: deletePhrase })
    setSession({ signedIn: false }); setRemote(null); setDeletePhrase('')
    setNotice('Account and synced progress deleted. Device-local data remains on this device.')
  })

  return <div className="v2-page v2-account">
    <header className="v2-intro"><h1>Private membership</h1><p>Public help does not need an account. Membership is optional for selected progress sync and, after moderation review, community participation. Your journal stays on this device.</p></header>
    {error && <p className="v2-account-error" role="alert">{error}</p>}
    {notice && <p className="v2-account-notice" role="status">{notice}</p>}
    {session === null && !error && <p role="status">Checking membership availability…</p>}
    {session && !session.signedIn && <div className="v2-account-grid">
      <section><h2>New member</h2><p>Create a passkey. Your browser or password manager may offer a synced passkey; availability depends on your device and settings.</p><label className="v2-check-label"><input type="checkbox" checked={adultConfirmed} onChange={(event) => setAdultConfirmed(event.target.checked)} /> I am 18 or older.</label><button className="v2-action" type="button" disabled={busy || !adultConfirmed} onClick={createPasskey}>Create with a passkey</button></section>
      <section><h2>Already a member</h2><p>Sign in with a passkey to review your synced copy. No device data moves automatically.</p><button className="v2-action" type="button" disabled={busy} onClick={signIn}>Sign in</button></section>
      <section><h2>Use a recovery code</h2><p>Each code works once. Sign in and add a new passkey when you can.</p><label>Recovery code<input autoComplete="off" value={recoveryInput} onChange={(event) => setRecoveryInput(event.target.value)} /></label><button type="button" disabled={busy || !recoveryInput.trim()} onClick={recover}>Use code</button></section>
      <section><h2>Recover with verified email</h2><p>This works only if you added and verified a private email before losing access. Nothing is sent to an unverified address.</p><label>Verified email<input type="email" autoComplete="email" value={emailInput} onChange={(event) => setEmailInput(event.target.value)} /></label><button type="button" disabled={busy || !emailInput.trim()} onClick={emailRecoverStart}>Send one-use code</button><label>Code from email<input autoComplete="off" value={emailCode} onChange={(event) => setEmailCode(event.target.value)} /></label><button type="button" disabled={busy || !emailCode.trim()} onClick={emailRecoverVerify}>Use email code</button></section>
    </div>}
    {session?.signedIn && <div className="v2-account-grid">
      {recoveryCodes.length > 0 && <section className="v2-recovery-codes"><h2>Save these recovery codes</h2><p>Shown once. Each code works once. Keep them in a safe place separate from this device.</p><ul>{recoveryCodes.map((code) => <li key={code}><code>{code}</code></li>)}</ul><button type="button" onClick={() => setRecoveryCodes([])}>I have saved them</button></section>}
      <section><h2>Passkeys</h2><p>Add another passkey while your sign-in is recent. This can help you recover access on a second device.</p><button type="button" disabled={busy} onClick={createPasskey}>Add a passkey</button><button type="button" disabled={busy} onClick={logout}>Sign out</button></section>
      <section><h2>Opt-in progress sync</h2><p>Select only goals you want to copy to your account. Your journal, legacy streak, profile name, puzzle score, and unselected goals are never included.</p>
        {(appState.goals ?? []).length ? (appState.goals ?? []).map((goal) => {
          const area = FOCUS_AREAS.find((item) => item.id === goal.focusId)
          return <label key={goal.focusId} className="v2-check-label"><input type="checkbox" checked={selected.includes(goal.focusId)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, goal.focusId] : current.filter((id) => id !== goal.focusId))} /> {area?.title ?? goal.focusId}</label>
        }) : <p>No device-local goals yet. Choose a focus before syncing.</p>}
        <label className="v2-check-label"><input type="checkbox" checked={confirmedSync} onChange={(event) => setConfirmedSync(event.target.checked)} /> I understand this replaces my previous selected cloud copy.</label>
        <button type="button" disabled={busy || !confirmedSync || selected.length === 0} onClick={upload}>Upload only selected progress</button>
      </section>
      <section><h2>Cloud copy</h2><p>Review the cloud copy before choosing whether to bring it to this device.</p><button type="button" disabled={busy} onClick={() => run(loadRemote)}>Review cloud copy</button>{remote && <div className="v2-cloud-summary"><p>Revision {remote.revision} · {remote.syncedAt ? `Last updated ${new Date(remote.syncedAt).toLocaleDateString()}` : 'No upload yet'}</p><p>{remote.progress?.goals?.length ?? 0} synced goals · {remote.progress?.goalCheckins?.length ?? 0} check-ins</p>{remote.progress && <button type="button" disabled={busy} onClick={importRemote}>Copy selected cloud progress to this device</button>}</div>}</section>
      <section><h2>Private email and article updates</h2><p>A verified email can help you recover your account. It is never shown to community members. The email provider must be configured before codes can be delivered.</p>{session.verifiedEmail && <p>Verified address: <strong>{session.verifiedEmail}</strong></p>}<label>Email address<input type="email" autoComplete="email" value={emailInput} onChange={(event) => setEmailInput(event.target.value)} /></label><button type="button" disabled={busy || !emailInput.trim()} onClick={emailStart}>{session.hasVerifiedEmail ? 'Change verified email' : 'Send verification code'}</button><label>Code from email<input autoComplete="off" value={emailCode} onChange={(event) => setEmailCode(event.target.value)} /></label><button type="button" disabled={busy || !emailCode.trim()} onClick={emailVerify}>Verify address</button>{session.hasVerifiedEmail && <><p>Article notices: <strong>{session.articleEmailOptIn ? 'Chosen' : 'Not chosen'}</strong>. Article sending is held until the publishing service is verified; you can change your choice anytime.</p><button type="button" disabled={busy || session.articleEmailOptIn} onClick={() => articlePreference(true)}>Opt in to article emails</button><button type="button" disabled={busy || !session.articleEmailOptIn} onClick={() => articlePreference(false)}>Unsubscribe from article emails</button><button type="button" disabled={busy} onClick={emailRemove}>Remove private email</button></>}</section>
      <section className="v2-account-delete"><h2>Delete account and synced progress</h2><p>This deletes the account copy. It does not erase your local journal or goals. Sign in again first if your session is not recent.</p><label>Type DELETE MY ACCOUNT<input value={deletePhrase} onChange={(event) => setDeletePhrase(event.target.value)} /></label><button type="button" disabled={busy || deletePhrase !== 'DELETE MY ACCOUNT'} onClick={deleteAccount}>Delete account copy</button></section>
    </div>}
  </div>
}
