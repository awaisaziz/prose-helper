import { Link } from "@tanstack/react-router";
import { Filter as FilterIcon, Search, Sparkles, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { MATTERS, Matter } from "@/lib/dictum-data";
import { useWorkspace } from "@/lib/workspace-context";

const FILTERS = ["All", "Litigation", "Advisory", "IP", "Estate", "Closed"] as const;
type FilterKey = (typeof FILTERS)[number];

export function MattersTable() {
  const [filter, setFilter] = useState<FilterKey>("All");
  const { clientPing } = useWorkspace();



  const rows = MATTERS.filter((m) => {
    if (filter === "All") return m.stage !== "Closed";
    if (filter === "Closed") return m.stage === "Closed";
    return m.practice === filter;
  });

  const openCount = MATTERS.filter((m) => m.stage !== "Closed").length;
  const discoveryCount = MATTERS.filter((m) => m.stage === "Discovery").length;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Active book · synced from Clio + email
          </div>
          <h1 className="font-serif mt-3 text-[56px] leading-[0.98] tracking-tight">Active Matters</h1>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-soft">
            <Chip>{openCount} open</Chip>
            <Chip>{discoveryCount} in discovery</Chip>
            <Chip tone={clientPing ? "warm" : "default"}>
              {clientPing ? "1 awaiting client response" : "0 awaiting client"}
            </Chip>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-hairline px-3 py-1.5 text-[12px] text-ink-faint">
            <Search className="h-3.5 w-3.5" />
            <span>Search matters</span>
          </div>
          <button className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-canvas hover:bg-ink/90">
            <Sparkles className="h-3.5 w-3.5" />
            New matter
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-full border border-hairline bg-canvas p-1 text-[12px] w-fit">
        <FilterIcon className="ml-2 h-3.5 w-3.5 text-ink-faint" />

        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 transition ${
              filter === f ? "bg-ink text-canvas" : "text-ink-soft hover:bg-fog"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-hairline bg-canvas">
        <div className="grid grid-cols-12 gap-4 border-b border-hairline px-6 py-3 text-[10px] uppercase tracking-[0.16em] text-ink-faint">
          <div className="col-span-4">Matter</div>
          <div className="col-span-2">Stage</div>
          <div className="col-span-3">Next action</div>
          <div className="col-span-2 text-right">Billed / Cap</div>
          <div className="col-span-1 text-right">Updated</div>
        </div>
        <ul className="divide-y divide-hairline">
          {rows.map((m) => (
            <MatterRow key={m.id} m={m} clientPing={clientPing && m.flagClient} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function MatterRow({ m, clientPing }: { m: Matter; clientPing?: boolean }) {
  const pct = Math.round((m.billed / m.cap) * 100);
  return (
    <li>
      <Link
        to="/matters/$matterId"
        params={{ matterId: m.id }}
        className="group grid grid-cols-12 items-center gap-4 px-6 py-4 hover:bg-fog/70"
      >
        <div className="col-span-4 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-[14px] font-medium text-ink">{m.title}</span>
            {clientPing && (
              <span className="rounded-full bg-ink px-2 py-0.5 text-[9px] uppercase tracking-wider text-canvas">
                Client awaiting update
              </span>
            )}
          </div>
          <div className="mt-1 text-[12px] text-ink-faint">
            {m.client} · {m.practice}
          </div>
        </div>
        <div className="col-span-2">
          <StageTag stage={m.stage} />
        </div>
        <div className="col-span-3">
          <div className="truncate text-[13px] text-ink-soft">{m.nextAction}</div>
          <div className="text-[11px] text-ink-faint">{m.nextDue}</div>
        </div>
        <div className="col-span-2 text-right">
          <div className="tabular text-[13px] text-ink">
            ${m.billed.toLocaleString()} <span className="text-ink-faint">/ ${m.cap.toLocaleString()}</span>
          </div>
          <div className="ml-auto mt-1.5 h-1 w-24 overflow-hidden rounded-full bg-fog">
            <div className="h-full rounded-full bg-ink" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
        </div>
        <div className="col-span-1 flex items-center justify-end gap-1 text-[11px] tabular text-ink-faint">
          {m.updated}
          <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </Link>
    </li>
  );
}

function Chip({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "warm" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] ${
        tone === "warm" ? "bg-warm-mist text-ink" : "bg-fog text-ink-soft"
      }`}
    >
      {children}
    </span>
  );
}

function StageTag({ stage }: { stage: Matter["stage"] }) {
  const map: Record<Matter["stage"], string> = {
    Intake: "bg-fog text-ink-soft",
    Drafting: "bg-warm-mist text-ink",
    Discovery: "bg-fog text-ink",
    Negotiation: "bg-fog text-ink",
    "Trial Prep": "bg-ink text-canvas",
    Closed: "bg-transparent text-ink-faint border border-hairline",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${map[stage]}`}>
      {stage}
    </span>
  );
}
