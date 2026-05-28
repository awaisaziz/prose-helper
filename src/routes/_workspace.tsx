import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { WorkspaceProvider } from "@/lib/workspace-context";
import { TopBar } from "@/components/dictum/TopBar";
import { BriefModal } from "@/components/dictum/BriefModal";

export const Route = createFileRoute("/_workspace")({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-canvas text-ink">
        <TopBar />
        <main className="mx-auto max-w-[1320px] px-8 pb-24 pt-8">
          <Outlet />
        </main>
        <AnimatePresence>
          <BriefModal />
        </AnimatePresence>
      </div>
    </WorkspaceProvider>
  );
}
