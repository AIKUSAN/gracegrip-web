CREATE TABLE IF NOT EXISTS room_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  next_session_at TEXT,
  shutdown INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO room_settings (id) VALUES (1);

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE,
  alias TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  rules_version INTEGER NOT NULL,
  joined_at TEXT NOT NULL,
  removed_at TEXT,
  banned_at TEXT
);

CREATE TABLE IF NOT EXISTS alias_requests (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id),
  requested_alias TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id),
  body TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TEXT NOT NULL,
  reviewed_at TEXT,
  expires_at TEXT NOT NULL,
  ai_flag TEXT
);
CREATE INDEX IF NOT EXISTS posts_queue_idx ON posts(status, submitted_at);
CREATE INDEX IF NOT EXISTS posts_retention_idx ON posts(expires_at);

CREATE TABLE IF NOT EXISTS member_blocks (
  blocker_id TEXT NOT NULL REFERENCES members(id),
  blocked_id TEXT NOT NULL REFERENCES members(id),
  PRIMARY KEY(blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS incident_evidence (
  id TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL,
  reported_member_id TEXT,
  post_id TEXT,
  reason TEXT NOT NULL,
  body_snapshot TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS incident_retention_idx ON incident_evidence(expires_at);

CREATE TABLE IF NOT EXISTS post_rate (
  member_id TEXT PRIMARY KEY,
  last_post_at TEXT NOT NULL
);
