-- Pro Se Helper — demo seed data (Phase 0 + Phase 1)

-- ── Lawyers ─────────────────────────────────────────────────────────────────
insert into lawyers (id, full_name, email) values
  ('00000000-0000-0000-0000-000000000001', 'Jordan Avery',  'jordan@prosehelper.local'),
  ('00000000-0000-0000-0000-000000000002', 'Priya Sharma',  'priya@prosehelper.local'),
  ('00000000-0000-0000-0000-000000000003', 'Marcus Webb',   'marcus@prosehelper.local')
on conflict (id) do nothing;

-- ── Lawyer profiles (directory cards) ────────────────────────────────────────
insert into lawyer_profiles (lawyer_id, title, bio, specialties, image_url, hourly_rate, years_exp) values
  (
    '00000000-0000-0000-0000-000000000001',
    'LL.B., Civil Litigator',
    'Jordan has handled 300+ Small Claims matters across Ontario and specialises in contractor disputes, unpaid invoices, and consumer protection. Plain-language advice, fast turnaround.',
    ARRAY['Small Claims', 'Contracts', 'Consumer Protection', 'Civil Litigation'],
    'https://api.dicebear.com/8.x/initials/svg?seed=JordanAvery&backgroundColor=3b82f6',
    150,
    10
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'LL.B., M.B.A., Employment & Commercial',
    'Priya focuses on employment disputes, wage recovery, and commercial contract breaches. Former in-house counsel with deep experience in Ontario ESA matters.',
    ARRAY['Employment Law', 'Wage Recovery', 'Commercial Contracts', 'Small Claims'],
    'https://api.dicebear.com/8.x/initials/svg?seed=PriyaSharma&backgroundColor=8b5cf6',
    175,
    8
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'LL.B., Property & Consumer Law',
    'Marcus advises on landlord-tenant disputes, property damage claims, and defective goods. Certified Specialist in civil litigation with 200+ tribunal appearances.',
    ARRAY['Property Damage', 'Landlord-Tenant', 'Consumer Law', 'Small Claims'],
    'https://api.dicebear.com/8.x/initials/svg?seed=MarcusWebb&backgroundColor=10b981',
    165,
    12
  )
on conflict do nothing;

-- ── Clients ──────────────────────────────────────────────────────────────────
insert into clients (id, full_name) values
  ('00000000-0000-0000-0000-0000000000a1', 'Sam Patel'),
  ('00000000-0000-0000-0000-0000000000a2', 'Riley Chen')
on conflict (id) do nothing;

-- ── Demo case (Sam Patel — contractor deposit, already submitted) ─────────────
insert into cases (id, client_id, assigned_lawyer_id, status, dispute_summary, claim_amount, in_scope, matter_type) values
  (
    '00000000-0000-0000-0000-0000000000c1',
    '00000000-0000-0000-0000-0000000000a1',
    '00000000-0000-0000-0000-000000000001',
    'submitted',
    'Contractor was paid a $6,500 deposit for kitchen renovation, never started work, stopped responding.',
    6500.00,
    true,
    'contractor_deposit'
  )
on conflict (id) do nothing;

insert into case_events (case_id, actor, action, payload) values
  ('00000000-0000-0000-0000-0000000000c1', 'client',  'case_created',        '{}'::jsonb),
  ('00000000-0000-0000-0000-0000000000c1', 'client',  'submitted_for_review', '{}'::jsonb)
on conflict do nothing;
