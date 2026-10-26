import { WhatsAppIcon } from "@/components/primitives/WhatsAppIcon";
import { contactInfo } from "@/content/contact";

export function WhatsAppFloat() {
  return (
    <a
      href={contactInfo.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full text-[#0F1E33] shadow-[0_6px_20px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:scale-105 active:scale-95"
      style={{ backgroundColor: "#25D366" }}
    >
      <WhatsAppIcon className="size-8" />
    </a>
  );
}
