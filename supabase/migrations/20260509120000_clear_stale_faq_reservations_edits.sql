-- Remove stale FAQ reservations overrides whose positions shifted when a new question was inserted.
DELETE FROM public.site_edits
WHERE id IN (
  'bb_text_faq-reservations-2-answer',
  'bb_text_faq-reservations-3-answer'
);
