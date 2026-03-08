-- Tighten user_feedback RLS INSERT policy
-- Resolves Supabase security advisory: rls_policy_always_true (anon_insert)
-- The app only inserts { rating, message } — user_id and category are always NULL.
-- This replaces WITH CHECK (true) with an explicit expression that mirrors
-- exactly what onSubmitFeedback() sends, rejecting anything else.

-- Add message length guard at the column level (defence in depth)
ALTER TABLE user_feedback
  ADD CONSTRAINT user_feedback_message_length
    CHECK (message IS NULL OR char_length(message) <= 2000);

-- Replace the overly permissive policy
DROP POLICY IF EXISTS "anon_insert" ON user_feedback;

CREATE POLICY "anon_insert" ON user_feedback
  FOR INSERT TO anon
  WITH CHECK (
    rating BETWEEN 1 AND 5
    AND (message IS NULL OR char_length(message) <= 2000)
    AND user_id IS NULL
    AND category IS NULL
  );
