/*
# Create sentiment_analyses table (single-tenant, no auth)

1. New Tables
- `sentiment_analyses`
  - `id` (uuid, primary key)
  - `input_text` (text, not null) — the text the user submitted for analysis
  - `polarity` (numeric, not null) — polarity score from -1 to 1
  - `subjectivity` (numeric, not null) — subjectivity score from 0 to 1
  - `classification` (text, not null) — "positive", "negative", or "neutral"
  - `word_count` (integer, not null) — number of words in the input
  - `created_at` (timestamptz, default now)
2. Security
- Enable RLS on `sentiment_analyses`.
- Allow anon + authenticated CRUD because the app is intentionally public/shared (no sign-in).
*/

CREATE TABLE IF NOT EXISTS sentiment_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text text NOT NULL,
  polarity numeric NOT NULL,
  subjectivity numeric NOT NULL,
  classification text NOT NULL CHECK (classification IN ('positive', 'negative', 'neutral')),
  word_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sentiment_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sentiment_analyses" ON sentiment_analyses;
CREATE POLICY "anon_select_sentiment_analyses" ON sentiment_analyses FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_sentiment_analyses" ON sentiment_analyses;
CREATE POLICY "anon_insert_sentiment_analyses" ON sentiment_analyses FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_sentiment_analyses" ON sentiment_analyses;
CREATE POLICY "anon_delete_sentiment_analyses" ON sentiment_analyses FOR DELETE
TO anon, authenticated USING (true);
