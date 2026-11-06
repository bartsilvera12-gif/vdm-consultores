import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { PageMeta } from "@/components/layout/PageMeta";
import { LangProvider } from "@/i18n/context";
import { LANG_TAG, type Lang } from "@/i18n/langs";
import { messages } from "@/i18n/messages";

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

export function Layout({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = LANG_TAG[lang];
  }, [lang]);
  return (
    <LangProvider lang={lang}>
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <ScrollOnNav />
      <PageMeta />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toaster
        containerAriaLabel={messages[lang].common.notifications}
        position="bottom-center"
        toastOptions={{
          classNames: {
            toast:
              "font-sans text-small rounded-md border border-line bg-ink text-surface shadow-card",
          },
        }}
      />
    </div>
    </LangProvider>
  );
}
