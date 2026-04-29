DELETE FROM site_edits WHERE id IN (
  'bb_text_finer-timeline-5-event',
  'bb_text_finer-timeline-5-location',
  'bb_text_finer-timeline-5-time'
);
UPDATE site_edits SET id = 'bb_text_finer-timeline-5-event'    WHERE id = 'bb_text_finer-timeline-6-event';
UPDATE site_edits SET id = 'bb_text_finer-timeline-5-location' WHERE id = 'bb_text_finer-timeline-6-location';
UPDATE site_edits SET id = 'bb_text_finer-timeline-5-time'     WHERE id = 'bb_text_finer-timeline-6-time';