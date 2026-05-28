import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Se Helper — Ontario Small Claims AI Co-Counsel",
  description:
    "AI co-counsel for self-represented litigants in Ontario Small Claims Court. Draft claims, know your rights, get lawyer sign-off.",
};

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-slate-50 text-slate-800 selection:bg-blue-500/20 selection:text-blue-900">
      {/* ── Soft premium background glows (light theme) ── */}
      <div aria-hidden className="pointer-events-none select-none fixed inset-0 z-0 opacity-40">
        <div className="absolute -top-32 left-1/4 w-[480px] h-[480px] rounded-full bg-blue-300/30 blur-[130px]" />
        <div className="absolute top-10 right-1/4 w-[360px] h-[360px] rounded-full bg-indigo-300/25 blur-[110px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none z-0" />

      {/* ══════════════════════════════════════
          NAV
      ══════════════════════════════════════ */}
      <header className="relative z-20 border-b border-slate-200 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Brand — left side */}
          <div className="flex items-center gap-3">
            {/* Logo mark - clean scale icon */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-600/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4.5 w-4.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v17M3 12h18m-3-4l3 4-3 4M6 8L3 12l3 4"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                Pro Se Helper
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wide">
                Ontario Small Claims AI Co-Counsel
              </span>
            </div>
          </div>

          {/* Right side — status pill */}
          <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
            </span>
            Demo Portal
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          HERO & PORTALS
      ══════════════════════════════════════ */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl">
          {/* Eyebrow */}
          <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-blue-600">
            Ontario Small Claims Court · Civil Money Disputes
          </p>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Your AI co-counsel
            </span>
            <br />
            <span className="text-slate-700 font-light">for Small Claims Court.</span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Pro Se Helper guides self-represented litigants through every step of an
            Ontario debt or money dispute up to **$50,000** — from initial rights assessment to a lawyer-reviewed
            Plaintiff&apos;s Claim (Form 7A).
          </p>

          {/* ── Portal cards ── */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
            {/* Client */}
            <Link
              href="/client/dashboard"
              id="portal-client-card"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div>
                {/* Icon row */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    Client Portal
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2 transition-colors group-hover:text-blue-600">
                    I&apos;m a Client
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Describe your dispute, understand your legal rights and remedies under
                    Ontario law, and build your Plaintiff&apos;s Claim — ready for lawyer
                    sign-off.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {[
                      "Guided dispute intake chatbot",
                      "Rights & remedies breakdown",
                      "Form 7A claim generator",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-600 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors group-hover:text-blue-700">
                Enter Client Portal
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>

            {/* Lawyer */}
            <Link
              href="/lawyer/dashboard"
              id="portal-lawyer-card"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div>
                {/* Icon row */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                    Lawyer Console
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2 transition-colors group-hover:text-indigo-600">
                    I&apos;m a Lawyer
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Review client-submitted claims, verify every legal citation, approve
                    filings, and track all active procedural deadlines with the Deadline
                    Guardian.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {[
                      "Real-time review queue",
                      "Automated e-Laws search validation",
                      "Deadline Guardian alerts (Phase 6)",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-indigo-600 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition-colors group-hover:text-indigo-700">
                Open Lawyer Console
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </div>

          {/* ══════════════════════════════════════
              JURISDICTION GUIDE
          ══════════════════════════════════════ */}
          <section className="max-w-4xl mx-auto mt-20 rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 text-center md:text-left">
                <div className="inline-flex rounded-2xl bg-blue-50 border border-blue-100 p-4 mb-4 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Court Guidelines</h3>
                <p className="text-slate-500 text-sm font-normal leading-relaxed">
                  Rules and limitations governing the Ontario Small Claims Court.
                </p>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/50">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    Claim Limit
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 mb-1">$50,000 CAD</div>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    Max financial limit. Excludes interests and lawyer representative costs.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/50">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    Scope of Action
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 mb-1">Debt & Damage</div>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    Includes unpaid contracts, property damages, deposits, and services.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/50">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    Limitation Frame
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 mb-1">2 Years</div>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    Standard limitation timeframe in Ontario to register your claim.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/50">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    Initiation File
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 mb-1">Form 7A Claim</div>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    The principal court application file drafted to request legal remedy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════
              ROADMAP
          ══════════════════════════════════════ */}
          <section className="max-w-4xl mx-auto mt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Development Roadmap</h3>
              <p className="text-sm text-slate-500 font-normal">
                Development status and key phases mapped out in the Pro Se Helper application.
              </p>
            </div>
            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-8">
              {/* Phase 0 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[11px] top-1.5 flex items-center justify-center rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 w-5 h-5 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Phase 0: Core Architecture & Setup
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mt-1">
                      Full-stack Next.js client & lawyer structures, PostgreSQL data integrations, seed records, and mock dashboards are fully functional.
                    </p>
                  </div>
                  <span className="self-start text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">
                    Active
                  </span>
                </div>
              </div>

              {/* Phase 1 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[7px] top-5 rounded-full bg-blue-600 ring-4 ring-blue-50 w-3 h-3" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Phases 1–3: Intake Assessment & e-Laws Vector
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mt-1">
                      Chatbot intake flow, AI rights evaluation, Ontario e-Laws vector ingestion, and vector search matching systems.
                    </p>
                  </div>
                  <span className="self-start text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700">
                    Planned
                  </span>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[5px] top-5 rounded-full bg-slate-300 w-2.5 h-2.5" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 bg-white/70 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div>
                    <h4 className="text-base font-bold text-slate-700">
                      Phases 4–5: Interactive Form 7A Claim Editor
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mt-1">
                      Online form claim builder interface with direct AI tips and output downloads as formal fillable PDFs.
                    </p>
                  </div>
                  <span className="self-start text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                    Planned
                  </span>
                </div>
              </div>

              {/* Phase 6 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[5px] top-5 rounded-full bg-slate-300 w-2.5 h-2.5" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 bg-white/70 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div>
                    <h4 className="text-base font-bold text-slate-700">
                      Phase 6: Deadline Guardian
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mt-1">
                      Rules-based legal calendar calculator tracking court events and sending push email alerts to dashboards.
                    </p>
                  </div>
                  <span className="self-start text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                    Planned
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimer & Warning */}
          <div className="mt-14 max-w-4xl mx-auto">
            <Disclaimer />
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-8 px-6 mt-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <span className="text-xs text-slate-500 font-semibold">
            Pro Se Helper — a Lexiden demonstration product
          </span>
          <span className="text-xs text-slate-400">
            © {new Date().getFullYear()} Pro Se Helper. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
