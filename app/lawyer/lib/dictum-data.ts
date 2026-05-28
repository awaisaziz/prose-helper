export type MatterStage =
  | "Intake"
  | "Drafting"
  | "Discovery"
  | "Negotiation"
  | "Trial Prep"
  | "Closed";

export interface Matter {
  id: string;
  title: string;
  client: string;
  stage: MatterStage;
  practice: "Litigation" | "Advisory" | "IP" | "Estate";
  nextAction: string;
  nextDue: string;
  billed: number;
  cap: number;
  updated: string;
  flagClient?: boolean;
}

export const MATTERS: Matter[] = [
  {
    id: "dp-2025-0714",
    title: "DrinkPure vs. PackCo, Inc.",
    client: "Sarah Jenkins",
    stage: "Drafting",
    practice: "Litigation",
    nextAction: "Sign demand letter",
    nextDue: "Today · 4:45 PM",
    billed: 1840,
    cap: 4200,
    updated: "11 min ago",
    flagClient: true,
  },
  {
    id: "hollis-probate",
    title: "Hollis Estate — Probate Admin.",
    client: "Margaret Hollis",
    stage: "Discovery",
    practice: "Estate",
    nextAction: "File inventory of assets",
    nextDue: "Jul 19",
    billed: 6200,
    cap: 9000,
    updated: "2 hr ago",
  },
  {
    id: "nguyen-citymark",
    title: "Nguyen v. Citymark Apartments",
    client: "Linh Nguyen",
    stage: "Discovery",
    practice: "Litigation",
    nextAction: "Depose maintenance lead",
    nextDue: "Jul 22",
    billed: 11400,
    cap: 15000,
    updated: "Yesterday",
  },
  {
    id: "acme-trademark",
    title: "Acme Roasters — TM Opposition",
    client: "Acme Roasters Co.",
    stage: "Negotiation",
    practice: "IP",
    nextAction: "Counterproposal to USPTO",
    nextDue: "Jul 24",
    billed: 3200,
    cap: 6500,
    updated: "Yesterday",
  },
  {
    id: "kestrel-msa",
    title: "Kestrel Labs — MSA Review",
    client: "Kestrel Labs",
    stage: "Drafting",
    practice: "Advisory",
    nextAction: "Redline §7 indemnity",
    nextDue: "Jul 18",
    billed: 980,
    cap: 3000,
    updated: "2 days ago",
  },
  {
    id: "ortega-noncompete",
    title: "Ortega Non-Compete Dispute",
    client: "Diego Ortega",
    stage: "Trial Prep",
    practice: "Litigation",
    nextAction: "Witness prep — D. Ortega",
    nextDue: "Jul 26",
    billed: 14200,
    cap: 18000,
    updated: "3 days ago",
  },
  {
    id: "blume-loi",
    title: "Blume Bio — Series A LOI",
    client: "Blume Bio",
    stage: "Negotiation",
    practice: "Advisory",
    nextAction: "Comment on board composition",
    nextDue: "Jul 21",
    billed: 4100,
    cap: 7500,
    updated: "4 days ago",
  },
  {
    id: "mcveigh-estate",
    title: "McVeigh Trust Restructure",
    client: "Eleanor McVeigh",
    stage: "Closed",
    practice: "Estate",
    nextAction: "—",
    nextDue: "—",
    billed: 8200,
    cap: 8200,
    updated: "Last week",
  },
];

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  dispute: string;
  claim: number;
  score: number;
  lastAction: string;
  column: "new" | "brief" | "engagement" | "converted";
}

export const LEADS: Lead[] = [
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    company: "DrinkPure",
    email: "sarah@drinkpure.com",
    dispute: "Vendor contract cancellation",
    claim: 35000,
    score: 94,
    lastAction: "Intake parsed · 8:42 AM",
    column: "new",
  },
  {
    id: "tom-reeve",
    name: "Tom Reeve",
    email: "t.reeve@northbay.io",
    dispute: "Wrongful termination",
    claim: 120000,
    score: 71,
    lastAction: "Form submitted · 7:12 AM",
    column: "new",
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    company: "Loop Studio",
    email: "priya@loopstudio.co",
    dispute: "Copyright infringement",
    claim: 22000,
    score: 88,
    lastAction: "Brief generated · Yesterday",
    column: "brief",
  },
  {
    id: "marcus-doyle",
    name: "Marcus Doyle",
    email: "m.doyle@gmail.com",
    dispute: "Landlord retaliation",
    claim: 18000,
    score: 64,
    lastAction: "Brief generated · 2 days ago",
    column: "brief",
  },
  {
    id: "anika-rao",
    name: "Anika Rao",
    company: "Patchwork Inc.",
    email: "anika@patchwork.io",
    dispute: "Co-founder equity dispute",
    claim: 250000,
    score: 82,
    lastAction: "Engagement sent · Mon",
    column: "engagement",
  },
  {
    id: "leo-vance",
    name: "Leo Vance",
    company: "Vance Architecture",
    email: "leo@vancearch.com",
    dispute: "Owed fees on completed project",
    claim: 47000,
    score: 79,
    lastAction: "Converted · Jul 10",
    column: "converted",
  },
  {
    id: "rita-park",
    name: "Rita Park",
    email: "rita.park@parkpets.com",
    dispute: "Lease assignment defense",
    claim: 31000,
    score: 76,
    lastAction: "Converted · Jul 8",
    column: "converted",
  },
];

export interface TimeEntry {
  date: string;
  matterId: string;
  matterTitle: string;
  source: "Email" | "Calendar" | "Manual";
  duration: number;
  rate: number;
}

export const TIME_ENTRIES: TimeEntry[] = [
  { date: "Jul 16", matterId: "dp-2025-0714", matterTitle: "DrinkPure vs. PackCo", source: "Calendar", duration: 0.5, rate: 480 },
  { date: "Jul 16", matterId: "dp-2025-0714", matterTitle: "DrinkPure vs. PackCo", source: "Email", duration: 1.2, rate: 480 },
  { date: "Jul 16", matterId: "nguyen-citymark", matterTitle: "Nguyen v. Citymark", source: "Email", duration: 0.8, rate: 480 },
  { date: "Jul 15", matterId: "dp-2025-0714", matterTitle: "DrinkPure vs. PackCo", source: "Calendar", duration: 0.25, rate: 480 },
  { date: "Jul 15", matterId: "acme-trademark", matterTitle: "Acme TM Opposition", source: "Manual", duration: 1.5, rate: 520 },
  { date: "Jul 15", matterId: "hollis-probate", matterTitle: "Hollis Estate", source: "Email", duration: 0.6, rate: 420 },
  { date: "Jul 14", matterId: "ortega-noncompete", matterTitle: "Ortega Non-Compete", source: "Calendar", duration: 2.0, rate: 480 },
  { date: "Jul 14", matterId: "kestrel-msa", matterTitle: "Kestrel Labs MSA", source: "Manual", duration: 1.4, rate: 460 },
  { date: "Jul 14", matterId: "blume-loi", matterTitle: "Blume Bio LOI", source: "Email", duration: 0.9, rate: 460 },
  { date: "Jul 14", matterId: "dp-2025-0714", matterTitle: "DrinkPure vs. PackCo", source: "Manual", duration: 2.0, rate: 480 },
];

export interface CalEvent {
  day: number; // 0 = Mon
  start: number; // hour, decimal
  end: number;
  title: string;
  matterId?: string;
  type: "court" | "client" | "internal" | "signoff";
}

export const CAL_EVENTS: CalEvent[] = [
  { day: 0, start: 9, end: 10, title: "Hollis — asset inventory call", matterId: "hollis-probate", type: "client" },
  { day: 0, start: 14, end: 15, title: "DrinkPure intake review", matterId: "dp-2025-0714", type: "internal" },
  { day: 1, start: 10, end: 11, title: "DrinkPure onboarding (15m)", matterId: "dp-2025-0714", type: "client" },
  { day: 1, start: 13, end: 14.5, title: "Nguyen — depo prep", matterId: "nguyen-citymark", type: "internal" },
  { day: 2, start: 10, end: 10.5, title: "Mendez ruling review", type: "internal" },
  { day: 2, start: 13.5, end: 14.5, title: "DrinkPure — discovery prep", matterId: "dp-2025-0714", type: "internal" },
  { day: 2, start: 15, end: 16, title: "Intake call — prospective IP", type: "client" },
  { day: 2, start: 16.75, end: 17.25, title: "Sign demand letter (PackCo)", matterId: "dp-2025-0714", type: "signoff" },
  { day: 3, start: 9, end: 11, title: "Ortega witness prep", matterId: "ortega-noncompete", type: "internal" },
  { day: 3, start: 14, end: 15, title: "Blume Bio LOI call", matterId: "blume-loi", type: "client" },
  { day: 4, start: 9.5, end: 10.5, title: "Court — Motion to compel", matterId: "nguyen-citymark", type: "court" },
  { day: 4, start: 13, end: 14, title: "Kestrel MSA redline review", matterId: "kestrel-msa", type: "internal" },
];

export const DEADLINES = [
  { date: "Jul 22", title: "Motion to compel hearing", matterId: "nguyen-citymark" },
  { date: "Jul 24", title: "USPTO counterproposal due", matterId: "acme-trademark" },
  { date: "Jul 26", title: "Witness disclosures", matterId: "ortega-noncompete" },
  { date: "Aug 04", title: "Statute of limitations cutoff", matterId: "dp-2025-0714" },
];
