import type { FontId, ThemeId } from "@/lib/types";

export const themes: Array<{ id: ThemeId; name: string; description: string }> = [
  { id: "obsidian", name: "Obsidian", description: "Default dark command environment" },
  { id: "arctic", name: "Arctic", description: "Crisp light workspace" },
  { id: "midnight", name: "Midnight Navy", description: "Deep operational focus" },
  { id: "sand", name: "Warm Sand", description: "Editorial studio warmth" },
  { id: "forest", name: "Forest", description: "Calm production floor" },
  { id: "graphite", name: "Graphite", description: "Neutral executive mode" },
  { id: "rose", name: "Rose Quartz", description: "Luxury client presentation" },
  { id: "blueprint", name: "Blueprint", description: "Technical drawing energy" },
];

export const fonts: Array<{ id: FontId; name: string }> = [
  { id: "sf-pro", name: "SF Pro" },
  { id: "inter", name: "Inter" },
  { id: "geist", name: "Geist" },
  { id: "sora", name: "Sora" },
  { id: "dm-sans", name: "DM Sans" },
  { id: "satoshi", name: "Satoshi" },
  { id: "editorial", name: "Editorial New" },
  { id: "haas", name: "Neue Haas" },
];
