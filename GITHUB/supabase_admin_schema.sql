-- Create SOS Signals Table
CREATE TABLE IF NOT EXISTS public.sos_signals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    location_name TEXT,
    coordinates JSONB, -- { lat, lng }
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, RESPONDED, RESOLVED
    message TEXT,
    priority TEXT DEFAULT 'CRITICAL'
);

-- Create Gear Requests Table
CREATE TABLE IF NOT EXISTS public.gear_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    trek_name TEXT,
    gear_items TEXT[], -- Array of items requested
    request_date DATE,
    status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, COLLECTED
    notes TEXT
);

-- Enable RLS
ALTER TABLE public.sos_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gear_requests ENABLE ROW LEVEL SECURITY;

-- Policies for SOS
CREATE POLICY "Public SOS insertion" ON public.sos_signals FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin/User SOS viewing" ON public.sos_signals FOR SELECT USING (true); -- Simplified for demo, should be more restricted

-- Policies for Gear Requests
CREATE POLICY "User can insert gear requests" ON public.gear_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can view own gear requests" ON public.gear_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all gear requests" ON public.gear_requests FOR SELECT USING (true);
CREATE POLICY "Admin can update gear requests" ON public.gear_requests FOR UPDATE USING (true);
