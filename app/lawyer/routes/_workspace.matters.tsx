import { createFileRoute } from "@tanstack/react-router";
import { MattersTable } from "@/components/prose/MattersTable";

export const Route = createFileRoute("/_workspace/matters")({
  head: () => ({
    meta: [
      { title: "Active Matters · proseOS" },
      { name: "description", content: "Every open matter, ranked by next action and exposure." },
    ],
  }),
  component: MattersTable,
});
