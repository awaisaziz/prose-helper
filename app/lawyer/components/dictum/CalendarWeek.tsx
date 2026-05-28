import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { CAL_EVENTS, CalEvent, DEADLINES } from "@/lib/dictum-data";

const DAYS = ["Mon 14", "Tue 15", "Wed 16", "Thu 17", "Fri 18"];
const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 8..18
const HOUR_PX = 56;
const TODAY = 2; // Wed

export function CalendarWeek() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">Week 29 · 5 working days</div>
          <h1 className="font-serif mt-3 text-[56px] leading-[0.98] tracking-tight">Week of Jul 14</h1>
          <p className="mt-3 max-w-xl text-[14px] text-ink-soft">
            Every block linked to a matter. Signoffs in Warm Mist need your eyes today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <button className="rounded-full border border-hairline px-3 py-1.5 text-ink-soft hover:bg-fog">‹ Prev</button>
          <button className="rounded-full border border-hairline px-3 py-1.5 text-ink-soft hover:bg-fog">Today</button>
          <button className="rounded-full border border-hairline px-3 py-1.5 text-ink-soft hover:bg-fog">Next ›</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          <div className="overflow-hidden rounded-3xl border border-hairline bg-canvas">
            <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-hairline">
              <div />
              {DAYS.map((d, i) => (
                <div
                  key={d}
                  className={`px-3 py-3 text-[11px] uppercase tracking-[0.16em] ${
                    i === TODAY ? "bg-fog text-ink" : "text-ink-faint"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="relative grid grid-cols-[60px_repeat(5,1fr)]">
              <div>
                {HOURS.map((h) => (
                  <div key={h} style={{ height: HOUR_PX }} className="border-b border-hairline pr-2 pt-1 text-right text-[10px] tabular text-ink-faint">
                    {h % 12 === 0 ? 12 : h % 12}{h < 12 ? "a" : "p"}
                  </div>
                ))}
              </div>
              {DAYS.map((_, di) => (
                <div key={di} className="relative border-l border-hairline">
                  {HOURS.map((h) => (
                    <div key={h} style={{ height: HOUR_PX }} className="border-b border-hairline" />
                  ))}
                  {CAL_EVENTS.filter((e) => e.day === di).map((e, i) => (
                    <EventBlock key={i} ev={e} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-3">
          <div className="rounded-3xl border border-hairline bg-canvas p-5">
            <h3 className="text-[13px] font-medium">Upcoming deadlines</h3>
            <ul className="mt-4 space-y-3">
              {DEADLINES.map((d) => (
                <li key={d.title}>
                  <Link
                    to="/matters/$matterId"
                    params={{ matterId: d.matterId }}
                    className="block rounded-xl border border-hairline p-3 hover:bg-fog/60"
                  >
                    <div className="flex items-center gap-2 text-[11px] tabular text-ink-faint">
                      <AlertTriangle className="h-3 w-3" /> {d.date}
                    </div>
                    <div className="mt-1 text-[13px] text-ink">{d.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-warm-mist p-5">
            <h3 className="text-[13px] font-medium text-ink">Awaiting signature today</h3>
            <p className="mt-2 text-[12px] text-ink/70">
              Demand letter for DrinkPure vs. PackCo is drafted and queued at 4:45p.
            </p>
            <Link
              to="/matters/$matterId"
              params={{ matterId: "dp-2025-0714" }}
              className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-[12px] text-canvas"
            >
              Open matter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventBlock({ ev }: { ev: CalEvent }) {
  const top = (ev.start - 8) * HOUR_PX;
  const height = Math.max(28, (ev.end - ev.start) * HOUR_PX);
  const styles = {
    court: "bg-ink text-canvas",
    client: "bg-canvas border border-ink/15 text-ink",
    internal: "bg-fog border border-hairline text-ink",
    signoff: "bg-warm-mist text-ink",
  }[ev.type];

  const content = (
    <div
      style={{ top, height }}
      className={`absolute inset-x-1.5 overflow-hidden rounded-lg px-2 py-1.5 text-[11px] leading-tight ${styles} ${ev.matterId ? "cursor-pointer hover:translate-y-px transition-transform" : ""}`}
    >
      <div className="truncate font-medium">{ev.title}</div>
      <div className="truncate opacity-70 text-[10px]">
        {fmt(ev.start)}–{fmt(ev.end)}
      </div>
    </div>
  );

  if (ev.matterId) {
    return (
      <Link to="/matters/$matterId" params={{ matterId: ev.matterId }} className="contents">
        {content}
      </Link>
    );
  }
  return content;
}

function fmt(h: number) {
  const hr = Math.floor(h);
  const m = Math.round((h - hr) * 60);
  const suffix = hr >= 12 ? "p" : "a";
  const display = hr % 12 === 0 ? 12 : hr % 12;
  return `${display}${m ? ":" + String(m).padStart(2, "0") : ""}${suffix}`;
}
