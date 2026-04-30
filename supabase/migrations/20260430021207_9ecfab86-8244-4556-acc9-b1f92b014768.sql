CREATE TABLE public.flight_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  flight_arrival_date TEXT,
  flight_arrival_number TEXT,
  flight_arrival_from TEXT,
  flight_departure_date TEXT,
  flight_departure_number TEXT,
  flight_departure_to TEXT,
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.flight_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit flight details"
ON public.flight_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  full_name IS NOT NULL AND length(full_name) > 1
  AND email IS NOT NULL AND length(email) > 3
);

CREATE POLICY "Admins can view flight submissions"
ON public.flight_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update flight submissions"
ON public.flight_submissions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete flight submissions"
ON public.flight_submissions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER flight_submissions_touch_updated_at
BEFORE UPDATE ON public.flight_submissions
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();