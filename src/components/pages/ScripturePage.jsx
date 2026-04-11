/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { Bookmark, BookmarkCheck, BookOpen, LayoutGrid, ScrollText, ArrowDownToLine } from 'lucide-react'

const SCRIPTURE_TABS = [
  { id: 'temptation',  label: 'Temptation'  },
  { id: 'identity',    label: 'Identity'    },
  { id: 'forgiveness', label: 'Forgiveness' },
  { id: 'strength',    label: 'Strength'    },
  { id: 'peace',       label: 'Peace'       },
  { id: 'freedom',     label: 'Freedom'     },
]

export function ScripturePage({
  activeScriptureTab,
  onChangeScriptureTab,
  filteredVerses,
  favoriteVerseIds,
  onFavoriteToggle,
  verses,
}) {
  const savedVerses = favoriteVerseIds
    .map((id) => verses.find((item) => item.id === id))
    .filter(Boolean)

  const activeTab = SCRIPTURE_TABS.find((t) => t.id === activeScriptureTab)

  return (
    <div className="screen-stack legacy-scripture-screen">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="scripture-page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
          <BookOpen size={22} aria-hidden="true" />
          Scripture Library
        </h1>
        <p className="muted" style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          Browse verses that speak directly into temptation, fear, peace, identity, forgiveness, and freedom.
        </p>
      </div>

      {/* ── Category Tabs ─────────────────────────────────────────── */}
      <section className="panel panel-wide legacy-scripture-header">
        <h3 className="scripture-cat-heading">
          <LayoutGrid size={17} aria-hidden="true" />
          Browse by Category
        </h3>
        <div className="scripture-cat-grid">
          {SCRIPTURE_TABS.map(({ id, label }) => (
            <button
              key={id}
              data-cat={id}
              className={`scripture-cat-btn${activeScriptureTab === id ? ' scripture-cat-btn-active' : ''}`}
              onClick={() => onChangeScriptureTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {savedVerses.length > 0 && (
          <button
            className="scripture-jump-btn"
            onClick={() => document.getElementById('saved-verses')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <ArrowDownToLine size={13} aria-hidden="true" />
            View {savedVerses.length} Saved {savedVerses.length === 1 ? 'Verse' : 'Verses'}
          </button>
        )}
      </section>

      {/* ── Verses by Category ────────────────────────────────────── */}
      <section className="panel panel-wide legacy-scripture-verses">
        <div className="scripture-section-header">
          <h3 className="scripture-section-heading">
            <ScrollText size={17} aria-hidden="true" />
            Verses for {activeTab?.label ?? 'All'}
          </h3>
          {filteredVerses.length > 0 && (
            <span className="journal-entry-count">{filteredVerses.length}</span>
          )}
        </div>
        <ul className="verse-list">
          {filteredVerses.map((verse) => {
            const isFavorite = favoriteVerseIds.includes(verse.id)
            return (
              <li key={verse.id} data-cat={activeScriptureTab} className="verse-card legacy-scripture-card">
                <p className="verse-text">
                  &ldquo;{verse.text}&rdquo;
                </p>
                <div className="legacy-scripture-actions">
                  <p className="verse-ref">{verse.reference}</p>
                  <button
                    className={`btn-icon-bookmark${isFavorite ? ' btn-icon-bookmark-active' : ''}`}
                    onClick={() => onFavoriteToggle(verse.id)}
                    aria-label={isFavorite ? 'Remove from saved' : 'Save verse'}
                  >
                    {isFavorite ? (
                      <>
                        <BookmarkCheck size={15} />
                        <span className="btn-bookmark-label">Saved</span>
                      </>
                    ) : (
                      <Bookmark size={15} />
                    )}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ── Saved Verses ──────────────────────────────────────────── */}
      <section id="saved-verses" className="panel panel-wide legacy-scripture-saved">
        <div className="scripture-section-header">
          <h3 className="scripture-section-heading scripture-saved-heading">
            <BookmarkCheck size={17} aria-hidden="true" />
            Saved Verses
          </h3>
          {savedVerses.length > 0 && (
            <span className="journal-entry-count">{savedVerses.length}</span>
          )}
        </div>
        {savedVerses.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--ink-soft)', opacity: 0.65, padding: '0.25rem 0' }}>
            <Bookmark size={16} aria-hidden="true" />
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Save verses that anchor you in hard moments.</p>
          </div>
        ) : (
          <ul className="verse-list">
            {savedVerses.map((verse) => (
              <li key={verse.id} className="verse-card">
                <p className="verse-text">
                  &ldquo;{verse.text}&rdquo;
                </p>
                <div className="legacy-scripture-actions">
                  <p className="verse-ref">{verse.reference}</p>
                  <button
                    className="btn-icon-bookmark btn-icon-bookmark-active"
                    onClick={() => onFavoriteToggle(verse.id)}
                    aria-label="Remove from saved"
                  >
                    <BookmarkCheck size={15} />
                    <span className="btn-bookmark-label">Saved</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  )
}
