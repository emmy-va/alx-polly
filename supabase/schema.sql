-- Supabase Schema for Polling Application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Polls table
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  allow_multiple_votes BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ
);

-- Poll options table
CREATE TABLE IF NOT EXISTS poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  anonymous_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- Ensure a user can only vote once per option if not allowing multiple votes
  CONSTRAINT unique_vote_per_user_per_poll UNIQUE (poll_id, user_id),
  -- Either user_id or anonymous_user_id must be set, but not both
  CONSTRAINT user_or_anonymous_check CHECK (
    (user_id IS NOT NULL AND anonymous_user_id IS NULL) OR
    (user_id IS NULL AND anonymous_user_id IS NOT NULL)
  )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_polls_user_id ON polls(user_id);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON votes(option_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Row Level Security (RLS) Policies

-- Profiles table policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Polls table policies
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public polls"
  ON polls FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can view their own polls"
  ON polls FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create polls"
  ON polls FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own polls"
  ON polls FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own polls"
  ON polls FOR DELETE
  USING (auth.uid() = user_id);

-- Poll options table policies
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view options for public polls"
  ON poll_options FOR SELECT
  USING ((SELECT is_public FROM polls WHERE id = poll_options.poll_id) = TRUE);

CREATE POLICY "Users can view options for their own polls"
  ON poll_options FOR SELECT
  USING ((SELECT user_id FROM polls WHERE id = poll_options.poll_id) = auth.uid());

CREATE POLICY "Users can create options for their own polls"
  ON poll_options FOR INSERT
  WITH CHECK ((SELECT user_id FROM polls WHERE id = poll_options.poll_id) = auth.uid());

CREATE POLICY "Users can update options for their own polls"
  ON poll_options FOR UPDATE
  USING ((SELECT user_id FROM polls WHERE id = poll_options.poll_id) = auth.uid());

CREATE POLICY "Users can delete options for their own polls"
  ON poll_options FOR DELETE
  USING ((SELECT user_id FROM polls WHERE id = poll_options.poll_id) = auth.uid());

-- Votes table policies
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes for public polls"
  ON votes FOR SELECT
  USING ((SELECT is_public FROM polls WHERE id = votes.poll_id) = TRUE);

CREATE POLICY "Users can view votes for their own polls"
  ON votes FOR SELECT
  USING ((SELECT user_id FROM polls WHERE id = votes.poll_id) = auth.uid());

CREATE POLICY "Users can vote on public polls"
  ON votes FOR INSERT
  WITH CHECK (
    (SELECT is_public FROM polls WHERE id = votes.poll_id) = TRUE AND
    (votes.user_id = auth.uid() OR votes.user_id IS NULL)
  );

CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  USING (user_id = auth.uid());

-- Functions

-- Function to get poll results
CREATE OR REPLACE FUNCTION get_poll_results(poll_id UUID)
RETURNS TABLE (
  option_id UUID,
  option_text TEXT,
  vote_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    po.id AS option_id,
    po.text AS option_text,
    COUNT(v.id) AS vote_count
  FROM
    poll_options po
  LEFT JOIN
    votes v ON po.id = v.option_id
  WHERE
    po.poll_id = get_poll_results.poll_id
  GROUP BY
    po.id, po.text, po.position
  ORDER BY
    po.position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON polls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_poll_options_updated_at
  BEFORE UPDATE ON poll_options
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();