import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Calendar, FileText, Mail, PencilLine } from "lucide-react";
import { TIME_ENTRIES, MATTERS } from "@/lib/dictum-data";

export function BillingPanel() {
  const totalHours = TIME_ENTRIES.reduce((s, e) => s + e.duration, 0);
  const goal = 15;
  const pct = Math.min(100, Math.round((totalHours / goal) * 100));
  const totalAmount = TIME_ENTRIES.reduce((s, e) => s + e.duration * e.rate, 0);

  const retainers = MATTERS.filter((m) => m.stage !== "Closed")
    .slice(0, 5)
    .map((m) => ({ ...m, pct: Math.round((m.billed / m.cap) * 100) }));

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">Week 29 · Jul 14 – Jul 20</div>
          <h1 className="font-serif mt-3 text-[56px] leading-[0.98] tracking-tight">Billing & Time</h1>
          <p className="mt-3 max-w-xl text-[14px] text-ink-soft">
            Captured automatically from your inbox, calendar, and signed documents. Review, edit, send.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-hairline px-4 py-2 text-[12px] text-ink-soft hover:bg-fog">
            Export timesheet
          </button>
          <button className="rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-canvas hover:bg-ink/90">
            Send 2 invoices
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-3xl border border-hairline bg-canvas p-7">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[12px] text-ink-soft">Weekly billable</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="tabular font-serif text-[64px] leading-none">{totalHours.toFixed(1)}</span>
                  <span className="text-[16px] text-ink-faint">/ {goal.toFixed(1)}h</span>
                </div>
                <div className="mt-1 text-[12px] text-success">+3.2h vs last week</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">Captured value</div>
                <div className="tabular font-serif text-[40px] leading-none">${totalAmount.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-fog">
              <div className="h-full rounded-full bg-ink" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-ink-faint">
              <span>0h</span><span>{pct}% to goal</span><span>{goal}h</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-3xl bg-warm-mist p-7">
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink/70">Draft invoices ready</div>
            <div className="mt-3 font-serif text-[28px] tabular">2 · $4,720</div>
            <p className="mt-1 text-[12px] text-ink/70">DrinkPure · Hollis Estate</p>
            <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12px] text-canvas">
              Review & send <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-3xl border border-hairline bg-canvas">
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <h3 className="text-[13px] font-medium">Auto-captured time entries</h3>
              <span className="text-[11px] text-ink-faint">{TIME_ENTRIES.length} this week</span>
            </div>
            <div className="grid grid-cols-12 gap-4 border-b border-hairline px-6 py-2.5 text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              <div className="col-span-2">Date</div>
              <div className="col-span-4">Matter</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-2 text-right">Duration</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            <ul className="divide-y divide-hairline">
              {TIME_ENTRIES.map((e, i) => (
                <li key={i} className="grid grid-cols-12 items-center gap-4 px-6 py-3 hover:bg-fog/60">
                  <div className="col-span-2 text-[12px] tabular text-ink-soft">{e.date}</div>
                  <div className="col-span-4 truncate text-[13px] text-ink">{e.matterTitle}</div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-fog px-2 py-1 text-[10px] uppercase tracking-wider text-ink-soft">
                      <SourceIcon source={e.source} /> {e.source}
                    </span>
                  </div>
                  <div className="col-span-2 text-right tabular text-[13px]">{e.duration.toFixed(2)}h</div>
                  <div className="col-span-2 text-right tabular text-[13px] text-ink">
                    ${(e.duration * e.rate).toFixed(0)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-12 space-y-3 lg:col-span-4">
          <div className="rounded-3xl border border-hairline bg-canvas p-5">
            <h3 className="text-[13px] font-medium">Retainer balances</h3>
            <ul className="mt-4 space-y-4">
              {retainers.map((r) => (
                <li key={r.id}>
                  <div className="flex items-center justify-between text-[12px]">
                    <Link to="/matters/$matterId" params={{ matterId: r.id }} className="truncate text-ink hover:underline">
                      {r.client}
                    </Link>
                    <span className="tabular text-ink-soft">
                      ${r.billed.toLocaleString()} / ${r.cap.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-fog">
                    <div
                      className={`h-full rounded-full ${r.pct > 80 ? "bg-warm-mist-deep" : "bg-ink"}`}
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-5 w-full rounded-full border border-hairline py-2 text-[12px] text-ink-soft hover:bg-fog">
              Request top-ups
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceIcon({ source }: { source: "Email" | "Calendar" | "Manual" }) {
  if (source === "Email") return <Mail className="h-2.5 w-2.5" />;
  if (source === "Calendar") return <Calendar className="h-2.5 w-2.5" />;
  return <PencilLine className="h-2.5 w-2.5" />;
}
