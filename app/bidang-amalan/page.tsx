import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { getAdminContent } from "@/lib/admin-content";
import { getManagedServices } from "@/lib/managed-content";

export const metadata: Metadata = {
  title: "Bidang Amalan",
  description: "Bidang amalan guaman Syarie Nuaim Razak & Partners termasuk perkahwinan, keluarga Islam, faraid, hibah, wasiat dan jenayah Syariah.",
  alternates: { canonical: "/bidang-amalan" }
};

export default async function ServicesPage() {
  const adminContent = await getAdminContent();
  const managedServices = getManagedServices(adminContent);

  return (
    <>
      <PageHero
        eyebrow="Bidang Amalan"
        title="Khidmat Guaman Syarie Untuk Isu Keluarga, Harta Islam Dan Jenayah Syariah"
        description="Setiap kes memerlukan penelitian fakta, dokumen dan prosedur. Berikut ialah bidang utama yang dikendalikan oleh firma."
      />
      <section className="section">
        <SectionHeading title="Perkhidmatan Guaman Syarie" description="Penerangan ringkas tentang skop khidmat yang boleh dibincangkan bersama pihak firma." />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {managedServices.map((service) => (
            <ServiceCard key={service.title} {...service} id={service.slug} detailed ctaHref="/temujanji" ctaLabel="Buat pertanyaan" />
          ))}
        </div>
      </section>
      <section className="bg-navy-radial text-white">
        <div className="section flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-5 h-px w-16 bg-gold-450" />
            <h2 className="font-serif text-4xl font-semibold">Tidak pasti kategori kes anda?</h2>
            <p className="mt-3 max-w-2xl text-white/75">Hubungi kami untuk semakan awal dan penetapan temujanji konsultasi.</p>
          </div>
          <ButtonLink href="/temujanji" variant="gold">Buat Temujanji</ButtonLink>
        </div>
      </section>
    </>
  );
}
