import { env } from "~/env";

const DEFAULT_ENDPOINT = "http://localhost:8000";

export function getBagistoEndpoint() {
  return env.VITE_BAGISTO_ENDPOINT ?? DEFAULT_ENDPOINT;
}

export function getBagistoStorefrontKey() {
  return env.VITE_BAGISTO_STOREFRONT_KEY;
}

type BagistoFetchOptions = RequestInit & {
  graphql?: boolean;
};

export async function bagistoFetch<T>(
  path: string,
  options: BagistoFetchOptions = {},
): Promise<T> {
  const base = getBagistoEndpoint().replace(/\/$/, "");
  const { graphql = false, headers, ...init } = options;
  const url = graphql ? `${base}/graphql` : `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const storefrontKey = getBagistoStorefrontKey();
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(storefrontKey ? { "X-Storefront-Key": storefrontKey } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Bagisto API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function bagistoGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const payload = await bagistoFetch<{ data: T; errors?: unknown[] }>("", {
    method: "POST",
    graphql: true,
    body: JSON.stringify({ query, variables }),
  });

  if (payload.errors?.length) {
    throw new Error(`Bagisto GraphQL error: ${JSON.stringify(payload.errors)}`);
  }

  return payload.data;
}
