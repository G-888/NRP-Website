import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { firm } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Temujanji Konsultasi",
  description: "Borang temujanji konsultasi guaman Syarie Nuaim Razak & Partners."
};

export default function AppointmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Temujanji"
        title="Buat Temujanji Konsultasi"
        description="Lengkapkan borang ringkas ini supaya pihak firma dapat memahami pertanyaan awal anda sebelum menghubungi semula."
      />
      <section className="section grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[2rem] border border-line bg-navy-radial p-7 text-white shadow-premium sm:p-8">
          <div className="h-px w-14 bg-gold-450" />
          <h2 className="mt-5 font-serif text-3xl font-semibold">Maklumat alternatif</h2>
          <p className="mt-4 leading-8 text-white/74">
            Jika pertanyaan anda memerlukan maklum balas segera, hubungi firma melalui telefon atau WhatsApp semasa waktu operasi.
          </p>
          <div className="mt-6 grid gap-3">
            <a href={firm.phoneHref} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-4 font-semibold text-white transition hover:bg-white/10">
              <Phone className="h-5 w-5" />
              {firm.phoneDisplay}
            </a>
            <a href={firm.whatsappHref} target="_blank" rel="noreferrer" className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gold-450 px-4 font-semibold text-navy-950 transition hover:bg-gold-550">
              <MessageCircle className="h-5 w-5" />
              WhatsApp Kami
            </a>
          </div>
          <p className="mt-6 text-sm leading-6 text-white/62">
            Nota: Borang ini belum disambungkan kepada backend penghantaran email. Integrasi boleh dibuat melalui API route atau penyedia email kemudian.
          </p>
        </aside>
        <ContactForm />
      </section>
    </>
  );
}
