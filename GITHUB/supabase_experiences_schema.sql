-- TREK EXPERIENCES TABLE
CREATE TABLE trek_experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  avatar_url TEXT,
  trek_name TEXT NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  coords JSONB, -- Stores [lat, lng]
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  date DATE NOT NULL,
  story TEXT NOT NULL,
  photos TEXT[], -- Array of photo URLs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE trek_experiences ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Anyone can view experiences" ON trek_experiences FOR SELECT USING (true);
CREATE POLICY "Authenticated users can share experiences" ON trek_experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own experiences" ON trek_experiences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own experiences" ON trek_experiences FOR DELETE USING (auth.uid() = user_id);
