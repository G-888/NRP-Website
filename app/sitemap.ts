import type { MetadataRoute } from "next";
import { getAdminContent, getPublishedArticles } from "@/lib/admin-content";

const baseUrl = "https://www.nuaimrazak.com";

export const dynamic = "force-static";

function articleDate(value: string) {
  const [day, month, year] = value.split("/").map(Number);
  return year && month && day ? new Date(Date.UTC(year, month - 1, day)) : new Date("2026-08-26");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/tentang-kami", "/bidang-amalan", "/peguam", "/galeri", "/artikel", "/hubungi-kami", "/temujanji", "/dasar-privasi"];
  const content = await getAdminContent();
  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-08-26"),
    changeFrequency: route === "" || route === "/galeri" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/temujanji" || route === "/hubungi-kami" ? 0.9 : 0.7
  }));

  return [...staticPages, ...getPublishedArticles(content).map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: articleDate(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.65
  }))];
}
