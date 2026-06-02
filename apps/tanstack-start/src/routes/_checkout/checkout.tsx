import { createFileRoute } from "@tanstack/react-router";

import CheckOut from "@/components/checkout";

export const Route = createFileRoute("/_checkout/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    step: typeof search.step === "string" ? search.step : "email",
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { step } = Route.useSearch();
  return <CheckOut step={step} />;
}
