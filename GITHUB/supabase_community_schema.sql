-- COMMUNITY POSTS TABLE
CREATE TABLE community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  photo_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0
);

-- COMMUNITY COMMENTS TABLE
CREATE TABLE community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMMUNITY LIKES TABLE (To prevent double liking)
CREATE TABLE community_likes (
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR POSTS
CREATE POLICY "Anyone can view posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can edit their own posts" ON community_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own posts" ON community_posts FOR DELETE USING (auth.uid() = author_id);

-- POLICIES FOR COMMENTS
CREATE POLICY "Anyone can view comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON community_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own comments" ON community_comments FOR DELETE USING (auth.uid() = author_id);

-- POLICIES FOR LIKES
CREATE POLICY "Anyone can view likes" ON community_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON community_likes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can unlike" ON community_likes FOR DELETE USING (auth.uid() = user_id);
