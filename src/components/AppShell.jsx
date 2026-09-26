/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { AppNavigation } from './AppNavigation'
import { PanicModal } from './PanicModal'

export default function AppShell({ children }) {
  const {
    stateLoaded,
    panicActive,
    panicVerse,
    panicMode,
    secondsLeft,
    formatTime,
    setPanicActive,
    setSecondsLeft,
  } = useApp()

  // Wait for async localStorage decryption before rendering any user data.
  if (!stateLoaded) return null

  return (
    <div className="page-shell">
      <div className="app-layout app-layout-topnav">
        <AppNavigation />

        <div className="app-content app-content-topnav">
          <main>{children}</main>
        </div>

        <footer className="footer">
          <p className="footer-legal">
            Self-guided support with optional spiritual encouragement, not medical care.
            In immediate danger, contact local emergency services.
          </p>

          <div className="footer-support">
            <p className="footer-support-heading">If GraceGrip has helped you, consider supporting:</p>
            <div className="footer-support-links">
              <a
                href="https://ko-fi.com/aikusan"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-support-link"
              >
                <img src="/kofi_logo.svg" alt="Support on Ko-fi" className="support-logo kofi-logo" />
              </a>
              <a
                href="https://buymeacoffee.com/aikusan"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-support-link"
              >
                <img src="/bmc-button.svg" alt="Buy Me a Coffee" className="support-logo bmc-logo" />
              </a>
            </div>
          </div>

          <p className="footer-copyright">
            © 2026 GraceGrip. Built for Freedom.
          </p>
        </footer>
      </div>

      {panicActive && (
        <PanicModal
          panicVerse={panicVerse}
          panicMode={panicMode}
          secondsLabel={formatTime(secondsLeft)}
          onRestart={() => setSecondsLeft(180)}
          onClose={() => setPanicActive(false)}
        />
      )}
    </div>
  )
}
