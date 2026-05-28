export type CaseStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "filed";

export type AiStrength = "weak" | "moderate" | "strong";
export type DeadlineRisk = "green" | "yellow" | "red";

export interface LawyerCase {
  id: string;
  clientName: string;
  claimAmount: number;
  status: CaseStatus;
  aiStrength: AiStrength;
  deadlineRisk: DeadlineRisk;
  disputeSummary: string;
  assignedLawyer: string;
  createdAt: string;
}

export interface LawyerDeadline {
  id: string;
  caseId: string;
  clientName: string;
  label: string;
  dueDate: string;
  risk: DeadlineRisk;
}

const MOCK_CASES: LawyerCase[] = [
  {
    id: "00000000-0000-0000-0000-0000000000c1",
    clientName: "Sam Patel",
    claimAmount: 6500,
    status: "submitted",
    aiStrength: "moderate",
    deadlineRisk: "yellow",
    disputeSummary:
      "Contractor was paid a $6,500 deposit for kitchen renovation, never started work, stopped responding.",
    assignedLawyer: "Jordan Avery, LL.B.",
    createdAt: "2026-05-10T14:22:00Z",
  },
  {
    id: "00000000-0000-0000-0000-0000000000c2",
    clientName: "Riley Chen",
    claimAmount: 12400,
    status: "in_review",
    aiStrength: "strong",
    deadlineRisk: "green",
    disputeSummary:
      "Unpaid invoice for web development services; defendant disputes scope but contract and deliverables are documented.",
    assignedLawyer: "Jordan Avery, LL.B.",
    createdAt: "2026-05-18T09:15:00Z",
  },
  {
    id: "00000000-0000-0000-0000-0000000000c3",
    clientName: "Alex Morgan",
    claimAmount: 2800,
    status: "changes_requested",
    aiStrength: "weak",
    deadlineRisk: "red",
    disputeSummary:
      "Security deposit withheld after tenancy; landlord cites damage without itemized evidence.",
    assignedLawyer: "Jordan Avery, LL.B.",
    createdAt: "2026-04-28T16:40:00Z",
  },
  {
    id: "00000000-0000-0000-0000-0000000000c4",
    clientName: "Jordan Lee",
    claimAmount: 8900,
    status: "draft",
    aiStrength: "moderate",
    deadlineRisk: "green",
    disputeSummary:
      "Vehicle repair shop charged for unauthorized work; client has written estimate for original scope only.",
    assignedLawyer: "Jordan Avery, LL.B.",
    createdAt: "2026-05-25T11:05:00Z",
  },
  {
    id: "00000000-0000-0000-0000-0000000000c5",
    clientName: "Taylor Brooks",
    claimAmount: 15750,
    status: "approved",
    aiStrength: "strong",
    deadlineRisk: "yellow",
    disputeSummary:
      "Breach of wedding photography contract; deposit paid, vendor cancelled with no refund.",
    assignedLawyer: "Jordan Avery, LL.B.",
    createdAt: "2026-03-12T08:30:00Z",
  },
];

const MOCK_DEADLINES: LawyerDeadline[] = [
  {
    id: "dl-1",
    caseId: "00000000-0000-0000-0000-0000000000c3",
    clientName: "Alex Morgan",
    label: "Limitation period — claim filing",
    dueDate: "2026-06-02",
    risk: "red",
  },
  {
    id: "dl-2",
    caseId: "00000000-0000-0000-0000-0000000000c1",
    clientName: "Sam Patel",
    label: "Lawyer review SLA",
    dueDate: "2026-06-05",
    risk: "yellow",
  },
  {
    id: "dl-3",
    caseId: "00000000-0000-0000-0000-0000000000c5",
    clientName: "Taylor Brooks",
    label: "File Plaintiff's Claim (Form 7A)",
    dueDate: "2026-06-12",
    risk: "yellow",
  },
  {
    id: "dl-4",
    caseId: "00000000-0000-0000-0000-0000000000c2",
    clientName: "Riley Chen",
    label: "Respond to client revision request",
    dueDate: "2026-06-18",
    risk: "green",
  },
  {
    id: "dl-5",
    caseId: "00000000-0000-0000-0000-0000000000c4",
    clientName: "Jordan Lee",
    label: "Intake follow-up",
    dueDate: "2026-06-22",
    risk: "green",
  },
];

/** Mock API — returns all matters for the lawyer dashboard. */
export async function getLawyerCases(): Promise<LawyerCase[]> {
  return [...MOCK_CASES].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Mock API — fetch a single case by id. */
export async function getLawyerCaseById(id: string): Promise<LawyerCase | null> {
  return MOCK_CASES.find((c) => c.id === id) ?? null;
}

/** Mock API — upcoming procedural deadlines across all matters. */
export async function getLawyerDeadlines(): Promise<LawyerDeadline[]> {
  return [...MOCK_DEADLINES].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}

export function formatClaimAmount(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatStatus(status: CaseStatus): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
