-- Pro Se Helper — Phase 0 demo seed data

insert into lawyers (id, full_name, email) values
  ('00000000-0000-0000-0000-000000000001', 'Jordan Avery, LL.B.', 'lawyer@prosehelper.local')
on conflict (id) do nothing;

insert into clients (id, full_name) values
  ('00000000-0000-0000-0000-0000000000a1', 'Sam Patel'),
  ('00000000-0000-0000-0000-0000000000a2', 'Riley Chen')
on conflict (id) do nothing;

insert into cases (id, client_id, assigned_lawyer_id, status, dispute_summary, claim_amount, in_scope) values
  ('00000000-0000-0000-0000-0000000000c1',
   '00000000-0000-0000-0000-0000000000a1',
   '00000000-0000-0000-0000-000000000001',
   'submitted',
   'Contractor was paid a $6,500 deposit for kitchen renovation, never started work, stopped responding.',
   6500.00, true)
on conflict (id) do nothing;

insert into case_events (case_id, actor, action, payload) values
  ('00000000-0000-0000-0000-0000000000c1', 'client', 'case_created', '{}'::jsonb),
  ('00000000-0000-0000-0000-0000000000c1', 'client', 'submitted_for_review', '{}'::jsonb);
