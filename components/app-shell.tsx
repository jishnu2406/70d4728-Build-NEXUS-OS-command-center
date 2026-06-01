"use client";

import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Bot,
  Building2,
  ChevronLeft,
  CircleDollarSign,
  FileStack,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Shield,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/command-palette";
import { NexusAssistant } from "@/components/nexus-assistant";
import { Badge } from "@/components/ui/badge";
import { activeSession } from "@/lib/permissions";
import { notifications, organization } from "@/lib/data";
import { cn, initials } from "@/lib/utils";
import { usePreferencesStore } from "@/stores/preferences-store";

const navigation = [
  { label: "Command", href: "/", icon: LayoutDashboard, group: "Command" },
  { label: "Projects", href: "/projects", icon: FolderKanban, group: "Work" },
  { label: "People", href: "/people", icon: UsersRound, group: "Work" },
  { label: "Assets", href: "/assets", icon: FileStack, group: "Work" },
  { label: "Finance", href: "/finance", icon: CircleDollarSign, group: "Business" },
  { label: "Intelligence", href: "/intelligence", icon: Bot, group: "Business" },
  { label: "Client Portal", href: "/client-portal", icon: Building2, group: "Business" },
  { label: "Settings", href: "/settings", icon: Settings, group: "System" },
  { label: "Admin", href: "/admin", icon: Shield, group: "System" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const sidebarCollapsed = usePreferencesStore((state) => state.sidebarCollapsed);
  const aiPanelOpen = usePreferencesStore((state) => state.aiPanelOpen);
  const toggleSidebar = usePreferencesStore((state) => state.toggleSidebar);
  const toggleAiPanel = usePreferencesStore((state) => state.toggleAiPanel);

  const currentPage = useMemo(
    () =>
      navigation.find((item) =>
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
      ) ?? navigation[0],
    [pathname],
  );

  const groups = ["Command", "Work", "Business", "System"];

  return (
    <div className="relative z-10 flex min-h-screen text-text">
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close navigation"
              type="button"
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.nav
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative flex h-full w-[280px] flex-col border-r border-border bg-surface p-4 shadow-glass"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-panel text-sm font-bold text-accent">
                  NX
                </div>
                <div>
                  <p className="text-sm font-semibold">{organization.name}</p>
                  <Badge tone="accent">{organization.plan}</Badge>
                </div>
              </div>
              <div className="space-y-5">
                {groups.map((group) => (
                  <div key={group}>
                    <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted/80">
                      {group}
                    </p>
                    <div className="space-y-1">
                      {navigation
                        .filter((item) => item.group === group)
                        .map((item) => {
                          const active =
                            item.href === "/"
                              ? pathname === "/"
                              : pathname.startsWith(item.href);
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={cn(
                                "focus-ring flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-muted transition hover:bg-panel hover:text-text",
                                active && "bg-accent-2/16 text-text",
                              )}
                            >
                              <Icon className="h-4 w-4" />
                              {item.label}
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarCollapsed ? 76 : 264 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 hidden h-screen shrink-0 border-r border-border bg-surface/72 backdrop-blur-xl md:flex md:flex-col"
      >
        <div className="flex h-20 items-center gap-3 border-b border-border px-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-panel text-sm font-bold text-accent">
            NX
          </div>
          <AnimatePresence initial={false}>
            {!sidebarCollapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="min-w-0"
              >
                <p className="truncate text-sm font-semibold">{organization.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge tone="accent">{organization.plan}</Badge>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="px-3 py-4">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className={cn(
              "focus-ring flex h-10 w-full items-center gap-3 rounded-lg border border-border bg-panel px-3 text-left text-sm text-muted transition hover:text-text",
              sidebarCollapsed && "justify-center px-0",
            )}
          >
            <Search className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed ? (
              <>
                <span className="flex-1 truncate">Search or command</span>
                <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">
                  Ctrl K
                </kbd>
              </>
            ) : null}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {groups.map((group) => (
            <div key={group} className="mb-4">
              {!sidebarCollapsed ? (
                <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted/80">
                  {group}
                </p>
              ) : null}
              <div className="space-y-1">
                {navigation
                  .filter((item) => item.group === group)
                  .map((item) => {
                    const active =
                      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={sidebarCollapsed ? item.label : undefined}
                        className={cn(
                          "focus-ring flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted transition hover:bg-panel hover:text-text",
                          active && "bg-accent-2/16 text-text",
                          sidebarCollapsed && "justify-center px-0",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!sidebarCollapsed ? <span>{item.label}</span> : null}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={toggleAiPanel}
            className={cn(
              "focus-ring mb-3 flex w-full items-center gap-3 rounded-xl border border-accent-2/30 bg-accent-2/12 p-3 text-left text-sm text-accent-2",
              sidebarCollapsed && "justify-center px-0",
            )}
          >
            <Sparkles className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed ? (
              <span>
                NEXUS Mind
                <span className="block text-xs text-muted">Persistent AI sidebar</span>
              </span>
            ) : null}
          </button>
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar.Root className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-panel text-xs font-semibold">
                <Avatar.Fallback>{initials("Ada Sterling")}</Avatar.Fallback>
              </Avatar.Root>
              {!sidebarCollapsed ? (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Ada Sterling</p>
                  <p className="text-xs uppercase text-muted">{activeSession.role}</p>
                </div>
              ) : null}
            </div>
            <Button
              aria-label="Collapse sidebar"
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
            >
              <ChevronLeft
                className={cn("h-4 w-4 transition", sidebarCollapsed && "rotate-180")}
              />
            </Button>
          </div>
        </div>
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-bg/78 px-4 backdrop-blur-xl md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              aria-label="Open navigation"
              variant="icon"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <p className="text-xs text-muted">NEXUS OS / {currentPage.group}</p>
              <h1 className="truncate text-base font-semibold md:text-lg">
                {currentPage.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setCommandOpen(true)}>
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Command</span>
            </Button>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button aria-label="Open notifications" variant="icon" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  className="z-50 w-80 rounded-xl border border-border bg-surface p-2 shadow-glass"
                >
                  <DropdownMenu.Label className="px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                    Notifications
                  </DropdownMenu.Label>
                  {notifications.map((notification) => (
                    <DropdownMenu.Item
                      key={notification}
                      className="rounded-lg px-3 py-3 text-sm text-muted outline-none hover:bg-panel hover:text-text"
                    >
                      {notification}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <Button aria-label="Toggle AI panel" variant="icon" size="icon" onClick={toggleAiPanel}>
              <Bot className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 px-4 py-5 md:px-6 lg:px-8">{children}</main>
          <NexusAssistant open={aiPanelOpen} />
        </div>
      </div>
    </div>
  );
}
