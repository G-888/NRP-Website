import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { firm } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Hubungi Nuaim Razak & Partners untuk temujanji konsultasi guaman Syarie di Bandar Puteri Bangi, Kajang, Selangor."
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Hubungi Kami"
        title="Tetapkan Temujanji Konsultasi Guaman Syarie"
        description="Hubungi kami melalui telefon, WhatsApp, email atau borang pertanyaan. Pihak firma akan menghubungi anda semula mengikut maklumat yang diberikan."
      />
      <section className="section grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <ContactCard icon={Phone} title="Telefon" href={firm.phoneHref} text={firm.phoneDisplay} />
          <ContactCard icon={Mail} title="Email" href={firm.emailHref} text={firm.email} />
          <ContactCard icon={Clock} title="Waktu Operasi" text={firm.hours} />
          <ContactCard icon={MapPin} title="Alamat" href={firm.mapHref} text={firm.address} />
          <div className="rounded-3xl border border-line bg-white p-7 shadow-subtle">
            <h2 className="font-serif text-2xl font-semibold text-ink">Lokasi Pejabat</h2>
            <p className="mt-3 leading-7 text-muted">{firm.address}</p>
            <ButtonLink href={firm.mapHref} variant="secondary" className="mt-5" target="_blank">
              Buka Google Maps
            </ButtonLink>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}

function ContactCard({ icon: Icon, title, text, href }: { icon: typeof Phone; title: string; text: string; href?: string }) {
  const content = (
    <div className="rounded-3xl border border-line bg-white p-7 shadow-subtle transition hover:border-gold-450">
      <Icon className="h-6 w-6 text-gold-700" />
      <h2 className="mt-4 font-semibold text-ink">{title}</h2>
      <p className="mt-2 break-words leading-7 text-muted">{text}</p>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
      {content}
    </a>
  ) : (
    content
  );
}
