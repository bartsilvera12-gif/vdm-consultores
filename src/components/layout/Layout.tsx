import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

/**
 * Al cambiar de ruta, llevamos al top (a menos que la URL traiga un hash,
 * que delegamos al navegador para que haga el scroll al ancla).
 */
function ScrollToTopOnNav() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <ScrollToTopOnNav />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toaster
        position="bottom-center"
        toastOptions={{
          classNames: {
            toast:
              "font-sans text-small rounded-md border border-line bg-ink text-surface shadow-card",
          },
        }}
      />
    </div>
  );
}
