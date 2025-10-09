-- Initial migration to trigger types generation
-- This creates a simple system table

CREATE TABLE IF NOT EXISTS public.system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Allow reading system config
CREATE POLICY "Allow public read access to system_config"
  ON public.system_config
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can modify
CREATE POLICY "Allow authenticated users to modify system_config"
  ON public.system_config
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
