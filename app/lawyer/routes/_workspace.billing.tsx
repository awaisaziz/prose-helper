import { createFileRoute } from "@tanstack/react-router";
import { BillingPanel } from "@/components/prose/BillingPanel";

export const Route = createFileRoute("/_workspace/billing")({
  head: () => ({
    meta: [
      { title: "Billing & Time · proseOS" },
      { name: "description", content: "Weekly billable progress, auto-captured time, and retainer balances." },
    ],
  }),
  component: BillingPanel,
});
