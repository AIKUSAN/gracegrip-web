CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  sections_json TEXT NOT NULL,
  source_url TEXT,
  pen_name TEXT,
  byline_consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('draft', 'changes_requested', 'approved', 'publishing', 'pr_open')),
  revision INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  approved_by TEXT,
  qualified_reviewer TEXT,
  qualified_review_revision INTEGER,
  qualified_reviewed_at TEXT,
  approved_at TEXT,
  pr_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS drafts_status_idx ON drafts(status, updated_at);

CREATE TABLE IF NOT EXISTS draft_revisions (
  id TEXT PRIMARY KEY,
  draft_id TEXT NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  revision INTEGER NOT NULL,
  content_json TEXT NOT NULL,
  edited_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS draft_revisions_draft_idx ON draft_revisions(draft_id, revision);
