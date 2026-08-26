import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAdminContent, getPublishedArticles } from "@/lib/admin-content";

export const dynamicParams = false;

function isoArticleDate(value: string) {
  const [day, month, year] = value.split("/").map(Number);
  if (!year || !month || !day) return "2021-11-28";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export async function generateStaticParams() {
  const content = await getAdminContent();
  return getPublishedArticles(content).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const content = await getAdminContent();
  const article = getPublishedArticles(content).find((post) => post.slug === slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/${article.slug}` },
    openGraph: {
      type: "article",
      locale: "ms_MY",
      url: `https://www.nuaimrazak.com/${article.slug}`,
      title: article.title,
      description: article.excerpt,
      publishedTime: isoArticleDate(article.date),
      images: [{ url: article.image, alt: article.title }]
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.excerpt, images: [article.image] }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getAdminContent();
  const articles = getPublishedArticles(content);
  const article = articles.find((post) => post.slug === slug);
  if (!article) notFound();

  const related = articles.filter((post) => post.slug !== article.slug).slice(0, 3);
  const canonicalUrl = `https://www.nuaimrazak.com/${article.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `https://www.nuaimrazak.com${article.image}`,
    datePublished: isoArticleDate(article.date),
    dateModified: isoArticleDate(article.date),
    mainEntityOfPage: canonicalUrl,
    author: { "@type": "Organization", name: content.site.name, url: "https://www.nuaimrazak.com" },
    publisher: {
      "@type": "Organization",
      name: content.site.name,
      logo: { "@type": "ImageObject", url: "https://www.nuaimrazak.com/images/blue-logo-nrp.png" }
    }
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <header className="bg-navy-950 text-white">
        <div className="section pb-14 pt-12 sm:pb-18 sm:pt-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span><Link href="/artikel" className="hover:text-white">Artikel</Link><span>/</span><span aria-current="page" className="text-white">{article.category}</span>
          </nav>
          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-350">{article.category}</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{article.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">{article.excerpt}</p>
            <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-white/70"><CalendarDays className="h-4 w-4 text-gold-350" />{article.date}</p>
          </div>
        </div>
      </header>

      <div className="section grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <Image src={article.image} alt={article.title} width={1000} height={650} priority className="aspect-[16/9] w-full object-cover" />
          <div className="article-content mt-10"><ReactMarkdown>{article.content}</ReactMarkdown></div>
        </div>
        <aside className="border-l-2 border-gold-450 pl-6 lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-700">Perlukan nasihat?</p>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">Bincangkan situasi anda dengan pihak firma.</h2>
          <p className="mt-4 text-sm leading-7 text-muted">Setiap perkara bergantung pada fakta dan dokumen. Tetapkan konsultasi untuk penilaian awal.</p>
          <Link href="/temujanji" className="mt-6 inline-flex min-h-11 items-center gap-2 bg-navy-950 px-4 text-sm font-semibold text-white">Buat Temujanji<ArrowRight className="h-4 w-4" /></Link>
        </aside>
      </div>

      <section className="border-t border-line bg-white">
        <div className="section">
          <Link href="/artikel" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700"><ArrowLeft className="h-4 w-4" />Kembali ke semua artikel</Link>
          {related.length ? <><h2 className="mt-10 font-serif text-3xl font-semibold text-ink">Artikel berkaitan</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{related.map((post) => <Link key={post.slug} href={`/${post.slug}/`} className="border-t-2 border-gold-450 pt-5"><span className="text-xs font-bold uppercase text-gold-700">{post.category}</span><span className="mt-2 block font-serif text-xl font-semibold text-ink">{post.title}</span></Link>)}</div></> : null}
        </div>
      </section>
    </article>
  );
}
