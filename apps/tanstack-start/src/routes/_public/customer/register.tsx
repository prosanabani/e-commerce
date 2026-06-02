import { createFileRoute } from "@tanstack/react-router";

import RegistrationForm from "@components/customer/RegistrationForm";

export const Route = createFileRoute("/_public/customer/register")({
  component: () => <RegistrationForm />,
});
