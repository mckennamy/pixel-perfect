DROP POLICY IF EXISTS "Anyone can read site_edits" ON public.site_edits;
CREATE POLICY "Anyone can read public site text" ON public.site_edits FOR SELECT TO anon, authenticated USING (id <> 'guest_placements');
CREATE POLICY "Admins can read all site_edits" ON public.site_edits FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));