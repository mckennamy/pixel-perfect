CREATE POLICY "Anyone can insert guest_placements"
ON public.site_edits
FOR INSERT
WITH CHECK (id = 'guest_placements');

CREATE POLICY "Anyone can update guest_placements"
ON public.site_edits
FOR UPDATE
USING (id = 'guest_placements')
WITH CHECK (id = 'guest_placements');

GRANT INSERT, UPDATE ON public.site_edits TO anon, authenticated;