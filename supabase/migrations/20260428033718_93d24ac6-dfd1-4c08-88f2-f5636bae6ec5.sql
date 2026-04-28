CREATE TABLE public.guest_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  question TEXT NOT NULL,
  answered BOOLEAN NOT NULL DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a question"
ON public.guest_questions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) > 1
  AND length(question) > 3
  AND (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE POLICY "Admins can view questions"
ON public.guest_questions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update questions"
ON public.guest_questions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete questions"
ON public.guest_questions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER guest_questions_touch_updated_at
BEFORE UPDATE ON public.guest_questions
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();