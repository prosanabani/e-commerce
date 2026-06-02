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
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

import { DirectionProvider } from "@repo/ui/direction";
import { ThemeProvider } from "@repo/ui/theme";
import { Toaster } from "@repo/ui/toast";
import { TooltipProvider } from "@repo/ui/tooltip";

import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { GlobalProviders } from "@/providers/GlobalProviders";
import appCss from "~/styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
    meta: [
      {
        title: "Bagisto Storefront",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <ErrorBoundary>
        <GlobalProviders>
          <Outlet />
        </GlobalProviders>
      </ErrorBoundary>
    </RootDocument>
  );
}

import { getLocale } from "~/paraglide/runtime";

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
          <Toaster />
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  );
}
