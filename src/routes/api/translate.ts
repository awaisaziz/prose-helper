import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/translate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { text } = (await request.json()) as { text?: string };
        if (!text) return new Response("Missing text", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing key", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system:
            "You are a legal billing translator. Convert dense legal billing language into a short, calm, reassuring plain-English explanation for clients. Avoid legal jargon. Be concise. One or two sentences maximum.",
          prompt: `Translate this legal billing entry into plain English for the client:\n\n"${text}"`,
        });

        return result.toTextStreamResponse();
      },
    },
  },
});
