import { createFileRoute } from "@tanstack/react-router";
import { MatterDetail } from "@/components/dictum/MatterDetail";

export const Route = createFileRoute("/_workspace/matters/$matterId")({
  head: () => ({
    meta: [{ title: "Matter · dictumOS" }],
  }),
  component: MatterDetail,
});
