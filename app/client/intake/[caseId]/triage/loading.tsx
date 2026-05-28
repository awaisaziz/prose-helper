import { StepIndicator } from "@/components/client/step-indicator";

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

export default function TriageLoading() {
  return (
    <>
      <StepIndicator current={2} />

      <main className="mx-auto max-w-xl px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-5">
          {/* Animated icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-600/30">
            <svg className="h-7 w-7 text-white animate-spin" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">Triaging your dispute…</p>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Determining whether your matter falls within Ontario Small Claims Court jurisdiction.
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
