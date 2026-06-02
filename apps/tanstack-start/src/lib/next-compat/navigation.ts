import {
  notFound as routerNotFound,
  useNavigate,
  useRouter as useTanStackRouter,
  useSearch,
} from "@tanstack/react-router";

type NavigateOptions = {
  scroll?: boolean;
};

function useSearchParamsObject() {
  const search = useSearch({ strict: false }) as Record<string, string | string[]>;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  }
  return params;
}

export function useRouter() {
  const navigate = useNavigate();
  const router = useTanStackRouter();

  return {
    push: (href: string, _options?: NavigateOptions) => {
      void navigate({ to: href as "/" });
    },
    replace: (href: string, _options?: NavigateOptions) => {
      void navigate({ to: href as "/", replace: true });
    },
    back: () => router.history.back(),
    refresh: () => router.invalidate(),
    prefetch: (_href: string) => undefined,
  };
}

export function usePathname() {
  const router = useTanStackRouter();
  return router.state.location.pathname;
}

export function useSearchParams() {
  return useSearchParamsObject();
}

export function notFound(): never {
  throw routerNotFound();
}

export function redirect(url: string): never {
  if (typeof window !== "undefined") {
    window.location.href = url;
  }
  throw new Error(`Redirect to ${url}`);
}
