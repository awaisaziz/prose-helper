import type { CaseStrength } from "@/lib/ai/assess";
import { LegalSourceLink } from "./legal-source-link";

const CONFIGS: Record<CaseStrength, { bg: string; border: string; text: string; dot: string; label: string }> = {
  STRONG:   { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", label: "Strong" },
  MODERATE: { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   dot: "bg-amber-500",   label: "Moderate" },
  WEAK:     { bg: "bg-red-50",     border: "border-red-200",     text: "text-red-700",      dot: "bg-red-500",     label: "Weak" },
};

export function CaseStrengthBadge({
  strength,
  reasoning,
  go_no_go,
  governing_provision,
  governing_url,
}: {
  strength: CaseStrength;
  reasoning: string[];
  go_no_go: "proceed" | "caution";
  governing_provision?: string;
  governing_url?: string;
}) {
  const cfg = CONFIGS[strength];
  return (
    <div className="space-y-4">
      {/* Main badge */}
      <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-5`}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`h-3 w-3 rounded-full ${cfg.dot} shrink-0`} />
          <span className={`text-2xl font-extrabold tracking-tight ${cfg.text}`}>
            {cfg.label}
          </span>
          <span className="text-sm text-slate-500 font-medium">case strength</span>
        </div>
        <ul className="space-y-1.5">
          {reasoning.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.text}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-slate-400 italic">
          Reflects analogous decisions — not a guaranteed outcome. A licensed lawyer
          can give a definitive opinion.
        </p>
      </div>

      {/* Go/No-Go */}
      {go_no_go === "proceed" ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 shrink-0 mt-0.5"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-800">Recommendation: Proceed</p>
            <p className="text-xs text-blue-600 mt-0.5">
              The facts align well with the applicable law. Prepare your claim below.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 shrink-0 mt-0.5"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Caution: Consider legal advice first</p>
            <p className="text-xs text-amber-600 mt-0.5">
              This case may be harder to win based on comparable decisions. Speaking with a lawyer is recommended.
            </p>
          </div>
        </div>
      )}

      {/* Governing provision */}
      {governing_provision && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500 mb-1">Primary authority</p>
          <LegalSourceLink citation={governing_provision} url={governing_url} className="text-sm" />
        </div>
      )}
    </div>
  );
}
