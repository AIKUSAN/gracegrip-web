'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { classifyHelperInput, filterHelperOutput, HELPER_SYSTEM } from '@/lib/helperSafety'

async function helperRequest(action, method = 'GET', body) {
  const response = await fetch(`/api/helper/${action}`, {
    method, credentials: 'same-origin', cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error ?? 'The helper is unavailable.')
  return data
}

export function HelperPage() {
  const engine = useRef(null)
  const [config, setConfig] = useState(null)
  const [mode, setMode] = useState('local')
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState('')
  const [input, setInput] = useState('')
  const [answer, setAnswer] = useState('')
  const [answerRoute, setAnswerRoute] = useState('')
  const [category, setCategory] = useState('unsafe')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    helperRequest('config').then((result) => { if (active) setConfig(result) }).catch((issue) => { if (active) setError(issue.message) })
    return () => { active = false; if (engine.current) void engine.current.unload().catch(() => {}) }
  }, [])

  const loadModel = async () => {
    if (!config?.local) return
    setBusy(true); setError(''); setProgress('Checking this device…')
    try {
      if (!navigator.gpu || !(await navigator.gpu.requestAdapter())) throw new Error('This device does not provide a compatible WebGPU adapter.')
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm')
      const local = config.local
      engine.current = await CreateMLCEngine(local.modelId, {
        appConfig: { model_list: [{ model: local.modelUrl, model_id: local.modelId, model_lib: local.libraryUrl,
          vram_required_MB: 376, low_resource_required: true, required_features: ['shader-f16'],
          overrides: { context_window_size: 1024 } }], cacheBackend: 'cache' },
        initProgressCallback: (update) => setProgress(update.text ?? 'Loading the on-device model…'),
      })
      setLoaded(true); setProgress('Model ready on this device. Your reflection stays here in local mode.')
    } catch {
      setError('This device could not load the local model. Use the fixed Help Now tools, or choose the separate cloud option if available.')
      setProgress('')
    } finally { setBusy(false) }
  }

  const reflect = async () => {
    setError(''); setNotice(''); setAnswer('')
    const classified = classifyHelperInput(input)
    if (classified.kind === 'invalid') { setError('Write a short reflection of 4 to 600 characters.'); return }
    if (classified.kind !== 'reflection') { setAnswer(classified.answer); setAnswerRoute(''); return }
    setBusy(true)
    try {
      if (mode === 'local') {
        if (!engine.current) throw new Error('Load the on-device model first.')
        const result = await engine.current.chat.completions.create({ messages: [
          { role: 'system', content: HELPER_SYSTEM }, { role: 'user', content: classified.text },
        ], max_tokens: 160, temperature: 0.4 })
        setAnswer(filterHelperOutput(result.choices?.[0]?.message?.content))
        setAnswerRoute('local')
      } else {
        const result = await helperRequest('reflection', 'POST', { text: classified.text })
        setAnswer(result.answer)
        setAnswerRoute(result.kind === 'reflection' ? 'cloud' : '')
      }
    } catch (issue) { setError(issue.message ?? 'Reflection is unavailable. Help Now remains available.') }
    finally { setBusy(false) }
  }

  const report = async () => {
    setError(''); setNotice('')
    try { await helperRequest('report', 'POST', { route: answerRoute, category }); setNotice('Report category sent without your message or the response text.') }
    catch (issue) { setError(issue.message) }
  }

  return <div className="v2-page v2-helper">
    <header className="v2-intro"><h1>A little room to reflect</h1><p>An optional AI companion for one question at a time. It is not a person, therapist, crisis service, or source of medical advice. Prayer and Scripture are always your choice.</p></header>
    <aside className="v2-note"><h2>If safety is urgent</h2><p>For overdose, withdrawal, threats, abuse, or immediate danger, use the fixed safety choices instead of this helper.</p><Link href="/emergency">Open Help Now</Link></aside>
    {error && <p role="alert" className="v2-account-error">{error}</p>}
    {notice && <p role="status" className="v2-account-notice">{notice}</p>}
    <div className="v2-helper-grid"><section><h2>Choose how it runs</h2><fieldset><legend>Reflection mode</legend><label><input type="radio" name="helper-mode" checked={mode === 'local'} onChange={() => setMode('local')} /> On this device</label><p>Uses your device hardware after an explicit download. Your reflection is not sent to the model server.</p><label><input type="radio" name="helper-mode" checked={mode === 'cloud'} onChange={() => setMode('cloud')} /> Cloudflare fallback</label><p>Sends one prompt to Workers AI. Limited to three requests per day per network connection and 40 total requests per day. GraceGrip does not store prompt or response text.</p></fieldset>
      {mode === 'local' && <div>{config?.local ? <><p>Download size: about {config.local.downloadMB} MB. The model needs roughly 376 MB of GPU memory plus browser overhead. Cellular data and storage may be affected.</p><button type="button" onClick={loadModel} disabled={busy || loaded}>{loaded ? 'Model ready' : 'Download and load model'}</button></> : <p>The on-device model is not configured in this preview.</p>}{progress && <p role="status">{progress}</p>}</div>}
      {mode === 'cloud' && !config?.cloudAvailable && <p>Cloud reflection is not configured in this preview. Help Now remains available.</p>}
      <label htmlFor="helper-reflection">What would you like to reflect on?</label><textarea id="helper-reflection" rows={5} maxLength={600} value={input} onChange={(event) => setInput(event.target.value)} placeholder="You can describe a feeling or a next choice. Avoid names and identifying details." /><p>{input.length} / 600 · Nothing is saved to your journal automatically.</p>
      <button type="button" className="v2-action" disabled={busy || (mode === 'local' ? !loaded : !config?.cloudAvailable)} onClick={reflect}>Reflect with helper</button></section>
      <section><h2>Response</h2>{answer ? <><p className="v2-helper-answer" aria-live="polite">{answer}</p><p>AI responses can be wrong. You can stop anytime and use the reviewed tools.</p>{answerRoute && <div><label htmlFor="helper-report">Report this response</label><select id="helper-report" value={category} onChange={(event) => setCategory(event.target.value)}><option value="unsafe">Unsafe</option><option value="inaccurate">Inaccurate</option><option value="unhelpful">Unhelpful</option><option value="other">Other</option></select><button type="button" onClick={report}>Send category only</button></div>}</> : <p>Your response will appear here. This page does not keep a chat history.</p>}<Link href="/emergency">Return to Help Now →</Link></section></div>
  </div>
}
