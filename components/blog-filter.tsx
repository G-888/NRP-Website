"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { AdminBlogPost } from "@/lib/admin-content";

export function BlogFilter({ blogPosts }: { blogPosts: AdminBlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const categories = ["Semua", ...Array.from(new Set(blogPosts.map((post) => post.category)))];

  const posts = useMemo(() => {
    const normalized = query.toLowerCase();
    return blogPosts.filter((post) => {
      const categoryMatch = category === "Semua" || post.category === category;
      const queryMatch = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(normalized);
      return categoryMatch && queryMatch;
    });
  }, [blogPosts, category, query]);

  return (
    <div>
      <div className="mb-10 grid gap-4 rounded-3xl border border-line bg-white p-4 shadow-subtle md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Cari artikel</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari artikel"
            className="min-h-12 w-full rounded-2xl border border-line bg-ivory/60 pl-12 pr-4 outline-none transition focus:border-gold-450 focus:bg-white"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`focus-ring min-h-10 rounded-full px-4 text-sm font-semibold transition ${
                category === item ? "bg-navy-900 text-white" : "border border-line bg-white text-navy-800 hover:border-gold-450"
              }`}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-subtle transition hover:-translate-y-1 hover:shadow-premium">
              <Image src={post.image} alt={post.title} width={450} height={325} className="aspect-[4/2.7] w-full object-cover" />
              <div className="flex flex-1 flex-col p-7">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-gold-700">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">{post.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{post.excerpt}</p>
                <Link href={`/${post.slug}/`} className="focus-ring mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-gold-700">
                  Baca artikel penuh
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-3xl border border-line bg-white p-8 text-center text-muted">Tiada artikel ditemui.</p>
      )}
    </div>
  );
}
