import { Clock, Mail, Phone } from "lucide-react";
import type { getManagedFirm } from "@/lib/managed-content";

export function TopContactBar({ firm }: { firm: ReturnType<typeof getManagedFirm> }) {
  return (
    <div className="hidden border-b border-line/10 bg-[#071827] text-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-2.5 text-sm">
        <div className="flex items-center gap-6">
          <a className="inline-flex items-center gap-2 text-white/78 transition hover:text-gold-100" href={firm.phoneHref}>
            <Phone className="h-4 w-4 text-gold-450" />
            {firm.phoneDisplay}
          </a>
          <a className="inline-flex items-center gap-2 text-white/78 transition hover:text-gold-100" href={firm.emailHref}>
            <Mail className="h-4 w-4 text-gold-450" />
            {firm.email}
          </a>
        </div>
        <span className="inline-flex items-center gap-2 text-white/85">
          <Clock className="h-4 w-4 text-gold-450" />
          {firm.hours}
        </span>
      </div>
    </div>
  );
}
