import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Featured } from "@/components/sections/Featured";
import { Team } from "@/components/sections/Team";
import { Experience } from "@/components/sections/Experience";
import { CtaBand } from "@/components/sections/CtaBand";
import { Contact } from "@/components/sections/Contact";

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Featured />
        <Team />
        <Experience />
        <CtaBand />
        <Contact />
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
