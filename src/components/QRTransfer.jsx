/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import QRCode from 'qrcode'
import { strToU8, deflateSync, inflateSync, strFromU8 } from 'fflate'
import { exportStateAsJson } from '@/utils/storage'

const MAX_QR_CHARS = 2500
const FIELDS = [
  { key: 'journal', label: 'Journal entries' },
  { key: 'streak', label: 'Streak & progress' },
  { key: 'favorites', label: 'Favorite verses' },
  { key: 'settings', label: 'Settings & profile' },
]

function compress(jsonStr) {
  const compressed = deflateSync(strToU8(jsonStr))
  let binary = ''
  for (let i = 0; i < compressed.length; i++) binary += String.fromCharCode(compressed[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function decompress(text) {
  try {
    const padded = text + '='.repeat((4 - (text.length % 4)) % 4)
    const b64 = padded.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(b64)
    const u8 = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) u8[i] = binary.charCodeAt(i)
    return strFromU8(inflateSync(u8))
  } catch {
    return text // fallback: raw JSON
  }
}

export function QRTransfer({ appState, onQRImport }) {
  const [tab, setTab] = useState('generate')
  const [selections, setSelections] = useState({
    journal: false, streak: true, favorites: true, settings: true,
  })
  const [qrRenderError, setQrRenderError] = useState(null)
  const [scanStatus, setScanStatus] = useState('idle')
  const [scanMsg, setScanMsg] = useState('')
  const canvasRef = useRef(null)
  const scannerRef = useRef(null)
  const onQRImportRef = useRef(onQRImport)

  // Derived — no setState needed
  const encoded = useMemo(() => {
    if (tab !== 'generate') return ''
    return compress(exportStateAsJson(appState, selections))
  }, [appState, selections, tab])
  const tooBig = tab === 'generate' && encoded.length > MAX_QR_CHARS
  const qrWarning = tooBig
    ? 'Payload too large. Uncheck Journal entries to fit within a QR code.'
    : qrRenderError

  // Keep callback ref up to date without restarting the scanner
  useEffect(() => { onQRImportRef.current = onQRImport }, [onQRImport])

  // Render QR canvas whenever the encoded payload changes
  useEffect(() => {
    if (tab !== 'generate' || tooBig || !encoded || !canvasRef.current) return
    setQrRenderError(null)
    QRCode.toCanvas(canvasRef.current, encoded, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' },
    }).catch(() => setQrRenderError('Failed to render QR code.'))
  }, [encoded, tab, tooBig])

  // Start / stop camera scanner
  useEffect(() => {
    if (tab !== 'scan') {
      scannerRef.current?.clear().catch(() => {})
      scannerRef.current = null
      return
    }

    let cancelled = false
    import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
      if (cancelled || scannerRef.current) return
      const scanner = new Html5QrcodeScanner(
        'qr-scan-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose */ false,
      )
      scanner.render(
        (decodedText) => {
          scanner.clear().catch(() => {})
          scannerRef.current = null
          try {
            onQRImportRef.current(decompress(decodedText))
            setScanStatus('success')
            setScanMsg('Data transferred! The import has been applied.')
          } catch {
            setScanStatus('error')
            setScanMsg('Could not read QR data. Try regenerating the code.')
          }
        },
        () => { /* ignore per-frame decode errors */ },
      )
      scannerRef.current = scanner
    })

    return () => {
      cancelled = true
      scannerRef.current?.clear().catch(() => {})
      scannerRef.current = null
    }
  }, [tab])

  const toggleSel = (key) => setSelections((prev) => ({ ...prev, [key]: !prev[key] }))
  const switchTab = (next) => {
    if (next !== 'scan') { setScanStatus('idle'); setScanMsg('') }
    setTab(next)
  }

  return (
    <div className="qr-transfer">
      <div className="qr-tabs">
        <button
          className={`qr-tab${tab === 'generate' ? ' qr-tab--active' : ''}`}
          onClick={() => switchTab('generate')}
        >
          Generate QR
        </button>
        <button
          className={`qr-tab${tab === 'scan' ? ' qr-tab--active' : ''}`}
          onClick={() => switchTab('scan')}
        >
          Scan QR
        </button>
      </div>

      {tab === 'generate' && (
        <div className="qr-generate">
          <p className="muted mb-3">
            Choose what to include, then scan this code on your other device.
          </p>
          <div className="backup-selections mb-3">
            {FIELDS.map(({ key, label }) => (
              <label key={key} className="backup-selection-item">
                <input
                  type="checkbox"
                  checked={!!selections[key]}
                  onChange={() => toggleSel(key)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {qrWarning && <p className="qr-warning">{qrWarning}</p>}
          <canvas
            ref={canvasRef}
            className={`qr-canvas${tooBig ? ' qr-canvas--hidden' : ''}`}
          />
        </div>
      )}

      {tab === 'scan' && (
        <div className="qr-scan">
          {scanStatus === 'success' && <p className="qr-success">{scanMsg}</p>}
          {scanStatus === 'error' && <p className="qr-warning">{scanMsg}</p>}
          {scanStatus === 'idle' && (
            <p className="muted mb-3">
              Point your camera at the QR code shown on the other device.
            </p>
          )}
          <div
            id="qr-scan-reader"
            className={scanStatus !== 'idle' ? 'hidden-input' : ''}
          />
        </div>
      )}
    </div>
  )
}
