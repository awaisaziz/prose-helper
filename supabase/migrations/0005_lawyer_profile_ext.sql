-- Phase 5 ext — Lawyer profile contact fields & triage preferences

ALTER TABLE lawyer_profiles
  ADD COLUMN IF NOT EXISTS phone        text,
  ADD COLUMN IF NOT EXISTS booking_url  text,
  ADD COLUMN IF NOT EXISTS triage_prefs jsonb NOT NULL DEFAULT
    '["overdue_deadline","new_submission","resubmission","imminent_deadline","connection_request"]'::jsonb;
