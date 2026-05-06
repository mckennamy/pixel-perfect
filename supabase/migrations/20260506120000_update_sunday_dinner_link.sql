UPDATE public.site_edits
SET content = 'On your own for those staying · rated a can''t miss by locals we encourage guests to try an outdoor dining experience at <a href="https://www.langolotondo.com/en" target="_blank" rel="noopener noreferrer" style="font-weight:700;color:hsl(var(--burg));text-decoration:underline;text-decoration-color:hsl(var(--gold));text-underline-offset:3px;">L''Angolo Tondo</a> in the Piazza.&nbsp;',
    updated_at = now()
WHERE id = 'bb_text_cal-23-act-2-note';
