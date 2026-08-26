import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { ContactForm } from "@/components/contact-form";
import { FaqSection } from "@/components/faq-section";
import { HeroSection } from "@/components/hero-section";
import { LawyerCard } from "@/components/lawyer-card";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { getAdminContent } from "@/lib/admin-content";
import { getManagedFirm, getManagedLawyers, getManagedServices, getManagedWhyChooseUs } from "@/lib/managed-content";

export const metadata: Metadata = {
  alternates: { canonical: "/" }
};

export default async function HomePage() {
  const adminContent = await getAdminContent();
  const managedServices = getManagedServices(adminContent);
  const managedLawyers = getManagedLawyers(adminContent);
  const firm = getManagedFirm(adminContent);
  const whyChooseUs = getManagedWhyChooseUs(adminContent);
  const { about, blogPosts, faqs } = adminContent;

  return (
    <>
      <HeroSection content={adminContent.hero} firm={firm} />

      <FadeUp>
      <section className="section grid items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <SectionHeading eyebrow="Tentang Kami" title="Selamat Datang ke Firma Nuaim Razak & Partners" />
          <div className="mt-7 space-y-4 text-base leading-8 text-muted sm:text-lg">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ButtonLink href="/tentang-kami" variant="secondary" className="mt-9">
            Ketahui Tentang Firma
          </ButtonLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {whyChooseUs.map(({ title, copy, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-line bg-white p-6 shadow-subtle">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-200/70">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{copy}</p>
            </article>
          ))}
        </div>
      </section>
      </FadeUp>

      <FadeUp>
      <section className="bg-white">
        <div className="section">
          <SectionHeading
            eyebrow="Kepakaran Kami"
            title="Bidang Amalan"
            description="Khidmat guaman Syarie untuk individu dan keluarga yang memerlukan nasihat serta tindakan undang-undang Syariah."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {managedServices.map((service) => (
              <ServiceCard key={service.title} {...service} ctaHref={`/bidang-amalan#${service.slug}`} />
            ))}
          </div>
        </div>
      </section>
      </FadeUp>

      <FadeUp>
      <section className="bg-navy-radial text-white">
        <div className="section">
          <SectionHeading
            eyebrow="Mengapa Pilih Kami"
            title="Pendekatan Yang Teliti, Sulit Dan Berhemah"
            description="Setiap urusan dikendalikan dengan tumpuan kepada kefahaman klien, kerahsiaan dan pembelaan hak melalui proses undang-undang Syariah."
            tone="dark"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map(({ title, copy, icon: Icon }) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-subtle backdrop-blur">
                <Icon className="h-8 w-8 text-gold-450" />
                <h3 className="mt-6 font-serif text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      </FadeUp>

      <FadeUp>
      <section className="bg-parchment">
        <div className="section">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Peguam" title="Pasukan Kami" description="Kenali pengalaman, kelayakan dan bidang amalan rakan kongsi firma." />
            <ButtonLink href="/peguam" variant="secondary">
              Lihat Semua Peguam
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {managedLawyers.map((lawyer) => (
              <LawyerCard key={lawyer.name} {...lawyer} />
            ))}
          </div>
        </div>
      </section>
      </FadeUp>

      <FadeUp>
      <FaqSection faqs={faqs} />
      </FadeUp>

      <FadeUp>
      <section className="bg-[#071827] text-white">
        <div className="section flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 h-px w-16 bg-gold-450" />
            <h2 className="font-serif text-4xl font-semibold sm:text-5xl">Perlukan Nasihat Guaman Syarie?</h2>
            <p className="mt-5 max-w-2xl leading-8 text-white/75">
              Hubungi kami untuk menetapkan sesi konsultasi dan mendapatkan panduan awal berkenaan isu perundangan Syariah anda.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/temujanji" variant="gold">
              Buat Temujanji
            </ButtonLink>
            <a
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              href={firm.whatsappHref}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Kami
            </a>
          </div>
        </div>
      </section>
      </FadeUp>

      <FadeUp>
      <section className="section">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Artikel" title="Artikel & Perkongsian" description="Perkongsian berkaitan keluarga, masyarakat, Islam dan undang-undang Syariah." />
          <Link href="/artikel" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700">
            Lihat artikel <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <article key={post.title} className="flex flex-col rounded-3xl border border-line bg-white p-7 shadow-subtle">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-700">
                {post.category} / {post.date}
              </p>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">{post.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{post.excerpt}</p>
              <a href={post.href} target="_blank" rel="noreferrer" className="focus-ring mt-auto pt-6 text-sm font-semibold text-gold-700">
                Baca artikel penuh
              </a>
            </article>
          ))}
        </div>
      </section>
      </FadeUp>

      <FadeUp>
      <section className="bg-white">
        <div className="section grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-navy-radial p-7 text-white shadow-premium sm:p-9">
            <div className="h-px w-16 bg-gold-450" />
            <h2 className="mt-6 font-serif text-4xl font-semibold">Hubungi Kami</h2>
            <p className="mt-4 leading-8 text-white/74">
              Tetapkan temujanji awal atau hubungi firma untuk pertanyaan berkaitan khidmat guaman Syarie.
            </p>
            <div className="mt-8 grid gap-4">
              <ContactLine icon={Phone} label="Telefon" value={firm.phoneDisplay} href={firm.phoneHref} />
              <ContactLine icon={Mail} label="Email" value={firm.email} href={firm.emailHref} />
              <ContactLine icon={MapPin} label="Alamat" value={firm.address} href={firm.mapHref} />
              <ContactLine icon={Clock} label="Waktu operasi" value={firm.hours} />
            </div>
            <a className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-gold-450 px-5 text-sm font-semibold text-navy-950 transition hover:bg-gold-550" href={firm.whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp Kami
            </a>
          </div>
          <ContactForm whatsappNumber={firm.whatsappNumber} />
        </div>
      </section>
      </FadeUp>
    </>
  );
}

function ContactLine({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href?: string }) {
  const content = (
    <span className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <Icon className="mt-1 h-5 w-5 flex-none text-gold-450" />
      <span>
        <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-gold-100">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-white/78">{value}</span>
      </span>
    </span>
  );

  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
      {content}
    </a>
  ) : (
    content
  );
}
