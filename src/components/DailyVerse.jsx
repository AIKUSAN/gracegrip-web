/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { useState, useRef } from 'react'
import { BookOpen, Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { getVerseArt } from '@/lib/verseArt'

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86400000)
}

export function DailyVerse({ verses }) {
  const verse = verses[getDayOfYear(new Date()) % verses.length]
  const [copied, setCopied] = useState(false)
  const copyTimerRef = useRef(null)

  const onCopy = async () => {
    if (copied) return
    try {
      await navigator.clipboard.writeText(`"${verse.text}" — ${verse.reference}`)
      setCopied(true)
      clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Unable to copy on this browser.')
    }
  }

  if (!verse) return null

  const verseArt = getVerseArt(verse.category)

  return (
    <div className="daily-verse-card" style={{ backgroundImage: `url(${verseArt})` }}>
      <div className="daily-verse-bg-overlay" aria-hidden="true" />
      <div className="daily-verse-content">
        <div className="daily-verse-header">
          <BookOpen size={15} aria-hidden="true" />
          <span>Verse of the Day</span>
        </div>

        <p className="daily-verse-text">"{verse.text}"</p>

        <div className="daily-verse-footer">
          <span className="verse-ref">{verse.reference}</span>
        </div>
      </div>
      <button
        className={`verse-copy-fab${copied ? ' is-copied' : ''}`}
        onClick={onCopy}
        title={copied ? 'Copied!' : 'Copy verse'}
        aria-label={copied ? 'Verse copied to clipboard' : 'Copy verse to clipboard'}
        disabled={copied}
      >
        {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </div>
  )
}
