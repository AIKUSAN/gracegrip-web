-- IDs and creation times are retained from Neon during migration.
CREATE TABLE IF NOT EXISTS user_feedback (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT CHECK (message IS NULL OR length(message) <= 500)
);

CREATE INDEX IF NOT EXISTS user_feedback_created_at_idx
  ON user_feedback (created_at);
