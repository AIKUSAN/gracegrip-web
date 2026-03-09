/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react'

const OPTIONS = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
]

export function ThemeDropdown({ currentTheme, onThemeChange }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [open])

  const ActiveIcon =
    currentTheme === 'dark' ? Moon : currentTheme === 'light' ? Sun : Monitor

  return (
    <div className="theme-dropdown" ref={containerRef}>
      <button
        className="theme-dropdown-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Change theme"
      >
        <ActiveIcon size={18} />
        <ChevronDown
          size={13}
          className={`theme-dropdown-chevron${open ? ' open' : ''}`}
        />
      </button>

      {open && (
        <div className="theme-dropdown-menu" role="listbox" aria-label="Theme options">
          {OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              role="option"
              aria-selected={currentTheme === value}
              className={`theme-dropdown-item${currentTheme === value ? ' active' : ''}`}
              onClick={() => {
                onThemeChange(value)
                setOpen(false)
              }}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
