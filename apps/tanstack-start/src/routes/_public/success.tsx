import { createFileRoute } from "@tanstack/react-router";

import EmptyCart from "@/components/checkout/success/EmptyCart";

export const Route = createFileRoute("/_public/success")({
  component: () => <EmptyCart />,
});
