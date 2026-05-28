import { createFileRoute } from "@tanstack/react-router";
import { ClientPortal } from "@/components/prose/ClientPortal";

export const Route = createFileRoute("/_workspace/client/")({
  head: () => ({
    meta: [
      { title: "Client Workspace · DrinkPure vs. PackCo" },
      { name: "description", content: "Live matter status, documents, and spend — mirrored from the operations desk." },
    ],
  }),
  component: ClientPortal,
});
