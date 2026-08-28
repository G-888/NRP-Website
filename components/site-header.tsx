"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Menu, MessageCircle, Music2, X } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/button-link";
import type { getManagedFirm } from "@/lib/managed-content";
import { navigation } from "@/lib/site-data";

export function SiteHeader({ firm }: { firm: ReturnType<typeof getManagedFirm> }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="animate-header-in sticky top-0 z-40 border-b border-line/80 bg-ivory/90 shadow-[0_8px_28px_rgba(7,24,39,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md">
          <Image src="/images/blue-logo-nrp.png" alt={firm.name} width={152} height={50} className="h-11 w-auto" priority />
        </Link>
        <nav className="hidden items-center gap-4 xl:gap-6 lg:flex" aria-label="Navigasi utama">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-sm font-semibold transition after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-gold-450 after:transition-all hover:text-navy-950 hover:after:w-full ${active ? "text-navy-950 after:w-full" : "text-ink after:w-0"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-navy-900 transition hover:border-gold-450 hover:text-gold-700" href={firm.whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp Kami">
            <MessageCircle className="h-5 w-5" />
          </a>
          <ButtonLink href="/temujanji">Buat Temujanji</ButtonLink>
        </div>
        <button
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-navy-900 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="animate-menu-in border-t border-line bg-ivory px-4 py-4 shadow-premium lg:hidden">
          <nav className="premium-card flex flex-col gap-1 p-3" aria-label="Navigasi mudah alih">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-4 py-3 text-base font-semibold text-ink transition ${active ? "bg-parchment" : "hover:bg-parchment"}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <a className="mx-1 mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 text-sm font-semibold text-navy-900" href={firm.whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp Kami
            </a>
            <div className="mx-1 mt-2 grid grid-cols-2 gap-2">
              {firm.facebookHref ? <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-3 text-sm font-semibold text-navy-900" href={firm.facebookHref} target="_blank" rel="noreferrer"><Facebook className="h-4 w-4" />Facebook</a> : null}
              {firm.tiktokHref ? <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-3 text-sm font-semibold text-navy-900" href={firm.tiktokHref} target="_blank" rel="noreferrer"><Music2 className="h-4 w-4" />TikTok</a> : null}
            </div>
            <ButtonLink href="/temujanji" className="mx-1 mt-2 rounded-2xl" onClick={() => setOpen(false)}>
              Buat Temujanji
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
