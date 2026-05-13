-- user_feedback: anonymous feedback submission for GraceGrip.
-- Apply this SQL in the Vercel-managed Neon database before enabling feedback.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message text CHECK (message IS NULL OR char_length(message) <= 500)
);
