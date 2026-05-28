import { LawyerSidebar } from "@/components/lawyer/lawyer-sidebar";
import { Disclaimer } from "@/components/disclaimer";

export default function LawyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <LawyerSidebar />

      {/* Main content offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-60 min-h-screen">
        <div className="flex-1">{children}</div>

        <footer className="border-t border-slate-100 bg-white">
          <div className="px-8 py-4">
            <Disclaimer />
          </div>
        </footer>
      </div>
    </div>
  );
}
