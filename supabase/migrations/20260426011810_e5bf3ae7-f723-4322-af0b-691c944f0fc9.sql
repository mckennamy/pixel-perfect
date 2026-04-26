ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS amount_paid numeric(10,2),
  ADD COLUMN IF NOT EXISTS payment_date date,
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS payment_note text;