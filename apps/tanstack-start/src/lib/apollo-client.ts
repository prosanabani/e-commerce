import { BAGISTO_GRAPHQL_PROXY, GRAPHQL_URL } from "@/utils/constants";
import { env } from "~/env";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";
import { getCartToken } from "@/utils/getCartToken";
import { BagistoSession } from "@/types/types";



let sessionCache: { session: BagistoSession | null; timestamp: number } | null = null;
const SESSION_CACHE_TTL = 5000;

async function getCachedSession(): Promise<BagistoSession | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const now = Date.now();

  if (sessionCache && now - sessionCache.timestamp < SESSION_CACHE_TTL) {
    return sessionCache.session;
  }
  const session = (await getSession()) as BagistoSession | null;
  sessionCache = { session, timestamp: now };
  return session;
}

function createApolloClient() {
  const ssrMode = typeof window === "undefined";
  const cache = new InMemoryCache();

  const httpLink = new HttpLink({
    uri: ssrMode ? GRAPHQL_URL : BAGISTO_GRAPHQL_PROXY,
    credentials: "include",
  });

  const authLink = setContext(async (_, { headers }) => {
    if (ssrMode) {
      const storefrontKey = env.VITE_BAGISTO_STOREFRONT_KEY ?? "";

      return {
        headers: {
          ...headers,
          "X-STOREFRONT-KEY": storefrontKey,
        },
      };
    }

    const session = await getCachedSession();
    const userToken = session?.user?.accessToken;
    const guestToken = !userToken ? getCartToken() : null;
    const token = userToken || guestToken;

    return {
      headers: {
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      },
    };
  });

  const link = from([authLink, httpLink]);

  return new ApolloClient({
    ssrMode,
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: ssrMode ? "network-only" : "cache-first",
        nextFetchPolicy: ssrMode ? "network-only" : "cache-first",
      },
      query: {
        fetchPolicy: ssrMode ? "network-only" : "cache-first",
      },
    },
  });
}

let browserClient: ReturnType<typeof createApolloClient> | null = null;

export default function initializeApollo() {
  if (typeof window === "undefined") {
    return createApolloClient();
  }
  if (!browserClient) {
    browserClient = createApolloClient();
  }
  return browserClient;
}