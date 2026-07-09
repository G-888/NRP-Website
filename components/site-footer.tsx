import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { firm, navigation, services } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="bg-[#071827] text-white">
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-450 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Image src="/images/white-logo-nrp.png" alt={firm.name} width={170} height={56} className="h-12 w-auto" />
          <p className="mt-5 text-sm leading-7 text-white/72">
            Kami komited untuk memberikan khidmat guaman Syarie kepada anda dalam memastikan hak anda dibela dengan sewajarnya.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-100">Pautan</h2>
          <div className="mt-3 h-px w-10 bg-gold-450" />
          <div className="mt-4 grid gap-3 text-sm text-white/75">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-gold-100">
                {item.label}
              </Link>
            ))}
            <Link href="/temujanji" className="hover:text-gold-100">
              Buat Temujanji
            </Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-100">Bidang Amalan</h2>
          <div className="mt-3 h-px w-10 bg-gold-450" />
          <div className="mt-4 grid gap-3 text-sm text-white/75">
            {services.map((service) => (
              <Link key={service.title} href="/bidang-amalan" className="hover:text-gold-100">
                {service.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-100">Hubungi Kami</h2>
          <div className="mt-3 h-px w-10 bg-gold-450" />
          <div className="mt-4 grid gap-4 text-sm text-white/75">
            <a className="flex gap-3 hover:text-gold-100" href={firm.mapHref} target="_blank" rel="noreferrer">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-gold-450" />
              {firm.address}
            </a>
            <a className="flex gap-3 hover:text-gold-100" href={firm.phoneHref}>
              <Phone className="h-4 w-4 flex-none text-gold-450" />
              {firm.phoneDisplay}
            </a>
            <a className="flex gap-3 hover:text-gold-100" href={firm.emailHref}>
              <Mail className="h-4 w-4 flex-none text-gold-450" />
              {firm.email}
            </a>
            <span className="flex gap-3">
              <Clock className="h-4 w-4 flex-none text-gold-450" />
              {firm.hours}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/60">
        Copyright (c) {new Date().getFullYear()} {firm.name}. All Rights Reserved.
      </div>
    </footer>
  );
}
