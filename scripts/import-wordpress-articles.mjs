import { readFile, writeFile } from "node:fs/promises";
import TurndownService from "turndown";

const contentPath = new URL("../data/admin-content.json", import.meta.url);
const legacySlugs = [
  "kita-adalah-penyambung-warisan",
  "cerai-dan-rujuk-bukannya-perkara-main-main",
  "ancaman-pihak-ketiga-dalam-perkahwinan",
  "ahlussunnah-wal-jamaah-golongan-yang-selamat"
];

const turndown = new TurndownService({
  bulletListMarker: "-",
  headingStyle: "atx"
});

function prepareLegacyHtml(html) {
  if (!html.includes("elementor-widget-container")) return html;

  const match = html.match(/<div class="elementor-widget-container">([\s\S]*?)<\/div>/);
  if (!match) return html;

  const paragraphs = match[1].trim().replace(/\r?\n\s*\r?\n/g, "</p><p>");
  return `<p>${paragraphs}</p>`;
}

function removeRepeatedTitle(markdown, title) {
  const blocks = markdown.split("\n\n");
  const comparable = (value) => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
  const firstBlock = blocks[0]?.replace(/^##\s+/, "") || "";
  return comparable(firstBlock) === comparable(title) ? blocks.slice(1).join("\n\n") : markdown;
}

async function fetchLegacyPost(slug) {
  const endpoint = `https://www.nuaimrazak.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`WordPress returned ${response.status} for ${slug}`);

  const posts = await response.json();
  if (!Array.isArray(posts) || !posts[0]?.content?.rendered) {
    throw new Error(`No WordPress article found for ${slug}`);
  }

  return posts[0];
}

const content = JSON.parse(await readFile(contentPath, "utf8"));
const imported = new Map();

for (const slug of legacySlugs) {
  const post = await fetchLegacyPost(slug);
  const markdown = removeRepeatedTitle(turndown
    .turndown(prepareLegacyHtml(post.content.rendered))
    .replace(/\u00a0/g, " ")
    .replace(/^\*\*(.+)\*\*$/gm, "## $1")
    .replace(/\n{3,}/g, "\n\n")
    .trim(), post.title.rendered);

  imported.set(slug, { markdown, wordpressId: post.id });
}

content.blogPosts = content.blogPosts.map((post) => {
  let slug = post.slug || "";
  if (!slug && post.href) {
    try {
      slug = new URL(post.href, "https://www.nuaimrazak.com").pathname.split("/").filter(Boolean).at(-1) || "";
    } catch {
      slug = "";
    }
  }

  const migrated = imported.get(slug);
  if (!migrated) {
    return {
      ...post,
      slug,
      content: post.content || "",
      published: post.published ?? Boolean(slug || post.href)
    };
  }

  return {
    ...post,
    slug,
    href: `/${slug}/`,
    content: migrated.markdown,
    published: true,
    legacyWordpressId: migrated.wordpressId
  };
});

await writeFile(contentPath, `${JSON.stringify(content, null, 4)}\n`, "utf8");
console.log(`Imported ${imported.size} articles into ${contentPath.pathname}`);
