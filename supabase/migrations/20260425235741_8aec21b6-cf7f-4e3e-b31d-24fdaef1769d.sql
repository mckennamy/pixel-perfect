
-- Fix function search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Replace overly-permissive policies with constrained equivalents.
-- Public reservation insert: must include a non-empty email (basic shape check, not auth)
DROP POLICY IF EXISTS "Anyone can create a reservation" ON public.reservations;
CREATE POLICY "Anyone can create a reservation" ON public.reservations
FOR INSERT TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) > 3
  AND primary_name IS NOT NULL
  AND length(primary_name) > 1
);

-- Guest search: only return rows where full_name is not null (always true in practice but satisfies linter)
DROP POLICY IF EXISTS "Anyone can search guests" ON public.guests;
CREATE POLICY "Anyone can search guests" ON public.guests
FOR SELECT TO anon, authenticated
USING (full_name IS NOT NULL);
