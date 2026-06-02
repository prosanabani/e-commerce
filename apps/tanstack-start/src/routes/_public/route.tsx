import { createFileRoute, Outlet } from "@tanstack/react-router";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto min-h-[calc(100vh-580px)] w-full">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
