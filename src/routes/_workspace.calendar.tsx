import { createFileRoute } from "@tanstack/react-router";
import { CalendarWeek } from "@/components/dictum/CalendarWeek";

export const Route = createFileRoute("/_workspace/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar · dictumOS" },
      { name: "description", content: "Court dates, client calls, and signoffs across every active matter." },
    ],
  }),
  component: CalendarWeek,
});
