/// <reference types="vite/client" />
import type { QueryClient } from "@tanstack/react-query";
import type * as React from "react";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { DirectionProvider } from "@repo/ui/direction";
import { ThemeProvider, ThemeToggle } from "@repo/ui/theme";
import { Toaster } from "@repo/ui/toast";
import { TooltipProvider } from "@repo/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

import appCss from "~/styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

import { getLocale, locales, setLocale } from "~/paraglide/runtime";

function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <ThemeProvider>
      <html lang={locale} dir={dir} suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body className="bg-background text-foreground min-h-screen font-sans antialiased">
          <DirectionProvider dir={dir}>
            <NuqsAdapter>
              <TooltipProvider>{children}</TooltipProvider>
            </NuqsAdapter>
          </DirectionProvider>
          <div className="absolute right-4 bottom-12 flex flex-col gap-2">
            <div className="flex gap-2 bg-card p-2 rounded-lg shadow border border-border">
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    l === locale
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <ThemeToggle />
          </div>
          <Toaster />
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  );
}
