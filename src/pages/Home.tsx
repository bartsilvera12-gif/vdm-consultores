import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Featured } from "@/components/sections/Featured";
import { Team } from "@/components/sections/Team";
import { Experience } from "@/components/sections/Experience";
import { CtaBand } from "@/components/sections/CtaBand";
import { Contact } from "@/components/sections/Contact";

/**
 * Si entramos a / con un hash (p. ej. `/#servicios`), scrolleamos al ancla
 * después del render inicial. Útil para links externos / viejos a la landing.
 */
function useScrollToHashOnMount() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      // scroll-padding-top del html maneja el offset del header sticky.
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);
}

export function Home() {
  useScrollToHashOnMount();
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Featured />
      <Team />
      <Experience />
      <CtaBand />
      <Contact />
    </>
  );
}
