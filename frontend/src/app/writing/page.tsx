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
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Writing</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Architecture essays & distribution flywheel
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Publishing 2–3 articles per week across Substack, Medium, and LinkedIn. This portfolio is the
          canonical hub — long-form depth lives here; social channels drive discovery and executive signal.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={profile.links.substack}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Subscribe on Substack
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
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

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        <p>
          <strong className="text-slate-900">Update your links:</strong> edit{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-blue-800">
            frontend/src/lib/portfolio.ts
          </code>{" "}
          with live Substack/Medium URLs as publications go live. Article bodies live in{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-blue-800">
            article-content.ts
          </code>
          .
        </p>
        <p className="mt-3">
          <Link href="/architecture" className="font-medium text-blue-600 hover:text-blue-700">
            Pair essays with architecture pillars →
          </Link>
        </p>
      </div>
    </div>
  );
}
