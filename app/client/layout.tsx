import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { LegalSourcesFooter } from "@/components/client/legal-source-link";
import { NotificationsBell } from "@/components/client/notifications-bell";
import { getClientProfile } from "@/lib/db/profile";

const DEMO_CLIENT_ID = "00000000-0000-0000-0000-0000000000a1";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  // Load demo client for the avatar — soft-fail if DB is down
  let clientName = "SP";
  try {
    const profile = await getClientProfile(DEMO_CLIENT_ID);
    if (profile) clientName = initials(profile.full_name);
  } catch {
    // DB not up — avatar falls back to initials placeholder
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 shadow shadow-blue-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h12" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Pro Se Helper</span>
          </Link>

          {/* Right side nav items */}
          <div className="flex items-center gap-3">
            <Link href="/client/dashboard"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
              My Cases
            </Link>

            {/* Notifications */}
            <NotificationsBell />

            {/* Profile avatar */}
            <Link
              href="/client/profile"
              title="Your profile"
              className="group flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[11px] font-extrabold text-white shadow shadow-blue-500/20 ring-2 ring-white hover:ring-blue-200 transition-all"
            >
              {clientName}
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Disclaimer />
        </div>
        <LegalSourcesFooter />
      </footer>
    </div>
  );
}
