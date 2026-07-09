import { MessageCircle } from "lucide-react";
import { firm } from "@/lib/site-data";

export function WhatsappFloatingButton() {
  return (
    <a
      href={firm.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Nuaim Razak & Partners"
      className="focus-ring fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-2xl transition hover:bg-green-700"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
