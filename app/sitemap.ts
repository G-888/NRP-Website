import type { MetadataRoute } from "next";

const baseUrl = "https://www.nuaimrazak.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/tentang-kami", "/bidang-amalan", "/peguam", "/artikel", "/hubungi-kami", "/temujanji", "/dasar-privasi"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-08-26"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/temujanji" || route === "/hubungi-kami" ? 0.9 : 0.7
  }));
}
