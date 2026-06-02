import { createFileRoute, notFound } from "@tanstack/react-router";

import { ProductPageClient } from "~/routes/_public/product/-product-page-client";

export const Route = createFileRoute("/_public/product/$")({
  component: ProductPageRoute,
});

function ProductPageRoute() {
  const { _splat } = Route.useParams();
  const fullPath = _splat ?? "";
  if (!fullPath) {
    throw notFound();
  }
  return <ProductPageClient urlKey={fullPath} />;
}
