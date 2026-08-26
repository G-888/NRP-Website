import type { Metadata } from "next";
import Image from "next/image";
import { Mail } from "lucide-react";
import { CertificateViewer } from "@/components/certificate-viewer";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { getAdminContent } from "@/lib/admin-content";
import { getManagedLawyers } from "@/lib/managed-content";

export const metadata: Metadata = {
  title: "Peguam",
  description: "Profil rakan kongsi Nuaim Razak & Partners serta pengalaman mereka sebagai Peguam Syarie.",
  alternates: { canonical: "/peguam" }
};

export default async function LawyersPage() {
  const adminContent = await getAdminContent();
  const managedLawyers = getManagedLawyers(adminContent);

  return (
    <>
      <PageHero
        eyebrow="Peguam"
        title="Pasukan Rakan Kongsi Nuaim Razak & Partners"
        description="Kenali kelayakan, pengalaman dan negeri amalan setiap rakan kongsi firma."
      />
      <section className="section">
        <SectionHeading title="Profil Peguam" description="Maklumat profesional dan bidang pengalaman pasukan guaman Syarie kami." />
        <div className="mt-12 space-y-8">
          {managedLawyers.map((lawyer) => (
            <article key={lawyer.name} className="grid gap-8 overflow-hidden rounded-[2rem] border border-line bg-white p-6 shadow-subtle lg:grid-cols-[320px_1fr] lg:p-7">
              <Image src={lawyer.image} alt={lawyer.name} width={640} height={960} className="aspect-[4/5] w-full rounded-3xl object-cover object-top shadow-subtle" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-700">{lawyer.role}</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">{lawyer.name}</h2>
                <p className="mt-5 leading-8 text-muted">{lawyer.practice}</p>
                {lawyer.email ? (
                  <a href={`mailto:${lawyer.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-700">
                    <Mail className="h-4 w-4" />
                    {lawyer.email}
                  </a>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-line bg-ivory px-3 py-1 text-xs font-semibold text-navy-800">Guaman Syarie</span>
                  <span className="rounded-full border border-line bg-ivory px-3 py-1 text-xs font-semibold text-navy-800">Mahkamah Syariah</span>
                </div>
                <h3 className="mt-7 font-semibold text-ink">Kelayakan dan pengalaman</h3>
                <ul className="mt-4 grid gap-3 text-sm leading-7 text-muted">
                  {lawyer.qualifications.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 flex-none rounded-full bg-gold-450" />
                      {item}
                    </li>
                  ))}
                </ul>
                <CertificateViewer
                  certificates={Array.from(
                    new Map([...lawyer.certificates, ...(adminContent.certificates[lawyer.name] ?? [])].map((certificate) => [certificate.href, certificate])).values()
                  )}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
