import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

/**
 * Al cambiar de ruta, llevamos al top. Si la URL trae un hash vamos al ancla:
 * el navegador no lo hace solo en la navegación client-side de React Router.
 * `key` cambia en cada click, así repetir el mismo enlace vuelve a llevar ahí.
 */
function ScrollOnNav() {
  const { pathname, hash, key } = useLocation();
  const prevPath = useRef(pathname);
  useEffect(() => {
    // Al llegar desde otra página se salta directo; dentro de la misma, se desliza.
    const samePage = prevPath.current === pathname;
    prevPath.current = pathname;
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    document.getElementById(hash.slice(1))?.scrollIntoView({
      behavior: samePage ? "smooth" : ("instant" as ScrollBehavior),
    });
  }, [pathname, hash, key]);
  return null;
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <ScrollOnNav />
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
