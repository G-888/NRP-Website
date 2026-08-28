"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AdminGalleryItem } from "@/lib/admin-content";

function formatDate(value: string) {
  if (!value) return "";
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  return value;
}

export function GalleryGrid({ items }: { items: AdminGalleryItem[] }) {
  const [category, setCategory] = useState("Semua");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const categories = useMemo(() => ["Semua", ...Array.from(new Set(items.map((item) => item.category).filter(Boolean)))], [items]);
  const visibleItems = category === "Semua" ? items : items.filter((item) => item.category === category);
  const selected = selectedIndex === null ? null : visibleItems[selectedIndex];

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") setSelectedIndex((current) => current === null ? null : (current - 1 + visibleItems.length) % visibleItems.length);
      if (event.key === "ArrowRight") setSelectedIndex((current) => current === null ? null : (current + 1) % visibleItems.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, visibleItems.length]);

  function changeCategory(value: string) {
    setCategory(value);
    setSelectedIndex(null);
  }

  if (!items.length) {
    return (
      <div className="premium-card mx-auto max-w-2xl px-6 py-14 text-center">
        <ImageIcon className="mx-auto h-10 w-10 text-gold-500" aria-hidden="true" />
        <h2 className="mt-5 font-serif text-2xl font-semibold text-ink">Foto akan dikongsikan tidak lama lagi</h2>
        <p className="mt-3 leading-7 text-muted">Ikuti halaman ini untuk aktiviti dan perkembangan terkini firma.</p>
      </div>
    );
  }

  return (
    <>
      {categories.length > 2 ? (
        <div className="mb-10 flex flex-wrap gap-2" aria-label="Tapis galeri mengikut kategori">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => changeCategory(item)}
              aria-pressed={category === item}
              className={`focus-ring rounded-full border px-5 py-2.5 text-sm font-semibold transition ${category === item ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white text-ink hover:border-gold-450 hover:text-navy-950"}`}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item, index) => (
          <article key={`${item.image}-${index}`} className="group overflow-hidden rounded-3xl border border-line bg-white shadow-subtle transition duration-300 hover:-translate-y-1 hover:shadow-premium">
            <button type="button" onClick={() => setSelectedIndex(index)} className="focus-ring relative block aspect-[4/3] w-full overflow-hidden bg-parchment text-left" aria-label={`Buka foto: ${item.title}`}>
              <Image src={item.image} alt={item.imageAlt || item.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
              <span className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy-950/80 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-within:opacity-100" aria-hidden="true">
                <Expand className="h-4 w-4" />
              </span>
            </button>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-gold-700">
                <span>{item.category || "Umum"}</span>
                {item.date ? <><span aria-hidden="true">•</span><time>{formatDate(item.date)}</time></> : null}
              </div>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-ink">{item.title}</h2>
              {item.description ? <p className="mt-3 leading-7 text-muted">{item.description}</p> : null}
            </div>
          </article>
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelectedIndex(null)}>
          <button type="button" onClick={() => setSelectedIndex(null)} className="focus-ring absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white hover:bg-white/15" aria-label="Tutup foto">
            <X className="h-5 w-5" />
          </button>
          {visibleItems.length > 1 ? (
            <>
              <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedIndex((selectedIndex! - 1 + visibleItems.length) % visibleItems.length); }} className="focus-ring absolute left-3 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white hover:bg-white/15 sm:left-6" aria-label="Foto sebelumnya">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedIndex((selectedIndex! + 1) % visibleItems.length); }} className="focus-ring absolute right-3 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white hover:bg-white/15 sm:right-6" aria-label="Foto seterusnya">
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}
          <div className="flex h-full max-h-[88vh] w-full max-w-6xl flex-col" onClick={(event) => event.stopPropagation()}>
            <div className="relative min-h-0 flex-1">
              <Image src={selected.image} alt={selected.imageAlt || selected.title} fill sizes="100vw" className="object-contain" priority />
            </div>
            <div className="mx-auto max-w-3xl pt-5 text-center text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-100">{selected.category}{selected.date ? ` • ${formatDate(selected.date)}` : ""}</p>
              <h2 className="mt-2 font-serif text-xl font-semibold sm:text-2xl">{selected.title}</h2>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
