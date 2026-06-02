import { createFileRoute } from "@tanstack/react-router";

import { SearchPageClient } from "~/routes/_public/search/-search-page-client";

export const Route = createFileRoute("/_public/search/")({
  component: SearchPageClient,
});
