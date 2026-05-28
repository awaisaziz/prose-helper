import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, CircleDot, Clock3, FileText, RefreshCw } from "lucide-react";
import { MATTERS } from "@/lib/prose-data";
import { useWorkspace } from "@/lib/workspace-context";

export function MatterDetail() {
  const { matterId } = useParams({ from: "/_workspace/matters/$matterId" });
  const matter = MATTERS.find((m) => m.id === matterId);
  const { clientPing } = useWorkspace();

  if (!matter) {
    return (
      <div className="rounded-3xl border border-hairline bg-canvas p-10">
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">Matter not found</div>
        <h1 className="font-serif mt-3 text-[40px]">Nothing here yet</h1>
        <p className="mt-2 max-w-md text-[14px] text-ink-soft">
          This matter file isn't part of the demo dataset. Head back to the matters list.
        </p>
        <Link to="/matters" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12px] text-canvas">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to matters
        </Link>
      </div>
    );
  }

  const isDrinkPure = matter.id === "dp-2025-0714";

  if (!isDrinkPure) {
    return (
      <div className="space-y-6">
        <Link to="/matters" className="inline-flex items-center gap-2 text-[12px] text-ink-soft hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> All matters
        </Link>
        <div className="rounded-3xl border border-hairline bg-canvas p-10">
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">{matter.practice} · {matter.stage}</div>
          <h1 className="font-serif mt-3 text-[48px] leading-tight">{matter.title}</h1>
          <div className="mt-2 text-[14px] text-ink-soft">{matter.client}</div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <StatCard label="Billed" value={`$${matter.billed.toLocaleString()}`} sub={`of $${matter.cap.toLocaleString()} cap`} />
            <StatCard label="Next action" value={matter.nextAction} sub={matter.nextDue} />
            <StatCard label="Last update" value={matter.updated} sub="auto-synced" />
          </div>
          <div className="mt-8 rounded-2xl bg-fog p-6 text-[13px] text-ink-soft">
            Detailed file view for this matter is queued for the next proseOS release.
            Until then, all activity flows through your inbox and calendar.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/matters" className="inline-flex items-center gap-2 text-[12px] text-ink-soft hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> All matters
      </Link>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            <span>Matter · DP-2025-0714</span>
            <span className="h-1 w-1 rounded-full bg-ink-faint" />
            <span>Litigation · Drafting</span>
          </div>
          <h1 className="font-serif mt-3 text-[52px] leading-[0.98] tracking-tight">
            DrinkPure vs. PackCo, Inc.
          </h1>
          <div className="mt-2 text-[14px] text-ink-soft">
            Client: Sarah Jenkins · Lead: Marcus Avery · Opened Jul 14
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/client" className="flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-[12px] text-ink-soft hover:bg-fog">
            <RefreshCw className="h-3.5 w-3.5" /> View client portal
          </Link>
          <button className="rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-canvas hover:bg-ink/90">
            Sign demand letter
          </button>
        </div>
      </div>

      {clientPing && (
        <div className="flex items-center justify-between rounded-2xl border border-ink bg-ink px-5 py-3 text-[13px] text-canvas">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-warm-mist pulse-dot" />
            Sarah Jenkins requested a proactive status update · 2 min ago
          </div>
          <button className="rounded-full bg-canvas px-3 py-1 text-[11px] font-medium text-ink">Acknowledge</button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <div className="rounded-3xl border border-hairline bg-canvas p-7">
            <h3 className="text-[13px] font-medium">Operations timeline</h3>
            <ol className="relative mt-5 pl-1">
              <span aria-hidden className="absolute left-[10px] top-2 bottom-2 w-px bg-hairline" />
              {[
                { state: "done", date: "Jul 14 · 09:15", title: "Intake accepted", sub: "Engagement letter sent", note: "Marcus Avery · auto-mirrored to client portal" },
                { state: "done", date: "Jul 15 · 14:00", title: "Onboarding call (15m)", sub: "Recorded · transcript indexed", note: "Scope agreed: vendor contract defense" },
                { state: "progress", date: "Jul 16 · 11:30", title: "Demand letter drafted by proseOS", sub: "Awaiting attorney signature", note: "Assembled from 4 PackCo precedents · est. 6h saved" },
                { state: "scheduled", date: "Jul 18 (est.)", title: "Formal demand delivery", sub: "Certified mail + email · auto-tracked", note: "" },
              ].map((s, i) => (
                <li key={i} className="relative grid grid-cols-12 gap-4 py-4">
                  <div className="col-span-12 flex items-start gap-3 md:col-span-4">
                    <StepDot state={s.state as "done" | "progress" | "scheduled"} />
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                        {s.state === "done" ? "✓ Verified" : s.state === "progress" ? "• In Progress" : "Scheduled"}
                      </div>
                      <div className="mt-1 text-[12px] tabular text-ink-soft">{s.date}</div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <div className={`text-[15px] ${s.state === "scheduled" ? "text-ink-faint" : "text-ink"}`}>{s.title}</div>
                    <div className="mt-1 text-[12px] text-ink-soft">{s.sub}</div>
                    {s.note && (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-fog px-2.5 py-1 text-[11px] text-ink-soft">
                        <FileText className="h-3 w-3" /> {s.note}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-hairline bg-canvas p-7">
            <h3 className="text-[13px] font-medium">Documents</h3>
            <ul className="mt-4 divide-y divide-hairline text-[13px]">
              {["Engagement letter.pdf", "Vendor contract — DrinkPure x PackCo.pdf", "Demand letter (draft v3).pdf", "Onboarding call transcript.md"].map((d) => (
                <li key={d} className="flex items-center justify-between py-3 text-ink-soft hover:text-ink">
                  <span className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> {d}</span>
                  <span className="text-[11px] text-ink-faint">Synced</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-4">
          <div className="rounded-3xl bg-warm-mist p-6">
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink/70">Exposure summary</div>
            <div className="mt-2 font-serif tabular text-[36px]">$35,000</div>
            <div className="text-[12px] text-ink/70">Claim value · liquidated damages clause</div>
            <div className="mt-5 border-t border-ink/10 pt-4 text-[12px] text-ink/75">
              <div className="flex justify-between"><span>Margin estimate</span><span className="tabular">$22,400</span></div>
              <div className="mt-1 flex justify-between"><span>Hours to recover</span><span className="tabular">~38h</span></div>
            </div>
          </div>

          <div className="rounded-3xl border border-hairline bg-canvas p-6">
            <h4 className="text-[13px] font-medium">Spend</h4>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="tabular font-serif text-[32px]">$1,840</span>
              <span className="text-[11px] text-ink-faint">of $4,200 retainer</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-fog">
              <div className="h-full w-[44%] rounded-full bg-ink" />
            </div>
            <Link to="/billing" className="mt-5 block rounded-full border border-hairline py-2 text-center text-[12px] text-ink-soft hover:bg-fog">
              Open billing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-hairline p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">{label}</div>
      <div className="mt-2 text-[18px] text-ink">{value}</div>
      {sub && <div className="text-[11px] text-ink-faint">{sub}</div>}
    </div>
  );
}

function StepDot({ state }: { state: "done" | "progress" | "scheduled" }) {
  if (state === "done")
    return (
      <span className="z-10 grid h-5 w-5 place-items-center rounded-full bg-ink text-canvas">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  if (state === "progress")
    return (
      <span className="z-10 grid h-5 w-5 place-items-center rounded-full bg-warm-mist">
        <CircleDot className="h-3 w-3 text-ink" />
      </span>
    );
  return (
    <span className="z-10 grid h-5 w-5 place-items-center rounded-full border border-hairline bg-canvas">
      <Clock3 className="h-3 w-3 text-ink-faint" />
    </span>
  );
}
