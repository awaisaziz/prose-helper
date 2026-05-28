"use client";

const STEPS = [
  { n: 1, label: "Intake" },
  { n: 2, label: "Triage" },
  { n: 3, label: "Assessment" },
  { n: 4, label: "Prepare" },
  { n: 5, label: "Connect" },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Progress" className="border-b border-slate-200 bg-white">
      <ol className="mx-auto flex max-w-5xl items-center gap-0 px-6 overflow-x-auto">
        {STEPS.map((step, idx) => {
          const done    = step.n < current;
          const active  = step.n === current;
          return (
            <li key={step.n} className="flex flex-1 items-center min-w-0">
              <div className={`flex items-center gap-2 py-3 px-1 text-xs font-medium whitespace-nowrap
                ${active ? "text-blue-600" : done ? "text-slate-400" : "text-slate-400"}`}>
                {/* circle */}
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold border
                  ${active
                    ? "bg-blue-600 border-blue-600 text-white"
                    : done
                    ? "bg-slate-200 border-slate-200 text-slate-500"
                    : "bg-white border-slate-300 text-slate-400"}`}>
                  {done ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.n}
                </span>
                <span className={`hidden sm:inline ${active ? "text-blue-700 font-semibold" : ""}`}>
                  {step.label}
                </span>
              </div>
              {/* connector */}
              {idx < STEPS.length - 1 && (
                <div className={`mx-2 h-px flex-1 min-w-4 ${done ? "bg-slate-300" : "bg-slate-200"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
