// © 2026 GraceGrip | Built for Freedom | MIT License
'use client'

import { Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { AppNavigation } from './AppNavigation'
import { WelcomeScreen } from './WelcomeScreen'
import { PanicModal } from './PanicModal'

export default function AppShell({ children }) {
  const {
    appState,
    stateLoaded,
    panicActive,
    panicVerse,
    panicMode,
    secondsLeft,
    formatTime,
    setPanicActive,
    setSecondsLeft,
    currentThemePreference,
    onThemeChange,
    cycleThroughThemes,
    welcomeName,
    setWelcomeName,
    onBeginJourney,
  } = useApp()

  // Wait for async localStorage decryption before rendering any user data.
  if (!stateLoaded) return null

  if (!appState.onboardingComplete) {
    return (
      <WelcomeScreen
        currentThemePreference={currentThemePreference}
        onThemeChange={onThemeChange}
        cycleThroughThemes={cycleThroughThemes}
        welcomeName={welcomeName}
        onWelcomeNameChange={setWelcomeName}
        onBeginJourney={onBeginJourney}
      />
    )
  }

  return (
    <div className="page-shell">
      <div className="app-layout app-layout-topnav">
        <AppNavigation />

        <div className="app-content app-content-topnav">
          <main>{children}</main>

          <footer className="footer">
            <p>
              GraceGrip is peer support and spiritual encouragement, not professional mental health
              care. If you are in immediate danger, contact local emergency services.
            </p>
            <p>Beta note: features and content will continue to evolve.</p>

            <div className="footer-support">
              <p className="footer-support-heading">IF YOU FIND THIS PROJECT MISSION HELPFUL, YOU CAN SUPPORT DOWN BELLOW</p>
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
              © 2026 GraceGrip. Built for Freedom. Open-source under the MIT License.
            </p>
          </footer>
        </div>
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
