import type { Metadata } from "next";
import { BlogFilter } from "@/components/blog-filter";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Artikel",
  description: "Senarai artikel Nuaim Razak & Partners berkaitan Malaysia, Islam dan undang-undang keluarga.",
  alternates: { canonical: "/artikel" }
};

export default function ArticlesPage() {
  return (
    <>
      <PageHero
        eyebrow="Artikel"
        title="Catatan Blog Dan Rujukan"
        description="Himpunan perkongsian berkaitan keluarga, masyarakat, Islam dan isu undang-undang Syariah."
      />
      <section className="section">
        <BlogFilter />
      </section>
    </>
  );
}
