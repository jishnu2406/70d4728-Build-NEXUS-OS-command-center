"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePreferencesStore } from "@/stores/preferences-store";

function ThemeBridge() {
  const theme = usePreferencesStore((state) => state.theme);
  const font = usePreferencesStore((state) => state.font);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.font = font;
  }, [font, theme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider delayDuration={250}>
        <ThemeBridge />
        {children}
      </Tooltip.Provider>
    </QueryClientProvider>
  );
}
