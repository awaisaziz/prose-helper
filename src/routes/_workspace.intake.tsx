import { createFileRoute } from "@tanstack/react-router";
import { IntakePipeline } from "@/components/dictum/IntakePipeline";

export const Route = createFileRoute("/_workspace/intake")({
  head: () => ({
    meta: [
      { title: "Intake Pipeline · dictumOS" },
      { name: "description", content: "Inbound leads parsed from ai.dictumhq.com, ranked by margin and fit." },
    ],
  }),
  component: IntakePipeline,
});
