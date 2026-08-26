import type { Metadata } from "next";
import { BlogFilter } from "@/components/blog-filter";
import { PageHero } from "@/components/page-hero";
import { getAdminContent } from "@/lib/admin-content";

export const metadata: Metadata = {
  title: "Artikel",
  description: "Senarai artikel Nuaim Razak & Partners berkaitan Malaysia, Islam dan undang-undang keluarga.",
  alternates: { canonical: "/artikel" }
};

export default async function ArticlesPage() {
  const adminContent = await getAdminContent();
  return (
    <>
      <PageHero {...adminContent.pageHeroes.articles} />
      <section className="section">
        <BlogFilter blogPosts={adminContent.blogPosts} />
      </section>
    </>
  );
}
