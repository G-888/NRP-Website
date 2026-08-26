import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { getAdminContent } from "@/lib/admin-content";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Latar belakang, komitmen dan pengalaman Nuaim Razak & Partners dalam khidmat guaman Syarie.",
  alternates: { canonical: "/tentang-kami" }
};

export default async function AboutPage() {
  const adminContent = await getAdminContent();
  const { about } = adminContent;
  return (
    <>
      <PageHero {...adminContent.pageHeroes.about} />
      <section className="section grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading title={about.heading} />
          <div className="mt-7 space-y-4 text-base leading-8 text-muted sm:text-lg">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <Image
          src={about.image}
          alt={about.imageAlt}
          width={900}
          height={980}
          className="rounded-[2rem] border border-line bg-white object-cover object-top shadow-premium"
        />
      </section>
      <section className="bg-white">
        <div className="section grid gap-6 md:grid-cols-3">
          {about.values.map(({ title, copy }) => (
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
