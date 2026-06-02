import { createFileRoute } from "@tanstack/react-router";

import ForgetPassword from "@components/customer/ForgetPassword";

export const Route = createFileRoute("/_public/customer/forget-password")({
  component: () => <ForgetPassword />,
});
