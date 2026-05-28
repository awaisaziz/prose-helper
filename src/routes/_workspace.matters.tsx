import { createFileRoute } from "@tanstack/react-router";
import { MattersTable } from "@/components/dictum/MattersTable";

export const Route = createFileRoute("/_workspace/matters")({
  head: () => ({
    meta: [
      { title: "Active Matters · dictumOS" },
      { name: "description", content: "Every open matter, ranked by next action and exposure." },
    ],
  }),
  component: MattersTable,
});
