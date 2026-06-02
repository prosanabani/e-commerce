import { createFileRoute, Outlet } from "@tanstack/react-router";

import Navbar from "@/components/layout/navbar";

export const Route = createFileRoute("/_checkout")({
  component: CheckoutLayout,
});

function CheckoutLayout() {
  return (
    <>
      <div className="block lg:hidden">
        <Navbar />
      </div>
      <main className="mx-auto min-h-[calc(100vh-580px)] w-full px-4 md:px-8 lg:px-16 xl:px-28">
        <Outlet />
      </main>
    </>
  );
}
