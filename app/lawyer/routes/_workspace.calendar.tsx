import { createFileRoute } from "@tanstack/react-router";
import { CalendarWeek } from "@/components/prose/CalendarWeek";

export const Route = createFileRoute("/_workspace/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar · proseOS" },
      { name: "description", content: "Court dates, client calls, and signoffs across every active matter." },
    ],
  }),
  component: CalendarWeek,
});
