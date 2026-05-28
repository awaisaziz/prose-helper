import type { RightsRemedies } from "@/lib/ai/assess";
import { LegalSourceLink } from "./legal-source-link";

export function RightsCard({ rr }: { rr: RightsRemedies }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
        <h3 className="text-sm font-semibold text-slate-800">Rights &amp; Remedies</h3>
      </div>
      <div className="px-5 py-4 space-y-4">
        {/* Right violated */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Right Violated
          </p>
          <p className="text-sm text-slate-800">{rr.right_violated}</p>
        </div>

        {/* Governing provision */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Governing Authority
          </p>
          <LegalSourceLink citation={rr.governing_provision} url={rr.governing_url} className="text-sm" />
        </div>

        {/* Remedy */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Remedy
          </p>
          <p className="text-sm text-emerald-700 font-medium">{rr.remedy}</p>
        </div>

        {/* Elements to prove */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            What You Must Prove
          </p>
          <ol className="space-y-1.5">
            {rr.elements_to_prove.map((el, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                  {i + 1}
                </span>
                {el}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
