"use client";

import Image from "next/image";
import { ExternalLink, FileText, X } from "lucide-react";
import { useState } from "react";

type Certificate = {
  negeri: string;
  title: string;
  href: string;
  type: "image" | "pdf";
};

type CertificateViewerProps = {
  certificates: Certificate[];
};

export function CertificateViewer({ certificates }: CertificateViewerProps) {
  const [selected, setSelected] = useState<Certificate | null>(null);

  if (!certificates.length) return null;

  return (
    <div className="mt-8">
      <h3 className="font-semibold text-ink">Sijil Amalan</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {certificates.map((certificate) => (
          <button
            key={certificate.href}
            type="button"
            onClick={() => setSelected(certificate)}
            className="group flex items-start gap-3 rounded-2xl border border-line bg-ivory p-4 text-left text-sm transition hover:border-gold-450 hover:bg-white"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gold-50 text-gold-700 ring-1 ring-gold-200/70">
              <FileText className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold text-ink">{certificate.negeri}</span>
              <span className="mt-1 block leading-6 text-muted">{certificate.title}</span>
              <span className="mt-2 inline-flex items-center gap-1 font-semibold text-gold-700">
                Lihat sijil
                <ExternalLink className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </span>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#071827]/82 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={selected.title}>
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-premium">
            <div className="flex items-start justify-between gap-4 border-b border-line bg-ivory px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">{selected.negeri}</p>
                <h4 className="mt-1 font-serif text-2xl font-semibold text-ink">{selected.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="focus-ring flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line bg-white text-ink"
                aria-label="Tutup paparan sijil"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-auto bg-neutral-100 p-4">
              {selected.type === "image" ? (
                <div className="relative mx-auto min-h-[70vh] w-full max-w-4xl">
                  <Image src={selected.href} alt={selected.title} fill sizes="90vw" className="object-contain" />
                </div>
              ) : (
                <iframe src={selected.href} title={selected.title} className="h-[70vh] w-full rounded-2xl bg-white" />
              )}
            </div>

            <div className="flex justify-end border-t border-line bg-white px-5 py-4">
              <a
                href={selected.href}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-navy-900 px-5 text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                Buka fail penuh
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
