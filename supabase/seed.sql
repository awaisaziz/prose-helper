-- Pro Se Helper — demo seed data (Phase 0 + Phase 1 + Phase 1b)

-- ── Lawyers ─────────────────────────────────────────────────────────────────
insert into lawyers (id, full_name, email) values
  ('00000000-0000-0000-0000-000000000001', 'Jordan Avery',  'jordan@prosehelper.local'),
  ('00000000-0000-0000-0000-000000000002', 'Priya Sharma',  'priya@prosehelper.local'),
  ('00000000-0000-0000-0000-000000000003', 'Marcus Webb',   'marcus@prosehelper.local')
on conflict (id) do nothing;

-- ── Lawyer profiles ──────────────────────────────────────────────────────────
insert into lawyer_profiles (lawyer_id, title, bio, specialties, image_url, hourly_rate, years_exp) values
  (
    '00000000-0000-0000-0000-000000000001',
    'LL.B., Civil Litigator',
    'Jordan has handled 300+ Small Claims matters across Ontario and specialises in contractor disputes, unpaid invoices, and consumer protection. Plain-language advice, fast turnaround.',
    ARRAY['Small Claims', 'Contracts', 'Consumer Protection', 'Civil Litigation'],
    'https://api.dicebear.com/8.x/initials/svg?seed=JordanAvery&backgroundColor=3b82f6',
    150, 10
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'LL.B., M.B.A., Employment & Commercial',
    'Priya focuses on employment disputes, wage recovery, and commercial contract breaches. Former in-house counsel with deep experience in Ontario ESA matters.',
    ARRAY['Employment Law', 'Wage Recovery', 'Commercial Contracts', 'Small Claims'],
    'https://api.dicebear.com/8.x/initials/svg?seed=PriyaSharma&backgroundColor=8b5cf6',
    175, 8
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'LL.B., Property & Consumer Law',
    'Marcus advises on landlord-tenant disputes, property damage claims, and defective goods. Certified Specialist in civil litigation with 200+ tribunal appearances.',
    ARRAY['Property Damage', 'Landlord-Tenant', 'Consumer Law', 'Small Claims'],
    'https://api.dicebear.com/8.x/initials/svg?seed=MarcusWebb&backgroundColor=10b981',
    165, 12
  )
on conflict do nothing;

-- ── Clients (Sam has Jordan as default lawyer) ──────────────────────────────
insert into clients (id, full_name, default_lawyer_id) values
  ('00000000-0000-0000-0000-0000000000a1', 'Sam Patel',  '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-0000000000a2', 'Riley Chen',  null)
on conflict (id) do nothing;

-- ── Demo case ────────────────────────────────────────────────────────────────
insert into cases (id, client_id, assigned_lawyer_id, status, dispute_summary, claim_amount, in_scope, matter_type) values
  (
    '00000000-0000-0000-0000-0000000000c1',
    '00000000-0000-0000-0000-0000000000a1',
    '00000000-0000-0000-0000-000000000001',
    'submitted',
    'Contractor was paid a $6,500 deposit for kitchen renovation, never started work, stopped responding.',
    6500.00, true, 'contractor_deposit'
  )
on conflict (id) do nothing;

insert into case_events (case_id, actor, action, payload) values
  ('00000000-0000-0000-0000-0000000000c1', 'client', 'case_created',         '{}'::jsonb),
  ('00000000-0000-0000-0000-0000000000c1', 'client', 'submitted_for_review',  '{}'::jsonb)
on conflict do nothing;

-- ── Demo connection ───────────────────────────────────────────────────────────
insert into connections (case_id, client_id, lawyer_id, status, accepted_at) values
  (
    '00000000-0000-0000-0000-0000000000c1',
    '00000000-0000-0000-0000-0000000000a1',
    '00000000-0000-0000-0000-000000000001',
    'accepted',
    now()
  )
on conflict (case_id, lawyer_id) do update set status = 'accepted', accepted_at = now();

-- ── Demo notifications for Sam ───────────────────────────────────────────────
insert into notifications (client_id, case_id, type, message, read) values
  (
    '00000000-0000-0000-0000-0000000000a1',
    '00000000-0000-0000-0000-0000000000c1',
    'lawyer_accepted',
    'Jordan Avery has accepted your case review and will be in touch shortly.',
    false
  ),
  (
    '00000000-0000-0000-0000-0000000000a1',
    '00000000-0000-0000-0000-0000000000c1',
    'info',
    'Your Plaintiff''s Claim draft is ready for review. Open the Prepare tab to view it.',
    true
  )
on conflict do nothing;

-- ── Phase 6: Demo deadlines ───────────────────────────────────────────────────
insert into deadlines (case_id, lawyer_id, title, rule_anchor, due_date, urgency, status, notified) values
  (
    '00000000-0000-0000-0000-0000000000c1',
    '00000000-0000-0000-0000-000000000001',
    'File Plaintiff''s Claim with the clerk',
    'Rules of the Small Claims Court, r.7.01',
    CURRENT_DATE - INTERVAL '2 days',
    'critical', 'overdue', true
  ),
  (
    '00000000-0000-0000-0000-0000000000c1',
    '00000000-0000-0000-0000-000000000001',
    'Serve defendant (Form 8A)',
    'Rules of the Small Claims Court, r.8.01',
    CURRENT_DATE + INTERVAL '5 days',
    'high', 'pending', false
  )
on conflict do nothing;

-- ── Phase 6: Demo case review ─────────────────────────────────────────────────
insert into case_reviews (case_id, lawyer_id, decision, notes) values
  (
    '00000000-0000-0000-0000-0000000000c1',
    '00000000-0000-0000-0000-000000000001',
    'in_review',
    'Reviewing the Form 7A draft — citations look solid. Will confirm amount and relief before approving.'
  )
on conflict do nothing;
