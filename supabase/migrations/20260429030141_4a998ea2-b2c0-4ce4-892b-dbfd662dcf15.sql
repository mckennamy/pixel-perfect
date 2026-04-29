DELETE FROM site_edits WHERE id IN (
  'bb_text_finer-timeline-5-event',
  'bb_text_finer-timeline-5-location',
  'bb_text_finer-timeline-5-time',
  'bb_text_finer-timeline-6-event',
  'bb_text_finer-timeline-6-location',
  'bb_text_finer-timeline-6-time'
);
UPDATE site_edits SET id = 'bb_text_finer-timeline-5-event'    WHERE id = 'bb_text_finer-timeline-7-event';
UPDATE site_edits SET id = 'bb_text_finer-timeline-5-location' WHERE id = 'bb_text_finer-timeline-7-location';
UPDATE site_edits SET id = 'bb_text_finer-timeline-5-time'     WHERE id = 'bb_text_finer-timeline-7-time';
UPDATE site_edits SET id = 'bb_text_finer-timeline-6-event'    WHERE id = 'bb_text_finer-timeline-8-event';
UPDATE site_edits SET id = 'bb_text_finer-timeline-6-location' WHERE id = 'bb_text_finer-timeline-8-location';
UPDATE site_edits SET id = 'bb_text_finer-timeline-6-time'     WHERE id = 'bb_text_finer-timeline-8-time';