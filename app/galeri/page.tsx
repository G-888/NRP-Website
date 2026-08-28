import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";
import { PageHero } from "@/components/page-hero";
import { getAdminContent, getPublishedGalleryItems } from "@/lib/admin-content";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Galeri foto aktiviti dan perkembangan terkini Nuaim Razak & Partners.",
  alternates: { canonical: "/galeri" }
};

export default async function GalleryPage() {
  const adminContent = await getAdminContent();
  return (
    <>
      <PageHero {...adminContent.pageHeroes.gallery} />
      <section className="section">
        <GalleryGrid items={getPublishedGalleryItems(adminContent)} />
      </section>
    </>
  );
}
