import { motion } from "framer-motion";
import { Check, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useWorkspace } from "@/lib/workspace-context";

export function BriefModal() {
  const { briefOpen, closeBrief, intakeStatus, acceptIntake } = useWorkspace();
  if (!briefOpen) return null;
  const accepted = intakeStatus === "accepted";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-6 backdrop-blur-sm"
      onClick={closeBrief}
    >
      <motion.div
        initial={{ y: 16, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ borderRadius: 24 }}
        className="relative w-full max-w-3xl overflow-hidden border border-hairline bg-canvas shadow-[0_30px_80px_-20px_rgba(23,25,28,0.25)]"
      >
        <div className="flex items-center justify-between border-b border-hairline px-7 py-4">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            <Sparkles className="h-3 w-3" />
            proseOS Automated Matter Brief
          </div>
          <button
            onClick={closeBrief}
            className="rounded-md px-2 py-1 text-[12px] text-ink-faint hover:bg-fog hover:text-ink"
          >
            Esc
          </button>
        </div>

        <div className="px-7 pb-7 pt-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="font-serif text-[40px] leading-[1.02] tracking-tight">
                Sarah Jenkins
              </h2>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-ink-soft">
                <Mail className="h-3.5 w-3.5" />
                sarah@drinkpure.com
                <span className="h-1 w-1 rounded-full bg-ink-faint" />
                <span>Intake source: prosehelper.ca</span>
              </div>
            </div>
            <div className="rounded-2xl bg-warm-mist px-4 py-3 text-right">
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink/60">
                Claim value
              </div>
              <div className="tabular font-serif text-[28px] leading-none">$35,000.00</div>
            </div>
          </div>

          {!accepted ? (
            <>
              <p className="mt-6 text-[14px] leading-[1.7] text-ink-soft">
                System scraped inbound intake from{" "}
                <span className="text-ink">prosehelper.ca</span>. Prospect:{" "}
                <span className="text-ink">sarah@drinkpure.com</span>. Dispute type:{" "}
                mid-season vendor contract cancellation. Claim value:{" "}
                <span className="text-ink">$35,000.00</span>. Key clause detected:{" "}
                <span className="text-ink">liquidated damages penalty</span>.
                Recommendation: high-margin match. Automated action available.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Stat label="Dispute" value="Vendor contract" />
                <Stat label="Key clause" value="Liquidated damages" />
                <Stat label="Match score" value="94 · High margin" />
              </div>
              <div className="mt-7 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-ink-faint">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Conflicts check passed · 0 adverse parties
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={closeBrief}
                    className="rounded-full border border-hairline px-4 py-2 text-[12px] text-ink-soft hover:bg-fog"
                  >
                    Decline
                  </button>
                  <button
                    onClick={acceptIntake}
                    className="rounded-full bg-ink px-5 py-2.5 text-[12px] font-medium text-canvas hover:bg-ink/90"
                  >
                    Approve Intake & Issue Engagement Sequence
                  </button>
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-6 rounded-2xl border border-hairline bg-fog p-6"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-success">
                <Check className="h-3.5 w-3.5" />
                Intake accepted
              </div>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft">
                System dispatched email to{" "}
                <span className="text-ink">sarah@drinkpure.com</span> containing a calendar
                CTA to book her 15-minute strategic call. Matter file
                <span className="text-ink"> DrinkPure vs. PackCo, Inc.</span> created and
                added to your active litigation queue.
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  onClick={closeBrief}
                  className="rounded-full bg-ink px-5 py-2.5 text-[12px] font-medium text-canvas hover:bg-ink/90"
                >
                  Back to workspace
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-hairline p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">{label}</div>
      <div className="mt-2 text-[14px] text-ink">{value}</div>
    </div>
  );
}
