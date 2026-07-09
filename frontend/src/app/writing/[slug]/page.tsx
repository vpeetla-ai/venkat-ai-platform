import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag } from "@/components/portfolio/tag";
import { articleBodies } from "@/lib/article-content";
import { articles, getArticleBySlug, profile } from "@/lib/portfolio";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.summary,
    openGraph: { title: article.title, description: article.summary },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const body = articleBodies[slug];
  if (!article || !body) notFound();

  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-5 border-b border-slate-200 pb-8">
        <Link href="/writing" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          ← All writing
        </Link>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <time dateTime={article.publishedAt}>{date}</time>
          <span aria-hidden>·</span>
          <span>{article.readMinutes} min read</span>
          <span aria-hidden>·</span>
          <span>{profile.name}</span>
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl">
          {article.title}
        </h1>
        <p className="text-lg leading-relaxed text-slate-600">{article.summary}</p>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </header>

      <div className="prose-portfolio">
        {body.sections.map((section, i) => (
          <div key={i}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.paragraphs?.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>

      <aside className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-blue-700">Takeaway</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-800">{body.takeaway}</p>
      </aside>

      <footer className="flex flex-wrap gap-4 border-t border-slate-200 pt-8 text-sm">
        <span className="text-slate-500">Also on:</span>
        <a
          href={profile.links.substack}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          Substack
        </a>
        <a
          href={profile.links.medium}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          Medium
        </a>
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          LinkedIn
        </a>
      </footer>
    </article>
  );
}
