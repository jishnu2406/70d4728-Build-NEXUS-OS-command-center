"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as Switch from "@radix-ui/react-switch";
import { Check, MonitorCog, Palette, Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { fonts, themes } from "@/lib/themes";
import type { FontId, ThemeId } from "@/lib/types";
import { usePreferencesStore } from "@/stores/preferences-store";

const settingsSchema = z.object({
  theme: z.custom<ThemeId>(),
  font: z.custom<FontId>(),
  density: z.enum(["compact", "default", "comfortable"]),
  aiVoice: z.boolean(),
  notifications: z.boolean(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export function SettingsModule() {
  const theme = usePreferencesStore((state) => state.theme);
  const font = usePreferencesStore((state) => state.font);
  const density = usePreferencesStore((state) => state.density);
  const setTheme = usePreferencesStore((state) => state.setTheme);
  const setFont = usePreferencesStore((state) => state.setFont);
  const setDensity = usePreferencesStore((state) => state.setDensity);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      theme,
      font,
      density,
      aiVoice: true,
      notifications: true,
    },
  });
  const selectedTheme = useWatch({ control: form.control, name: "theme" });
  const selectedDensity = useWatch({ control: form.control, name: "density" });
  const aiVoice = useWatch({ control: form.control, name: "aiVoice" });
  const notifications = useWatch({ control: form.control, name: "notifications" });

  function onSubmit(values: SettingsValues) {
    setTheme(values.theme);
    setFont(values.font);
    setDensity(values.density);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto flex max-w-[1400px] flex-col gap-5"
    >
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface/72 p-5 backdrop-blur-xl lg:flex-row lg:items-end">
        <div>
          <Badge tone="accent">Workspace OS</Badge>
          <h2 className="mt-4 text-3xl font-semibold">Personalization and controls</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Themes, fonts, density, notification behavior, command shortcuts, and AI
            preferences are persisted per user and synced across workspaces.
          </p>
        </div>
        <Button type="submit" variant="primary">
          <Save className="h-4 w-4" />
          Save preferences
        </Button>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader title="Theme system" eyebrow="8 CSS custom property sets" />
          <div className="grid gap-3 md:grid-cols-2">
            {themes.map((item) => {
              const selected = selectedTheme === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    form.setValue("theme", item.id);
                    setTheme(item.id);
                  }}
                  className="focus-ring rounded-xl border border-border bg-panel p-4 text-left transition hover:border-accent-2/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="mt-1 text-sm text-muted">{item.description}</p>
                    </div>
                    {selected ? <Check className="h-4 w-4 text-accent-2" /> : null}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {["bg", "surface", "accent", "accent-2"].map((token) => (
                      <span
                        key={token}
                        className="h-6 w-10 rounded-full border border-border"
                        style={{
                          background:
                            token === "bg"
                              ? "rgb(var(--bg))"
                              : token === "surface"
                                ? "rgb(var(--surface))"
                                : token === "accent"
                                  ? "rgb(var(--accent))"
                                  : "rgb(var(--accent-2))",
                        }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Typography" eyebrow="User-selectable font" />
            <select
              {...form.register("font")}
              onChange={(event) => {
                form.setValue("font", event.target.value as FontId);
                setFont(event.target.value as FontId);
              }}
              className="focus-ring h-11 w-full rounded-lg border border-border bg-panel px-3 text-sm text-text"
            >
              {fonts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="mt-4 rounded-xl border border-border bg-panel p-4">
              <p className="text-2xl font-semibold">NEXUS OS</p>
              <p className="mt-2 text-sm text-muted">
                Command. Create. Conquer.
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Interface density" eyebrow="Layout" />
            <div className="grid grid-cols-3 gap-2">
              {(["compact", "default", "comfortable"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    form.setValue("density", value);
                    setDensity(value);
                  }}
                  className="focus-ring rounded-lg border border-border bg-panel px-3 py-3 text-sm capitalize text-muted transition hover:text-text aria-pressed:border-accent-2 aria-pressed:text-text"
                  aria-pressed={selectedDensity === value}
                >
                  {value}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Notifications" eyebrow="Personal" />
            <div className="space-y-4">
              {[
                ["aiVoice", "AI voice input"],
                ["notifications", "Realtime notifications"],
              ].map(([name, label]) => (
                <label
                  key={name}
                  className="flex items-center justify-between rounded-xl border border-border bg-panel p-4 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <MonitorCog className="h-4 w-4 text-accent-2" />
                    {label}
                  </span>
                  <Switch.Root
                    checked={name === "aiVoice" ? aiVoice : notifications}
                    onCheckedChange={(checked) =>
                      form.setValue(name as "aiVoice" | "notifications", checked)
                    }
                    className="relative h-6 w-11 rounded-full bg-border data-[state=checked]:bg-accent-2"
                  >
                    <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                </label>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader title="Command palette shortcuts" eyebrow="Keyboard" />
        <div className="grid gap-3 md:grid-cols-4">
          {["Ctrl K", "Ctrl /", "G then P", "G then A"].map((shortcut) => (
            <div key={shortcut} className="rounded-xl border border-border bg-panel p-4">
              <Palette className="mb-3 h-5 w-5 text-accent-2" />
              <kbd className="rounded border border-border px-2 py-1 text-xs text-muted">
                {shortcut}
              </kbd>
            </div>
          ))}
        </div>
      </Card>
    </form>
  );
}
