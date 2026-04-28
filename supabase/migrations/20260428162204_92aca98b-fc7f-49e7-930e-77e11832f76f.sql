-- Tighten site_edits: reads remain public, but writes are admin-only.
DROP POLICY IF EXISTS "Anyone can insert site_edits" ON public.site_edits;
DROP POLICY IF EXISTS "Anyone can update site_edits" ON public.site_edits;

CREATE POLICY "Admins can insert site_edits"
ON public.site_edits
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site_edits"
ON public.site_edits
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site_edits"
ON public.site_edits
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));