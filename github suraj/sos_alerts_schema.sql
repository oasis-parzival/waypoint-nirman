-- SOS ALERTS TABLE
CREATE TABLE sos_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  coords TEXT NOT NULL,
  altitude TEXT,
  blood_group TEXT,
  medical_info TEXT,
  status TEXT DEFAULT 'CRITICAL',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE REALTIME FOR THIS TABLE
-- Execute this in Supabase SQL Editor to enable real-time replication
-- ALTER PUBLICATION supabase_realtime ADD TABLE sos_alerts;

-- RLS POLICIES
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

-- Anyone can read alerts (for admin dashboard simplicity, usually restricted to admins)
CREATE POLICY "Anyone can view SOS alerts" ON sos_alerts FOR SELECT USING (true);

-- Authenticated users can create SOS alerts
CREATE POLICY "Authenticated users can trigger SOS" ON sos_alerts FOR INSERT WITH CHECK (true);
