import Link from "next/link";
import { getCasesForLawyer } from "@/lib/db/lawyer-cases";
import { getDeadlinesForLawyer } from "@/lib/db/deadlines";
import { query } from "@/lib/db/index";
import { TriageInbox, type TriageItem } from "@/components/lawyer/triage-inbox";

export const dynamic = "force-dynamic";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

const PRIORITY_STYLE = {
  CRITICAL: { bg: "bg-red-50",   text: "text-red-700",   border: "border-red-200",   dot: "bg-red-500"   },
  HIGH:     { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  NORMAL:   { bg: "bg-sky-50",   text: "text-sky-700",   border: "border-sky-200",   dot: "bg-sky-500"   },
  LOW:      { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
} as const;

export default async function TriagePage() {
  const [cases, deadlines, pendingConnections] = await Promise.all([
    getCasesForLawyer(DEMO_LAWYER_ID),
    getDeadlinesForLawyer(DEMO_LAWYER_ID),
    query<{ case_id: string; client_name: string; created_at: string }>(
      `select cn.case_id, cl.full_name as client_name, cn.requested_at as created_at
       from connections cn
       join clients cl on cl.id = cn.client_id
       where cn.lawyer_id = $1 and cn.status = 'requested'
       order by cn.requested_at desc`,
      [DEMO_LAWYER_ID]
    ),
  ]);

  const items: TriageItem[] = [];

  // Overdue deadlines → CRITICAL
  for (const d of deadlines.filter(
    (d) => d.status === "overdue" || (d.status === "pending" && new Date(d.due_date) < new Date())
  )) {
    items.push({
      id:       `dl-${d.id}`,
      priority: "CRITICAL",
      category: "Overdue Deadline",
      title:    d.title,
      subtitle: `${d.client_name} — due ${new Date(d.due_date).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}`,
      caseId:   d.case_id,
      href:     `/lawyer/case/${d.case_id}`,
      updatedAt: d.updated_at,
    });
  }

  // New submissions → HIGH
  for (const c of cases.filter((c) => c.status === "submitted")) {
    items.push({
      id:       `cs-${c.id}`,
      priority: "HIGH",
      category: "New Submission",
      title:    `Review Form 7A — ${c.client_name}`,
      subtitle: c.dispute_summary?.slice(0, 80) ?? "No summary",
      caseId:   c.id,
      href:     `/lawyer/case/${c.id}`,
      updatedAt: c.updated_at,
    });
  }

  // Client resubmissions after changes requested → HIGH
  for (const c of cases.filter((c) => c.status === "changes_requested")) {
    items.push({
      id:       `cr-${c.id}`,
      priority: "HIGH",
      category: "Client Resubmitted",
      title:    `Re-review edits — ${c.client_name}`,
      subtitle: c.dispute_summary?.slice(0, 80) ?? "No summary",
      caseId:   c.id,
      href:     `/lawyer/case/${c.id}`,
      updatedAt: c.updated_at,
    });
  }

  // Imminent deadlines (0–3 days) → HIGH
  const now = new Date();
  for (const d of deadlines.filter((d) => {
    if (d.status !== "pending") return false;
    const daysOut = Math.ceil((new Date(d.due_date).getTime() - now.getTime()) / 86_400_000);
    return daysOut >= 0 && daysOut <= 3;
  })) {
    const daysOut = Math.ceil((new Date(d.due_date).getTime() - now.getTime()) / 86_400_000);
    items.push({
      id:       `imm-${d.id}`,
      priority: "HIGH",
      category: "Imminent Deadline",
      title:    d.title,
      subtitle: `${d.client_name} — due ${daysOut === 0 ? "today" : daysOut === 1 ? "tomorrow" : `in ${daysOut}d`}`,
      caseId:   d.case_id,
      href:     `/lawyer/case/${d.case_id}`,
      updatedAt: d.updated_at,
    });
  }

  // Pending connection requests → NORMAL
  for (const cn of pendingConnections) {
    items.push({
      id:       `conn-${cn.case_id}`,
      priority: "NORMAL",
      category: "Connection Request",
      title:    `${cn.client_name} wants to connect`,
      subtitle: "Review case and accept or decline",
      caseId:   cn.case_id,
      href:     `/lawyer/case/${cn.case_id}`,
      updatedAt: cn.created_at,
    });
  }

  // In-review cases needing deadlines → NORMAL
  for (const c of cases.filter(
    (c) => c.status === "in_review" && c.overdue_count === 0 && c.imminent_count === 0
  )) {
    items.push({
      id:       `ir-${c.id}`,
      priority: "NORMAL",
      category: "Set Filing Deadline",
      title:    `Set deadline — ${c.client_name}`,
      subtitle: "Case is in review — add a filing deadline",
      caseId:   c.id,
      href:     `/lawyer/case/${c.id}`,
      updatedAt: c.updated_at,
    });
  }

  // Approved → LOW
  for (const c of cases.filter((c) => c.status === "approved")) {
    items.push({
      id:       `ap-${c.id}`,
      priority: "LOW",
      category: "Ready to File",
      title:    `File with clerk — ${c.client_name}`,
      subtitle: "Form 7A approved — ready to file at Small Claims Court",
      caseId:   c.id,
      href:     `/lawyer/case/${c.id}`,
      updatedAt: c.updated_at,
    });
  }

  // Summary counts for the strip
  const counts = {
    CRITICAL: items.filter((i) => i.priority === "CRITICAL").length,
    HIGH:     items.filter((i) => i.priority === "HIGH").length,
    NORMAL:   items.filter((i) => i.priority === "NORMAL").length,
    LOW:      items.filter((i) => i.priority === "LOW").length,
  };

  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
          Lawyer Console
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Triage Inbox</h1>
        <p className="text-sm text-slate-500 mt-1">
          All actionable items across your matters, sorted by priority. Configure preferences in{" "}
          <Link href="/lawyer/profile" className="text-indigo-600 underline-offset-2 hover:underline">
            My Profile
          </Link>
          .
        </p>
      </div>

      {/* Summary strip */}
      <div className="mb-6 flex flex-wrap gap-3">
        {(["CRITICAL", "HIGH", "NORMAL", "LOW"] as const).map((p) => {
          const s = PRIORITY_STYLE[p];
          return (
            <div key={p} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${s.bg} ${s.border}`}>
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              <span className={`text-xs font-bold ${s.text}`}>{p}</span>
              <span className={`text-lg font-extrabold ${s.text}`}>{counts[p]}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
          <span className="text-xs font-bold text-slate-500">TOTAL</span>
          <span className="text-lg font-extrabold text-slate-900">{items.length}</span>
        </div>
      </div>

      {/* Interactive tab bar + filtered list */}
      <TriageInbox items={items} />
    </main>
  );
}
