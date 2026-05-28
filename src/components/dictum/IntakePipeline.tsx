import { Sparkles, Mail } from "lucide-react";
import { LEADS, Lead } from "@/lib/dictum-data";
import { useWorkspace } from "@/lib/workspace-context";

const COLUMNS: { id: Lead["column"]; label: string; sub: string }[] = [
  { id: "new", label: "New", sub: "Unreviewed inbound" },
  { id: "brief", label: "Brief Generated", sub: "Awaiting attorney review" },
  { id: "engagement", label: "Engagement Sent", sub: "Awaiting signature" },
  { id: "converted", label: "Converted", sub: "Active matter" },
];

export function IntakePipeline() {
  const { openBrief, intakeStatus } = useWorkspace();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Synced with ai.dictumhq.com · last poll 14s ago
          </div>
          <h1 className="font-serif mt-3 text-[56px] leading-[0.98] tracking-tight">Intake Pipeline</h1>
          <p className="mt-3 max-w-xl text-[14px] text-ink-soft">
            Every inbound lead, scored for fit and margin. Approve once, and dictumOS handles the engagement sequence.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-ink-faint">
          <span className="rounded-full bg-fog px-3 py-1.5">7 active leads</span>
          <span className="rounded-full bg-fog px-3 py-1.5">Avg. score 79</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = LEADS.filter((l) => {
            if (col.id === "converted" && intakeStatus === "accepted") {
              return l.column === "converted" || l.id === "sarah-jenkins";
            }
            if (col.id === "new" && intakeStatus === "accepted") {
              return l.column === "new" && l.id !== "sarah-jenkins";
            }
            return l.column === col.id;
          });
          return (
            <div key={col.id} className="rounded-3xl border border-hairline bg-canvas p-4">
              <div className="flex items-center justify-between px-2 pb-3">
                <div>
                  <div className="text-[12px] font-medium text-ink">{col.label}</div>
                  <div className="text-[11px] text-ink-faint">{col.sub}</div>
                </div>
                <span className="rounded-full bg-fog px-2 py-0.5 text-[10px] tabular text-ink-soft">{items.length}</span>
              </div>
              <div className="space-y-3">
                {items.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    highlight={lead.id === "sarah-jenkins" && intakeStatus === "pending"}
                    onClick={lead.id === "sarah-jenkins" ? openBrief : undefined}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeadCard({ lead, highlight, onClick }: { lead: Lead; highlight?: boolean; onClick?: () => void }) {
  const Wrapper: "button" | "div" = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={`block w-full rounded-2xl p-4 text-left transition ${
        highlight
          ? "bg-warm-mist hover:bg-warm-mist-deep/70"
          : "bg-fog hover:bg-fog/70"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium text-ink">{lead.name}</div>
          <div className="truncate text-[11px] text-ink-soft">
            {lead.company ? `${lead.company} · ` : ""}{lead.dispute}
          </div>
        </div>
        <span className="tabular rounded-full bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-ink">
          {lead.score}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-soft">
        <span className="tabular">${lead.claim.toLocaleString()}</span>
        <span className="flex items-center gap-1 text-ink-faint">
          <Mail className="h-3 w-3" /> {lead.email.split("@")[1]}
        </span>
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-wider text-ink-faint">{lead.lastAction}</div>
      {highlight && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-2 py-1 text-[10px] font-medium text-canvas">
          <Sparkles className="h-2.5 w-2.5" /> Open brief
        </div>
      )}
    </Wrapper>
  );
}
