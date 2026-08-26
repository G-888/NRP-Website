"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopContactBar } from "@/components/top-contact-bar";
import { WhatsappFloatingButton } from "@/components/whatsapp-floating-button";
import type { getManagedFirm } from "@/lib/managed-content";

type SiteShellProps = {
  children: ReactNode;
  firm: ReturnType<typeof getManagedFirm>;
  services: Array<{ title: string; slug: string }>;
};

export function SiteShell({ children, firm, services }: SiteShellProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <a href="#main-content" className="focus-ring sr-only z-[100] rounded-md bg-white px-4 py-3 font-semibold text-navy-950 shadow-premium focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Langkau ke kandungan utama
      </a>
      <TopContactBar firm={firm} />
      <SiteHeader firm={firm} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <SiteFooter firm={firm} services={services} />
      <WhatsappFloatingButton firm={firm} />
    </>
  );
}
