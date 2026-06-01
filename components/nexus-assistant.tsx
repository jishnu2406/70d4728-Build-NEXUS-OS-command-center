"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  FileText,
  Mic,
  Paperclip,
  SendHorizonal,
  Sparkles,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { organization, projects } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const starterMessages: Message[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "This workspace is fresh. I can help set up the company profile, roles, modules, imports, AI rules, and launch checklist.",
  },
];

export function NexusAssistant({ open }: { open: boolean }) {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setStreaming(true);

    try {
      const response = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok || !response.body) throw new Error("AI stream failed");

      const assistantId = crypto.randomUUID();
      setMessages((current) => [
        ...current,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: `${message.content}${chunk}` }
              : message,
          ),
        );
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "The live AI route could not be reached. Fresh-start fallback: begin with organization identity, invite administrators, choose modules, connect storage, then import this MNC's own data.",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden w-80 shrink-0 flex-col border-l border-border bg-surface/72 backdrop-blur-xl xl:flex"
        >
          <div className="border-b border-border p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-2/18 text-accent-2 animate-pulseGlow">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-text">NEXUS Mind</h2>
                <p className="text-xs text-muted">Claude primary, OpenAI fallback</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-panel p-3">
                <p className="text-xs text-muted">AI spend</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(organization.aiSpend)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-panel p-3">
                <p className="text-xs text-muted">Data watch</p>
                <p className="text-sm font-semibold">
                  {projects.filter((project) => project.status !== "On Track").length}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={
                  message.role === "user"
                    ? "ml-8 rounded-xl bg-accent text-bg p-3 text-sm"
                    : "mr-4 rounded-xl border border-border bg-panel p-3 text-sm text-muted"
                }
              >
                {message.content || <span className="skeleton block h-4 w-32 rounded" />}
              </motion.div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-3 flex gap-2">
              <Badge tone="accent">
                <Sparkles className="mr-1 h-3 w-3" />
                Context aware
              </Badge>
              <Badge>Streaming</Badge>
            </div>
            <form onSubmit={onSubmit} className="rounded-xl border border-border bg-panel p-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={3}
                className="w-full resize-none bg-transparent p-2 text-sm text-text outline-none placeholder:text-muted"
                placeholder="Ask about projects, invoices, files, or team load..."
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button aria-label="Attach file" type="button" variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button aria-label="Voice input" type="button" variant="ghost" size="icon">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button aria-label="Insert brief" type="button" variant="ghost" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
                <Button type="submit" variant="primary" size="icon" disabled={streaming}>
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
