import { ArrowUpRight, CalendarClock, ChevronRight, Inbox, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useWorkspace } from "@/lib/workspace-context";

export function FirmOverview() {
  const { openBrief, intakeStatus, clientPing } = useWorkspace();

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            <span>Week 29 · Jul 14 – Jul 20</span>
            <span className="h-1 w-1 rounded-full bg-ink-faint" />
            <span>Synced 2 min ago</span>
          </div>
          <h1 className="font-serif mt-3 text-[64px] leading-[0.95] tracking-tight">
            Firm Overview
          </h1>
          <p className="mt-3 max-w-xl text-[14px] text-ink-soft">
            Your week, parsed from every connected inbox, calendar, and matter file —
            ranked by urgency, summarized for action.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-hairline px-4 py-2 text-[12px] text-ink-soft hover:bg-fog">
            Export brief
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-canvas hover:bg-ink/90">
            <Sparkles className="h-3.5 w-3.5" />
            New matter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl bg-warm-mist p-8">
            <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-warm-mist-deep/40 blur-2xl" />
            <div className="relative flex items-start justify-between gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/70">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-ink text-canvas">
                    <Sparkles className="h-2.5 w-2.5" />
                  </span>
                  {intakeStatus === "accepted" ? "Active Matter · Engagement Sent" : "Urgent New Inbound Lead"}
                </div>
                <h2 className="font-serif mt-4 text-[36px] leading-[1.05] tracking-tight">
                  Sarah Jenkins
                  <span className="text-ink/55"> · DrinkPure</span>
                </h2>
                <p className="mt-2 text-[14px] text-ink/70">
                  {intakeStatus === "accepted"
                    ? "Engagement letter dispatched. Onboarding call calendared."
                    : "Unreviewed brief routed from prosehelper.ca"} · Estimated claim
                  <span className="font-medium text-ink"> $35,000.00</span> · Vendor contract dispute
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={openBrief}
                    className="group flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-canvas transition hover:bg-ink/90"
                  >
                    {intakeStatus === "accepted" ? "View matter brief" : "Open automated brief"}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                  </button>
                  <Link to="/matters/$matterId" params={{ matterId: "dp-2025-0714" }} className="rounded-full border border-ink/15 px-5 py-2.5 text-[13px] text-ink/80 hover:bg-canvas/50">
                    Open file
                  </Link>
                </div>
              </div>
              <div className="hidden flex-col gap-2 text-right md:flex">
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink/55">Match score</span>
                <span className="font-serif text-[56px] leading-none tracking-tight">94</span>
                <span className="text-[11px] text-ink/55">High-margin · Litigation fit</span>
              </div>
            </div>
          </div>
        </div>

        <MetricsPanel pendingInquiries={clientPing ? 1 : 0} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <InboxTriage clientPing={clientPing} />
        <TodayPanel />
      </div>
    </div>
  );
}

function MetricsPanel({ pendingInquiries }: { pendingInquiries: number }) {
  const rows = [
    { label: "Weekly Billable Target", value: "11.4", unit: "h", sub: "of 15.0h goal", pct: 76 },
    { label: "Active Litigation Matters", value: "12", unit: "files", sub: "3 in discovery", pct: 100 },
    {
      label: "Pending Client Inquiries",
      value: String(pendingInquiries),
      unit: "",
      sub: pendingInquiries > 0 ? "Sarah Jenkins requested update" : "Inbox triaged",
      pct: pendingInquiries > 0 ? 30 : 100,
    },
  ];
  return (
    <div className="col-span-12 lg:col-span-5">
      <div className="h-full rounded-3xl border border-hairline bg-canvas p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-medium">This week</h3>
          <button className="text-[11px] text-ink-faint hover:text-ink">Configure metrics</button>
        </div>
        <div className="mt-4 divide-y divide-hairline">
          {rows.map((r) => (
            <div key={r.label} className="py-4">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-[12px] text-ink-soft">{r.label}</div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="tabular text-[28px] font-medium leading-none tracking-tight">{r.value}</span>
                    {r.unit && <span className="text-[12px] text-ink-faint">{r.unit}</span>}
                  </div>
                  <div className="mt-1 text-[11px] text-ink-faint">{r.sub}</div>
                </div>
                <div className="w-24">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-fog">
                    <div className="h-full rounded-full bg-ink" style={{ width: `${r.pct}%` }} />
                  </div>
                  <div className="mt-1 text-right text-[10px] tabular text-ink-faint">{r.pct}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InboxTriage({ clientPing }: { clientPing: boolean }) {
  const items = [
    { from: "Sarah Jenkins", domain: "drinkpure.com", subject: "Vendor cancellation — need urgent counsel", tag: "New Lead", tone: "warm" as const, time: "08:42" },
    { from: "Janine Wu", domain: "drinkpure.com", subject: "Request: proactive status update on PackCo matter", tag: clientPing ? "Client Ping" : "Client", tone: clientPing ? ("urgent" as const) : ("muted" as const), time: "11:08" },
    { from: "Hon. R. Mendez (Clerk)", domain: "courts.gov", subject: "Motion to compel — set for 07/22", tag: "Court", tone: "muted" as const, time: "10:14" },
    { from: "Theo Hart", domain: "packco.com", subject: "Counterproposal on liquidated damages clause", tag: "Opposing", tone: "muted" as const, time: "Yesterday" },
  ];
  return (
    <div className="col-span-12 lg:col-span-8">
      <div className="rounded-3xl border border-hairline bg-canvas">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-ink-soft" />
            <h3 className="text-[13px] font-medium">Triaged inbox</h3>
            <span className="rounded-full bg-fog px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-soft">4 items</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-ink-faint">
            <span>Parsed from 3 connected accounts</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
        <ul className="divide-y divide-hairline">
          {items.map((it, i) => (
            <li key={i} className="group grid grid-cols-12 items-center gap-4 px-6 py-4 hover:bg-fog/70">
              <div className="col-span-3 flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-fog text-[11px] font-medium text-ink-soft">
                  {it.from.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium">{it.from}</div>
                  <div className="truncate text-[11px] text-ink-faint">{it.domain}</div>
                </div>
              </div>
              <div className="col-span-6 truncate text-[13px] text-ink-soft">{it.subject}</div>
              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                  it.tone === "warm" ? "bg-warm-mist text-ink" : it.tone === "urgent" ? "bg-ink text-canvas" : "bg-fog text-ink-soft"
                }`}>
                  {it.tone === "urgent" && <span className="h-1.5 w-1.5 rounded-full bg-canvas" />}
                  {it.tag}
                </span>
              </div>
              <div className="col-span-1 text-right text-[11px] tabular text-ink-faint">{it.time}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TodayPanel() {
  const events = [
    { time: "10:00", title: "Mendez ruling review", meta: "Solo · 30 min" },
    { time: "13:30", title: "DrinkPure — discovery prep", meta: "with Avery, K." },
    { time: "15:00", title: "Intake call: prospective IP matter", meta: "Zoom" },
    { time: "16:45", title: "Sign demand letter (PackCo)", meta: "proseOS draft" },
  ];
  return (
    <div className="col-span-12 lg:col-span-4">
      <div className="h-full rounded-3xl border border-hairline bg-canvas p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-ink-soft" />
            <h3 className="text-[13px] font-medium">Today · Wed Jul 16</h3>
          </div>
          <span className="text-[11px] text-ink-faint">4 blocks</span>
        </div>
        <ul className="mt-4 space-y-3">
          {events.map((e, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl border border-transparent p-2 hover:border-hairline">
              <div className="w-12 shrink-0 pt-0.5 text-right tabular text-[12px] text-ink-faint">{e.time}</div>
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
              <div className="min-w-0">
                <div className="truncate text-[13px] text-ink">{e.title}</div>
                <div className="truncate text-[11px] text-ink-faint">{e.meta}</div>
              </div>
            </li>
          ))}
        </ul>
        <Link to="/calendar" className="mt-5 block rounded-full border border-hairline py-2 text-center text-[12px] text-ink-soft hover:bg-fog">
          Open calendar
        </Link>
      </div>
    </div>
  );
}
