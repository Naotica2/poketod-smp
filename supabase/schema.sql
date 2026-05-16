-- Poketod SMP Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  mc_nickname TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'player' CHECK (role IN ('player', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUGGESTIONS TABLE
-- ============================================
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'planned', 'implemented', 'rejected')),
  vote_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOTES TABLE (prevents double voting)
-- ============================================
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  suggestion_id UUID REFERENCES suggestions(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, suggestion_id)
);

-- ============================================
-- FORUM CATEGORIES TABLE
-- ============================================
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name
  sort_order INT DEFAULT 0
);

-- ============================================
-- FORUM THREADS TABLE
-- ============================================
CREATE TABLE forum_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  reply_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FORUM REPLIES TABLE
-- ============================================
CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  is_answer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Suggestions
CREATE POLICY "Public suggestions" ON suggestions FOR SELECT USING (true);
CREATE POLICY "Auth users create suggestions" ON suggestions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own suggestions" ON suggestions FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors delete own suggestions" ON suggestions FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Admins manage suggestions" ON suggestions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Votes
CREATE POLICY "Public votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Auth users vote" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own vote" ON votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own vote" ON votes FOR DELETE USING (auth.uid() = user_id);

-- Forum Categories
CREATE POLICY "Public categories" ON forum_categories FOR SELECT USING (true);

-- Forum Threads
CREATE POLICY "Public threads" ON forum_threads FOR SELECT USING (true);
CREATE POLICY "Auth users create threads" ON forum_threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own threads" ON forum_threads FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Admins manage threads" ON forum_threads FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Forum Replies
CREATE POLICY "Public replies" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Auth users create replies" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Admins manage replies" ON forum_replies FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- TRIGGER: Update vote_count on suggestions
-- ============================================
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE suggestions
  SET vote_count = (
    SELECT COALESCE(SUM(CASE WHEN vote_type = 'up' THEN 1 ELSE -1 END), 0)
    FROM votes
    WHERE suggestion_id = COALESCE(NEW.suggestion_id, OLD.suggestion_id)
  )
  WHERE id = COALESCE(NEW.suggestion_id, OLD.suggestion_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_vote_count();

-- ============================================
-- TRIGGER: Update reply_count on threads
-- ============================================
CREATE OR REPLACE FUNCTION update_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_threads
  SET reply_count = (
    SELECT COUNT(*) FROM forum_replies
    WHERE thread_id = COALESCE(NEW.thread_id, OLD.thread_id)
  )
  WHERE id = COALESCE(NEW.thread_id, OLD.thread_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reply_change
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_reply_count();

-- ============================================
-- SEED: Default Forum Categories
-- ============================================
INSERT INTO forum_categories (name, slug, description, icon, sort_order) VALUES
  ('General Discussion', 'general', 'Talk about anything related to Poketod SMP', 'MessageCircle', 1),
  ('Cobblemon', 'cobblemon', 'Discuss Cobblemon strategies, trades, and battles', 'Sparkles', 2),
  ('Create Aeronautics', 'create-aeronautics', 'Share your steampunk creations and engineering', 'Cog', 3),
  ('Help & Support', 'help-support', 'Get help with server issues or questions', 'HelpCircle', 4),
  ('Bug Reports', 'bug-reports', 'Report bugs and technical issues', 'Bug', 5),
  ('Off Topic', 'off-topic', 'Casual conversations not related to the server', 'Coffee', 6);
