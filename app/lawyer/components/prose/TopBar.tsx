import { Scale, Search, Bell, Settings } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { useWorkspace } from "@/lib/workspace-context";
import { PrimaryNav, ViewToggle } from "./Nav";

export function TopBar() {
  const { clientPing } = useWorkspace();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onLawyerSide = !pathname.startsWith("/client");

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-8 py-4">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-ink text-canvas">
              <Scale className="h-3.5 w-3.5" strokeWidth={2.25} />
            </div>
            <div className="leading-none">
              <div className="text-[15px] font-medium tracking-tight">
                prose<span className="text-ink-faint">OS</span>
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                prosehelper.ca
              </div>
            </div>
          </div>

          <PrimaryNav />
        </div>

        <div className="flex items-center gap-3">
          <ViewToggle />
          <div className="hidden h-7 w-px bg-hairline lg:block" />
          <button className="hidden h-9 w-9 place-items-center rounded-md text-ink-soft hover:bg-fog hover:text-ink lg:grid">
            <Search className="h-4 w-4" />
          </button>
          <button className="relative hidden h-9 w-9 place-items-center rounded-md text-ink-soft hover:bg-fog hover:text-ink lg:grid">
            <Bell className="h-4 w-4" />
            {clientPing && onLawyerSide && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#b3261e] pulse-dot" />
            )}
          </button>
          <button className="hidden h-9 w-9 place-items-center rounded-md text-ink-soft hover:bg-fog hover:text-ink lg:grid">
            <Settings className="h-4 w-4" />
          </button>
          <div className="ml-1 flex items-center gap-2.5 rounded-full border border-hairline py-1 pl-1 pr-3">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[10px] font-medium text-canvas">
              MA
            </div>
            <span className="text-[12px] text-ink-soft">Marcus Avery</span>
          </div>
        </div>
      </div>
    </header>
  );
}
