DROP POLICY IF EXISTS "Anyone can read fare watch" ON public.fare_watch;
CREATE POLICY "Anyone can read recent fares" ON public.fare_watch FOR SELECT TO anon, authenticated USING (checked_on >= (CURRENT_DATE - 14));
CREATE POLICY "Admins can read all fares" ON public.fare_watch FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));