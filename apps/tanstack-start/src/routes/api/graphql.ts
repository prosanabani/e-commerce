import { createFileRoute } from "@tanstack/react-router";

import { handleGraphqlProxy } from "~/lib/server/graphql-proxy";

export const Route = createFileRoute("/api/graphql")({
  server: {
    handlers: {
      POST: ({ request }) => handleGraphqlProxy(request),
    },
  },
});
