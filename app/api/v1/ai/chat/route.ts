import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { z } from "zod";
import { aiAgents, organization, projects, setupSteps } from "@/lib/data";

export const runtime = "nodejs";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

function fallbackStream(prompt: string) {
  const risky = projects.filter((project) => project.status !== "On Track");
  const text = [
    `NEXUS setup brief for ${organization.name}: `,
    risky.length
      ? `${risky.length} project records need attention. ${risky.map((project) => `${project.name}: ${project.risk}`).join(" ")} `
      : "No tenant project data exists yet. ",
    `Recommended fresh-start sequence: ${setupSteps.map((step) => step.title).join(", ")}.`,
    ` Prompt received: "${prompt.slice(0, 120)}"`,
  ].join("");

  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        for (const word of text.split(" ")) {
          controller.enqueue(encoder.encode(`${word} `));
          await new Promise((resolve) => setTimeout(resolve, 14));
        }
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = chatSchema.safeParse(body);

  if (!parsed.success) {
    return new Response("Invalid AI request payload.", { status: 422 });
  }

  const lastPrompt = [...parsed.data.messages].reverse().find((message) => message.role === "user")?.content ?? "";

  if (!process.env.ANTHROPIC_API_KEY) {
    return fallbackStream(lastPrompt);
  }

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: [
      "You are NEXUS Mind, an enterprise AI copilot for architecture, interiors, production, and design MNCs.",
      "Be concise. If the workspace is empty, guide first-run setup instead of inventing records.",
      `Active agents: ${aiAgents.map((agent) => agent.name).join(", ")}.`,
    ].join(" "),
    messages: parsed.data.messages,
  });

  return result.toTextStreamResponse({
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
