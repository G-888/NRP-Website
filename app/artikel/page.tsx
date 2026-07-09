import type { Metadata } from "next";
import { BlogFilter } from "@/components/blog-filter";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Artikel",
  description: "Senarai artikel Nuaim Razak & Partners berkaitan Malaysia, Islam dan undang-undang keluarga."
};

export default function ArticlesPage() {
  return (
    <>
      <PageHero
        eyebrow="Artikel"
        title="Catatan Blog Dan Rujukan"
        description="Artikel sedia ada dikekalkan sebagai arkib bacaan dengan susun atur yang lebih kemas serta fungsi carian ringkas."
      />
      <section className="section">
        <BlogFilter />
      </section>
    </>
  );
}
