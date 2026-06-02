"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ReduxProvider } from "./ReduxProvider";
import { ToastProvider } from "./ToastProvider";
import { ApolloWrapper } from "./ApolloWrapper";
import { SessionProvider } from "next-auth/react";

export function GlobalProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <ReduxProvider>
          <ToastProvider>
            <ApolloWrapper>{children}</ApolloWrapper>
          </ToastProvider>
        </ReduxProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}