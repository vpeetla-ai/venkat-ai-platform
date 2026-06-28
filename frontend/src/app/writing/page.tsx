import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/portfolio/article-card";
import { DistributionGrid } from "@/components/portfolio/distribution-grid";
import { Section } from "@/components/portfolio/section";
import { articles, profile } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Writing",
  description: "AI architecture essays on agentic systems, RAG, LangGraph, and enterprise modernization.",
};

export default function WritingPage() {
  return (
    <div className="space-y-16">
      <header className="max-w-3xl space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal-400">Writing</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Architecture essays & distribution flywheel
        </h1>
        <p className="text-base leading-relaxed text-zinc-400">
          Publishing 2–3 articles per week across Substack, Medium, and LinkedIn. This portfolio is the
          canonical hub — long-form depth lives here; social channels drive discovery and executive signal.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={profile.links.substack}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-teal-950 hover:bg-teal-400"
          >
            Subscribe on Substack
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-500"
          >
            Follow on LinkedIn
          </a>
        </div>
      </header>

      <Section
        eyebrow="Portfolio articles"
        title="Deep dives"
        description="Each essay is structured for principal-level readers: decision under uncertainty, tradeoffs, and reversal criteria."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} featured={a.featured} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Publishing workflow"
        title="How the flywheel works"
        description="Write once at portfolio depth → syndicate to Substack and Medium → distill hooks on LinkedIn → link back to case studies and GitHub proof."
      >
        <DistributionGrid />
      </Section>

      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm text-zinc-400">
        <p>
          <strong className="text-zinc-200">Update your links:</strong> edit{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-teal-300">
            frontend/src/lib/portfolio.ts
          </code>{" "}
          with live Substack/Medium URLs as publications go live. Article bodies live in{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-teal-300">
            article-content.ts
          </code>
          .
        </p>
        <p className="mt-3">
          <Link href="/architecture" className="font-medium text-teal-400 hover:text-teal-300">
            Pair essays with architecture pillars →
          </Link>
        </p>
      </div>
    </div>
  );
}
