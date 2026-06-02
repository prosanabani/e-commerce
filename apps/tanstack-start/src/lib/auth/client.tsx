"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { print } from "graphql";
import { CUSTOMER_LOGIN } from "@/graphql/customer/mutations/CustomerLogin";
import { bagistoGraphql } from "~/lib/bagisto/client";
import type { BagistoSession } from "@/types/types";

const SESSION_STORAGE_KEY = "bagisto-commerce-session";

type SessionUser = BagistoSession["user"];

type Session = {
  user?: SessionUser;
  expires?: string;
};

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  data: Session | null;
  status: SessionStatus;
  update: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeStoredSession(session: Session | null) {
  if (typeof window === "undefined") return;
  if (!session?.user) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  const update = useCallback(async () => {
    const session = readStoredSession();
    setData(session);
    setStatus(session?.user ? "authenticated" : "unauthenticated");
  }, []);

  useEffect(() => {
    void update();
  }, [update]);

  const value = useMemo(
    () => ({ data, status, update }),
    [data, status, update],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return { data: ctx.data, status: ctx.status, update: ctx.update };
}

export async function getSession(): Promise<Session | null> {
  return readStoredSession();
}

export async function signIn(
  provider: string,
  options?: {
    redirect?: boolean;
    username?: string;
    password?: string;
    callbackUrl?: string;
  },
): Promise<{ ok: boolean; error?: string; url?: string }> {
  if (provider !== "credentials") {
    return { ok: false, error: "Only credentials provider is supported." };
  }

  const email = options?.username;
  const password = options?.password;
  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  try {
    const data = await bagistoGraphql<{
      createCustomerLogin: {
        customerLogin: {
          id: string;
          apiToken: string;
          token: string;
          message: string;
          success: boolean;
        };
      };
    }>(print(CUSTOMER_LOGIN), {
      input: { email, password },
    });

    const login = data.createCustomerLogin.customerLogin;
    if (!login?.success || !login.token) {
      return { ok: false, error: login?.message || "Invalid credentials." };
    }

    const session: Session = {
      user: {
        id: login.id,
        email,
        name: email,
        apiToken: login.apiToken,
        accessToken: login.token,
        role: "customer",
      },
    };
    writeStoredSession(session);

    if (options?.redirect !== false && options?.callbackUrl) {
      window.location.href = options.callbackUrl;
    }

    return { ok: true, url: options?.callbackUrl };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Login failed.",
    };
  }
}

export async function signOut(options?: {
  callbackUrl?: string;
  redirect?: boolean;
}) {
  writeStoredSession(null);
  const target = options?.callbackUrl;
  if (target && options?.redirect !== false) {
    window.location.href = target;
  }
}
