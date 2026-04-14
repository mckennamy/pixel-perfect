CREATE TABLE public.site_edits (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_edits" ON public.site_edits FOR SELECT USING (true);
CREATE POLICY "Anyone can insert site_edits" ON public.site_edits FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update site_edits" ON public.site_edits FOR UPDATE USING (true) WITH CHECK (true);