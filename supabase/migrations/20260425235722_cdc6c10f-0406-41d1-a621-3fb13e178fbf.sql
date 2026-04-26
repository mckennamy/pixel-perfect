
-- ── Roles ──
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Auto-assign admin role to mckennamy@gmail.com on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'mckennamy@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Guest list (the master list of invited people) ──
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  invite_tier TEXT NOT NULL DEFAULT 'standard' CHECK (invite_tier IN ('standard', 'rehearsal')),
  invite_sent_at TIMESTAMPTZ,
  reservation_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_guests_full_name_lower ON public.guests (lower(full_name));
CREATE INDEX idx_guests_email_lower ON public.guests (lower(email));

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Public can search guests by name (for the landing-page name gate)
-- We expose only minimal fields via a view; for simplicity allow public SELECT
CREATE POLICY "Anyone can search guests" ON public.guests
FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert guests" ON public.guests
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update guests" ON public.guests
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete guests" ON public.guests
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ── Reservations (replacing localStorage) ──
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  primary_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  guests JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment_option TEXT NOT NULL,
  accommodation_preference TEXT NOT NULL,
  linen_service TEXT,
  linen_frequency TEXT,
  linen_days JSONB,
  flight_arrival_date TEXT,
  flight_arrival_number TEXT,
  flight_arrival_from TEXT,
  flight_departure_date TEXT,
  flight_departure_number TEXT,
  flight_departure_to TEXT,
  notes TEXT,
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a reservation" ON public.reservations
FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can view all reservations" ON public.reservations
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reservations" ON public.reservations
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reservations" ON public.reservations
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Mark guest as having reservation when one is submitted
CREATE OR REPLACE FUNCTION public.link_reservation_to_guest()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Try to match by email first, then by name
  UPDATE public.guests
  SET reservation_id = NEW.id, updated_at = now()
  WHERE id = (
    SELECT id FROM public.guests
    WHERE lower(email) = lower(NEW.email)
       OR lower(full_name) = lower(NEW.primary_name)
    LIMIT 1
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER reservation_link_guest
AFTER INSERT ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.link_reservation_to_guest();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER touch_guests BEFORE UPDATE ON public.guests
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_reservations BEFORE UPDATE ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ── Email send log (tracks invites & reminders sent) ──
CREATE TABLE public.email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL,
  invite_tier TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email log" ON public.email_log
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert email log" ON public.email_log
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
