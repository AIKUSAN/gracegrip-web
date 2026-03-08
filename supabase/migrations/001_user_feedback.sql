-- user_feedback: anonymous + optional-auth feedback submission
-- RLS: anon inserts only (no reads, no updates, no deletes)

CREATE TABLE IF NOT EXISTS user_feedback (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id     UUID,
  category    TEXT,
  rating      SMALLINT    NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message     TEXT
);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts only — no reads, no updates, no deletes
CREATE POLICY "anon_insert" ON user_feedback
  FOR INSERT TO anon
  WITH CHECK (true);
