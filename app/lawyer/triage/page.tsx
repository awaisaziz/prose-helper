import Link from "next/link";
import { getCasesForLawyer } from "@/lib/db/lawyer-cases";
import { getDeadlinesForLawyer } from "@/lib/db/deadlines";
import { query } from "@/lib/db/index";

export const dynamic = "force-dynamic";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

type Priority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";

interface TriageItem {
  id: string;
  priority: Priority;
  category: string;
  title: string;
  subtitle: string;
  caseId: string;
  href: string;
  updatedAt: string;
}

const PRIORITY_ORDER: Priority[] = ["CRITICAL", "HIGH", "NORMAL", "LOW"];

const PRIORITY_STYLE: Record<Priority, { bg: string; text: string; border: string; dot: string }> = {
  CRITICAL: { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
  HIGH:     { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  NORMAL:   { bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200",    dot: "bg-sky-500"    },
  LOW:      { bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200",  dot: "bg-slate-400"  },
};

export default async function TriagePage() {
  const [cases, deadlines, pendingConnections] = await Promise.all([
    getCasesForLawyer(DEMO_LAWYER_ID),
    getDeadlinesForLawyer(DEMO_LAWYER_ID),
    query<{ case_id: string; client_name: string; created_at: string }>(
      `select cn.case_id, cl.full_name as client_name, cl.created_at
       from connections cn
       join clients cl on cl.id = cn.client_id
       where cn.lawyer_id = $1 and cn.status = 'requested'
       order by cl.created_at desc`,
      [DEMO_LAWYER_ID]
    ),
  ]);

  const items: TriageItem[] = [];

  // Overdue deadlines → CRITICAL
  for (const d of deadlines.filter((d) => d.status === "overdue" || (d.status === "pending" && new Date(d.due_date) < new Date()))) {
    items.push({
      id: `dl-${d.id}`,
      priority: "CRITICAL",
      category: "Overdue Deadline",
      title: d.title,
      subtitle: `${d.client_name} — due ${new Date(d.due_date).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}`,
      caseId: d.case_id,
      href: `/lawyer/case/${d.case_id}`,
      updatedAt: d.updated_at,
    });
  }

  // New submissions → HIGH
  for (const c of cases.filter((c) => c.status === "submitted")) {
    items.push({
      id: `cs-${c.id}`,
      priority: "HIGH",
      category: "New Submission",
      title: `Review Form 7A — ${c.client_name}`,
      subtitle: c.dispute_summary?.slice(0, 80) ?? "No summary",
      caseId: c.id,
      href: `/lawyer/case/${c.id}`,
      updatedAt: c.updated_at,
    });
  }

  // Client resubmissions after changes requested → HIGH
  for (const c of cases.filter((c) => c.status === "changes_requested")) {
    items.push({
      id: `cr-${c.id}`,
      priority: "HIGH",
      category: "Client Resubmitted",
      title: `Re-review edits — ${c.client_name}`,
      subtitle: c.dispute_summary?.slice(0, 80) ?? "No summary",
      caseId: c.id,
      href: `/lawyer/case/${c.id}`,
      updatedAt: c.updated_at,
    });
  }

  // Imminent deadlines (1-3 days) → HIGH
  const now = new Date();
  for (const d of deadlines.filter((d) => {
    if (d.status !== "pending") return false;
    const daysOut = Math.ceil((new Date(d.due_date).getTime() - now.getTime()) / 86_400_000);
    return daysOut >= 0 && daysOut <= 3;
  })) {
    const daysOut = Math.ceil((new Date(d.due_date).getTime() - now.getTime()) / 86_400_000);
    items.push({
      id: `imm-${d.id}`,
      priority: "HIGH",
      category: "Imminent Deadline",
      title: d.title,
      subtitle: `${d.client_name} — due ${daysOut === 0 ? "today" : daysOut === 1 ? "tomorrow" : `in ${daysOut}d`}`,
      caseId: d.case_id,
      href: `/lawyer/case/${d.case_id}`,
      updatedAt: d.updated_at,
    });
  }

  // Pending connection requests → NORMAL
  for (const cn of pendingConnections) {
    items.push({
      id: `conn-${cn.case_id}`,
      priority: "NORMAL",
      category: "Connection Request",
      title: `${cn.client_name} wants to connect`,
      subtitle: "Review case and accept or decline",
      caseId: cn.case_id,
      href: `/lawyer/case/${cn.case_id}`,
      updatedAt: cn.created_at,
    });
  }

  // In-review cases needing deadline → NORMAL
  for (const c of cases.filter((c) => c.status === "in_review" && c.overdue_count === 0 && c.imminent_count === 0)) {
    items.push({
      id: `ir-${c.id}`,
      priority: "NORMAL",
      category: "Set Filing Deadline",
      title: `Set deadline — ${c.client_name}`,
      subtitle: "Case is in review — add a filing deadline",
      caseId: c.id,
      href: `/lawyer/case/${c.id}`,
      updatedAt: c.updated_at,
    });
  }

  // Approved cases → LOW
  for (const c of cases.filter((c) => c.status === "approved")) {
    items.push({
      id: `ap-${c.id}`,
      priority: "LOW",
      category: "Ready to File",
      title: `File with clerk — ${c.client_name}`,
      subtitle: "Form 7A approved — ready to file at Small Claims Court",
      caseId: c.id,
      href: `/lawyer/case/${c.id}`,
      updatedAt: c.updated_at,
    });
  }

  const grouped = PRIORITY_ORDER.map((p) => ({
    priority: p,
    items: items.filter((i) => i.priority === p),
  })).filter((g) => g.items.length > 0);

  const SECTION_LABELS: Record<Priority, string> = {
    CRITICAL: "Critical — Requires Immediate Action",
    HIGH:     "High Priority",
    NORMAL:   "Normal",
    LOW:      "Low — When You Have Time",
  };

  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
          Lawyer Console
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Triage Inbox</h1>
        <p className="text-sm text-slate-500 mt-1">
          All actionable items across your matters, sorted by priority. Configure priority preferences in{" "}
          <Link href="/lawyer/profile" className="text-indigo-600 underline-offset-2 hover:underline">
            My Profile
          </Link>
          .
        </p>
      </div>

      {/* Summary strip */}
      <div className="mb-8 flex flex-wrap gap-3">
        {PRIORITY_ORDER.map((p) => {
          const count = items.filter((i) => i.priority === p).length;
          const s = PRIORITY_STYLE[p];
          return (
            <div key={p} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${s.bg} ${s.border}`}>
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              <span className={`text-xs font-bold ${s.text}`}>{p}</span>
              <span className={`text-lg font-extrabold ${s.text}`}>{count}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
          <span className="text-xs font-bold text-slate-500">TOTAL</span>
          <span className="text-lg font-extrabold text-slate-900">{items.length}</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <p className="text-2xl mb-2">✓</p>
          <p className="text-sm font-semibold text-slate-500">Inbox zero — all caught up!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ priority, items: groupItems }) => {
            const s = PRIORITY_STYLE[priority];
            return (
              <section key={priority}>
                <div className={`flex items-center gap-2 mb-3`}>
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <h2 className={`text-xs font-bold uppercase tracking-widest ${s.text}`}>
                    {SECTION_LABELS[priority]}
                  </h2>
                  <span className={`ml-auto rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.bg} ${s.border} ${s.text}`}>
                    {groupItems.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {groupItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-start justify-between gap-4 rounded-xl border bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition-all`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.bg} ${s.border} ${s.text}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{item.subtitle}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-slate-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
