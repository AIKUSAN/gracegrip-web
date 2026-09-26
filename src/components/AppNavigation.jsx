/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { DynamicLogo } from '@/components/ui/DynamicLogo'
import { usePathname } from 'next/navigation'
import {
  AlertTriangle,
  BookMarked,
  BookOpen,
  Home,
  Monitor,
  Moon,
  PenLine,
  Settings,
  Sun,
  Compass,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/emergency', label: 'Help Now', icon: AlertTriangle, emergency: true },
  { path: '/scripture', label: 'Scripture', icon: BookOpen },
  { path: '/devotional', label: 'Devotional', icon: BookMarked },
  { path: '/journal', label: 'Journal', icon: PenLine },
  { path: '/settings', label: 'Settings', icon: Settings },
]

function NavLinks({ mobile = false, compact = false }) {
  const pathname = usePathname()

  return NAV_ITEMS.map((item) => {
    const Icon = item.icon
    const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)

    return (
      <Link
        key={`${mobile ? 'mobile' : 'desktop'}-${item.path}`}
        href={item.path}
        title={item.label}
        className={`cc-nav-btn${mobile ? ' cc-nav-btn-mobile' : ' cc-nav-btn-desktop'}${compact ? ' cc-nav-btn-compact' : ''}${isActive ? ` cc-nav-btn-active${item.emergency ? ' cc-nav-btn-emergency' : ''}` : ''}`}
      >
        <Icon size={mobile ? 20 : 18} className="cc-nav-icon" />
        <span className={mobile ? 'cc-nav-btn-mobile-label' : 'cc-nav-btn-label'}>{item.label}</span>
      </Link>
    )
  })
}

export function AppNavigation() {
  const [pagesOpen, setPagesOpen] = useState(false)
  const { currentThemePreference, cycleThroughThemes } = useApp()
  const ThemeIcon = { light: Sun, dark: Moon, system: Monitor }[currentThemePreference] ?? Monitor
  const nextThemeLabel = useMemo(() => {
    if (currentThemePreference === 'light') return 'dark'
    if (currentThemePreference === 'dark') return 'system'
    return 'light'
  }, [currentThemePreference])

  return (
    <>
      <header className="cc-desktop-top-nav" aria-label="Primary navigation">
        <div className="cc-desktop-top-nav-brand">
          <Link className="cc-top-nav-brand-link" href="/" aria-label="Go to home">
            <DynamicLogo size={34} className="cc-top-nav-logo-mark" />
            <span className="cc-top-nav-brand-text">GraceGrip</span>
          </Link>
        </div>

        <nav className="cc-desktop-top-nav-links" aria-label="Desktop primary">
          <NavLinks compact />
        </nav>

        <div className="cc-desktop-top-nav-actions">
          <button
            className="theme-cycle-btn"
            onClick={cycleThroughThemes}
            aria-label={`Theme: ${currentThemePreference}. Switch to ${nextThemeLabel}.`}
            title={`Theme: ${currentThemePreference}. Next: ${nextThemeLabel}`}
          >
            <ThemeIcon size={18} />
          </button>
        </div>
      </header>

      <header className="cc-mobile-top-brand" aria-label="Mobile header">
        <div className="cc-mobile-top-brand-inner">
          <div className="cc-mobile-top-brand-lockup">
            <DynamicLogo size={24} className="mobile-top-logo-mark" />
            <span className="cc-mobile-top-brand-text">GraceGrip</span>
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={cycleThroughThemes}
            aria-label={`Theme: ${currentThemePreference}. Switch to ${nextThemeLabel}.`}
            title={`Theme: ${currentThemePreference}. Next: ${nextThemeLabel}`}
          >
            <ThemeIcon size={14} />
          </button>
        </div>
      </header>

      <nav className="cc-mobile-nav" aria-label="Mobile Primary">
        <NavLinks mobile />
      </nav>
      <div className="cc-pages-control">
        {pagesOpen && <nav id="cc-pages-menu" className="cc-pages-menu" aria-label="More pages">
          <Link href="/focus" onClick={() => setPagesOpen(false)}>Choose a focus</Link>
          <Link href="/progress" onClick={() => setPagesOpen(false)}>My progress</Link>
          <Link href="/resources" onClick={() => setPagesOpen(false)}>Resources</Link>
          <Link href="/account" onClick={() => setPagesOpen(false)}>Private membership</Link>
          <Link href="/community" onClick={() => setPagesOpen(false)}>Community sessions</Link>
          <Link href="/helper" onClick={() => setPagesOpen(false)}>Reflection helper</Link>
        </nav>}
        <button type="button" className="cc-pages-button" aria-label="Pages" aria-expanded={pagesOpen} aria-controls="cc-pages-menu" onClick={() => setPagesOpen((open) => !open)}><Compass size={18} aria-hidden="true" /> Pages</button>
      </div>
    </>
  )
}
