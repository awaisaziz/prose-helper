import { createFileRoute } from "@tanstack/react-router";
import { MatterDetail } from "@/components/prose/MatterDetail";

export const Route = createFileRoute("/_workspace/matters/$matterId")({
  head: () => ({
    meta: [{ title: "Matter · proseOS" }],
  }),
  component: MatterDetail,
});
