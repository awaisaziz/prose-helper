import { createFileRoute } from "@tanstack/react-router";
import { IntakePipeline } from "@/components/prose/IntakePipeline";

export const Route = createFileRoute("/_workspace/intake")({
  head: () => ({
    meta: [
      { title: "Intake Pipeline · proseOS" },
      { name: "description", content: "Inbound leads parsed from prosehelper.ca, ranked by margin and fit." },
    ],
  }),
  component: IntakePipeline,
});
