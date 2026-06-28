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

  const className = `group flex h-full flex-col rounded-2xl border p-6 transition ${
    featured
      ? "border-teal-800/60 bg-gradient-to-br from-teal-950/30 to-zinc-900/40 hover:border-teal-700/70"
      : "border-zinc-800/80 bg-zinc-900/25 hover:border-zinc-700 hover:bg-zinc-900/45"
  }`;

  const inner = (
    <>
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <time dateTime={article.publishedAt}>{date}</time>
        <span aria-hidden>·</span>
        <span>{article.readMinutes} min read</span>
        {featured ? (
          <>
            <span aria-hidden>·</span>
            <span className="font-medium text-teal-400">Featured</span>
          </>
        ) : null}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-white group-hover:text-teal-50">
        {article.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{article.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {article.tags.slice(0, 4).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {article.channels.map((c) => (
          <span key={c} className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
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
