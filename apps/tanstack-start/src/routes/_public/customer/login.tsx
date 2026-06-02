import { createFileRoute } from "@tanstack/react-router";

import LoginForm from "@components/customer/LoginForm";
import { SessionManager } from "@/providers";

export const Route = createFileRoute("/_public/customer/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <SessionManager>
      <LoginForm />
    </SessionManager>
  );
}
