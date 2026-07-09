import Link from "next/link";
import type { Article } from "@/lib/portfolio";
import { Tag } from "./tag";

const channelLabel: Record<Article["channels"][number], string> = {
  portfolio: "Portfolio",
  substack: "Substack",
  medium: "Medium",
  linkedin: "LinkedIn",
};

function isExternal(href: string) {
  return href.startsWith("http");
}

export function ArticleCard({ article, featured }: { article: Article; featured?: boolean }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const className = `group flex h-full flex-col rounded-2xl border p-6 shadow-sm transition ${
    featured
      ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 hover:shadow-md"
      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
  }`;

  const inner = (
    <>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <time dateTime={article.publishedAt}>{date}</time>
        <span aria-hidden>·</span>
        <span>{article.readMinutes} min read</span>
        {featured ? (
          <>
            <span aria-hidden>·</span>
            <span className="font-medium text-blue-700">Featured</span>
          </>
        ) : null}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-900">{article.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{article.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {article.tags.slice(0, 4).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {article.channels.map((c) => (
          <span key={c} className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            {channelLabel[c]}
          </span>
        ))}
      </div>
    </>
  );

  if (isExternal(article.href)) {
    return (
      <a href={article.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={article.href} className={className}>
      {inner}
    </Link>
  );
}
