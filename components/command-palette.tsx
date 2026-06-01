"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import {
  Bot,
  Building2,
  CalendarDays,
  CircleDollarSign,
  FileSearch,
  FolderKanban,
  LayoutDashboard,
  Search,
  Settings,
  Shield,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Open Command Center", href: "/", icon: LayoutDashboard },
  { label: "Create project workspace", href: "/projects", icon: FolderKanban },
  { label: "Open capacity planner", href: "/people", icon: UsersRound },
  { label: "Search knowledge base", href: "/assets", icon: FileSearch },
  { label: "Configure finance", href: "/finance", icon: CircleDollarSign },
  { label: "Configure AI agents", href: "/intelligence", icon: Bot },
  { label: "Open client portal", href: "/client-portal", icon: Building2 },
  { label: "View resource calendar", href: "/projects", icon: CalendarDays },
  { label: "Workspace settings", href: "/settings", icon: Settings },
  { label: "Super admin console", href: "/admin", icon: Shield },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-[14vh] z-50 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface shadow-glass">
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <Command className="bg-transparent text-text">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 text-muted" />
              <Command.Input
                className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
                placeholder="Search pages, projects, people, files, and actions..."
              />
              <kbd className="rounded-md border border-border bg-panel px-2 py-1 text-xs text-muted">
                Esc
              </kbd>
            </div>
            <Command.List className="max-h-[420px] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-8 text-center text-sm text-muted">
                No matching command found.
              </Command.Empty>
              <Command.Group heading="Navigate">
                {actions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Command.Item
                      key={action.label}
                      value={action.label}
                      onSelect={() => {
                        router.push(action.href);
                        onOpenChange(false);
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted",
                        "aria-selected:bg-panel aria-selected:text-text",
                      )}
                    >
                      <Icon className="h-4 w-4 text-accent-2" />
                      <span>{action.label}</span>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
