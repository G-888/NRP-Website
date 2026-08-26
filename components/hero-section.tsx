"use client";

import Image from "next/image";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Landmark,
  MessageCircle,
  ScrollText,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/button-link";
import type { AdminContent } from "@/lib/admin-content";
import { firm } from "@/lib/site-data";

const trustItems = [
  {
    title: "Mahkamah Syariah",
    description: "Pengalaman di Mahkamah Rendah, Mahkamah Tinggi dan Mahkamah Rayuan Syariah.",
    icon: Landmark
  },
  {
    title: "Kekeluargaan Islam",
    description: "Panduan untuk perceraian, rujuk, nafkah, hadhanah dan nasab.",
    icon: BriefcaseBusiness
  },
  {
    title: "Faraid, Hibah & Wasiat",
    description: "Nasihat berkaitan pusaka dan pengurusan harta Islam.",
    icon: ScrollText
  },
  {
    title: "Jenayah Syariah",
    description: "Bantuan guaman Syarie bagi proses pertuduhan dan pembelaan.",
    icon: ShieldCheck
  }
];

type HeroSectionProps = {
  content: AdminContent["hero"];
};

export function HeroSection({ content }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const headline = content.title.split("\n").filter(Boolean);
  const heroImage = content.images[0];

  return (
    <section className="relative isolate overflow-hidden bg-[#071827] text-white">
      <div className="absolute inset-0 bg-navy-radial" aria-hidden="true" />
      <div className="pattern-soft absolute inset-0 opacity-[0.12]" aria-hidden="true" />
      {heroImage ? (
        <div className="absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
          <Image
            src={heroImage.src}
            alt=""
            fill
            sizes="100vw"
            priority
            className="hero-image-in object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071827] via-[#071827]/70 to-[#071827]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071827]/85 via-transparent to-[#071827]/38" />
        </div>
      ) : null}

      <div className="section relative grid items-center gap-10 py-16 sm:py-20 lg:min-h-[760px] lg:grid-cols-[0.62fr_0.38fr] lg:py-10">
        <div className="relative z-10 max-w-3xl">
          <div className="hero-fade-up mb-4 flex items-center gap-4">
            <span className="h-px w-12 bg-gold-450" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-100">{content.eyebrow || firm.name}</p>
          </div>

          <h1 className="max-w-[780px] font-serif text-[2.55rem] font-semibold leading-[1.04] text-white sm:text-[3.35rem] lg:text-[3.35rem] xl:text-[3.6rem]">
            {headline.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <span className="hero-word" style={{ animationDelay: `${140 + index * 95}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-fade-up mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg" style={{ animationDelay: "520ms" }}>
            {content.paragraph}
          </p>

          <div className="hero-fade-up mt-7 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "640ms" }}>
            <ButtonLink href="/temujanji" className="group">
              Buat Temujanji
              <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
            </ButtonLink>
            <a
              href={firm.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="focus-ring group inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-subtle backdrop-blur transition hover:-translate-y-0.5 hover:border-gold-450 hover:bg-white/15"
            >
              <MessageCircle className="h-4 w-4 transition group-hover:scale-110" />
              WhatsApp Kami
            </a>
          </div>

          <div className="mt-7 hidden gap-2.5 sm:grid sm:grid-cols-2" aria-label="Sorotan khidmat">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              const selected = activeIndex === index;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`hero-fade-up focus-ring group inline-flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-left text-sm font-semibold shadow-subtle transition ${
                    selected
                      ? "border-gold-450 bg-navy-900 text-white"
                      : "border-white/14 bg-white/8 text-white hover:-translate-y-0.5 hover:border-gold-450 hover:bg-white/12"
                  }`}
                  style={{ animationDelay: `${760 + index * 90}ms` }}
                  aria-pressed={selected}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full transition ${selected ? "bg-gold-450/18" : "bg-white/10 group-hover:bg-gold-450/12"}`}>
                      <Icon className={`h-4 w-4 ${selected ? "text-gold-450" : "text-gold-100"}`} />
                    </span>
                    {item.title}
                  </span>
                  <CheckCircle2 className={`h-4 w-4 ${selected ? "text-gold-450" : "text-white/20"}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}
