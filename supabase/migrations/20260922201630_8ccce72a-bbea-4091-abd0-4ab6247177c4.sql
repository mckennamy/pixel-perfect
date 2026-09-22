CREATE TABLE public.fare_watch (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checked_on DATE NOT NULL DEFAULT (now() AT TIME ZONE 'America/New_York')::date,
  origin TEXT NOT NULL,
  headline TEXT NOT NULL,
  routing TEXT NOT NULL,
  airline TEXT,
  price_low INTEGER,
  price_high INTEGER,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX fare_watch_checked_on_idx ON public.fare_watch (checked_on DESC);

GRANT SELECT ON public.fare_watch TO anon;
GRANT SELECT ON public.fare_watch TO authenticated;
GRANT ALL ON public.fare_watch TO service_role;

ALTER TABLE public.fare_watch ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read fare watch" ON public.fare_watch FOR SELECT USING (true);