import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { aboutParagraphs } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Latar belakang, komitmen dan pengalaman Nuaim Razak & Partners dalam khidmat guaman Syarie."
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Firma Guaman Syarie Yang Dibina Atas Komitmen Membela Hak"
        description="Ketahui latar belakang Nuaim Razak & Partners, pengalaman firma di Mahkamah Syariah dan nilai profesional yang membimbing setiap tugasan kami."
      />
      <section className="section grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading title="Kisah Firma" />
          <div className="mt-7 space-y-4 text-base leading-8 text-muted sm:text-lg">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <Image src="/images/founders.png" alt="Pengasas Nuaim Razak & Partners" width={900} height={980} className="rounded-[2rem] border border-line bg-white object-cover object-top shadow-premium" />
      </section>
      <section className="bg-white">
        <div className="section grid gap-6 md:grid-cols-3">
          {[
            ["Misi", "Memberikan khidmat guaman Syarie yang jelas, tersusun dan berhemah kepada klien yang memerlukan panduan undang-undang Syariah."],
            ["Pengalaman Mahkamah Syariah", "Firma mempunyai pengalaman mengendalikan kes di Mahkamah Rendah Syariah, Mahkamah Tinggi Syariah dan Mahkamah Rayuan Syariah."],
            ["Nilai Profesional", "Setiap perkara dikendalikan dengan teliti, sulit, hormat dan berfokus kepada pembelaan hak melalui saluran undang-undang Syariah."]
          ].map(([title, copy]) => (
            <article key={title} className="rounded-3xl border border-line bg-ivory p-7 shadow-subtle">
              <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
              <p className="mt-4 leading-7 text-muted">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
