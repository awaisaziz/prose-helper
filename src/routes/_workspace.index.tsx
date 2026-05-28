import { createFileRoute } from "@tanstack/react-router";
import { FirmOverview } from "@/components/dictum/FirmOverview";

export const Route = createFileRoute("/_workspace/")({
  head: () => ({
    meta: [
      { title: "Firm Overview · dictumOS" },
      {
        name: "description",
        content:
          "Your week, parsed from every connected inbox, calendar, and matter file — ranked by urgency, summarized for action.",
      },
    ],
  }),
  component: FirmOverview,
});
