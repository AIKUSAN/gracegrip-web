// © 2026 GraceGrip | Built for Freedom | MIT License
'use client'

import Link from 'next/link'
import { useMemo } from 'react'
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
} from 'lucide-react'
import { useApp } from '@/context/AppContext'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/emergency', label: 'Emergency', icon: AlertTriangle, emergency: true },
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
        className={`nav-btn${mobile ? ' nav-btn-mobile' : ' nav-btn-desktop'}${compact ? ' nav-btn-compact' : ''}${isActive ? ` nav-btn-active${item.emergency ? ' nav-btn-emergency' : ''}` : ''}`}
      >
        <Icon size={mobile ? 20 : 18} className="nav-icon" />
        <span className={mobile ? 'nav-btn-mobile-label' : 'nav-btn-label'}>{item.label}</span>
      </Link>
    )
  })
}

export function AppNavigation() {
  const { currentThemePreference, cycleThroughThemes } = useApp()
  const ThemeIcon = { light: Sun, dark: Moon, system: Monitor }[currentThemePreference] ?? Monitor
  const nextThemeLabel = useMemo(() => {
    if (currentThemePreference === 'light') return 'dark'
    if (currentThemePreference === 'dark') return 'system'
    return 'light'
  }, [currentThemePreference])

  return (
    <>
      <header className="desktop-top-nav" aria-label="Primary navigation">
        <div className="desktop-top-nav-brand">
          <Link className="top-nav-brand-link" href="/" aria-label="Go to home">
            <DynamicLogo size={34} className="top-nav-logo-mark" />
            <span className="top-nav-brand-text">GraceGrip</span>
          </Link>
        </div>

        <nav className="desktop-top-nav-links" aria-label="Desktop primary">
          <NavLinks compact />
        </nav>

        <div className="desktop-top-nav-actions">
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

      <header className="mobile-top-brand" aria-label="Mobile header">
        <div className="mobile-top-brand-inner">
          <div className="mobile-top-brand-lockup">
            <DynamicLogo size={24} className="mobile-top-logo-mark" />
            <span className="mobile-top-brand-text">GraceGrip</span>
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

      <nav className="mobile-nav" aria-label="Mobile Primary">
        <NavLinks mobile />
      </nav>
    </>
  )
}
