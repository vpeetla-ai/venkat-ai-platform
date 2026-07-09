import Link from "next/link";
import { ArticleCard } from "@/components/portfolio/article-card";
import { ArchitectureDiagram } from "@/components/portfolio/architecture-diagram";
import { DistributionGrid } from "@/components/portfolio/distribution-grid";
import { MetricsRow } from "@/components/portfolio/metrics-row";
import { OutcomeCard } from "@/components/portfolio/outcome-card";
import { LeadershipSection } from "@/components/portfolio/leadership-section";
import { PortfolioHero } from "@/components/portfolio/hero";
import { Section } from "@/components/portfolio/section";
import { Tag } from "@/components/portfolio/tag";
import {
  articles,
  caseStudies,
  expertise,
  getFeaturedArticle,
  outcomes,
  profile,
} from "@/lib/portfolio";

export default function Home() {
  const featured = getFeaturedArticle();

  return (
    <div className="space-y-20 md:space-y-24">
      <PortfolioHero />
      <MetricsRow />

      <Section
        eyebrow="Quantified outcomes"
        title="Proof points for recruiter screens and executive review"
        description="Decision ownership with measurable business impact — not vanity project lists."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {outcomes.map((o) => (
            <OutcomeCard key={o.title} outcome={o} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Featured architecture"
        title="Published architecture lens — Substack + live implementation"
        description="Aligned to Venkat on AI Architecture essays and LinkedIn theses: control plane, RAG intelligence, guardrails, HITL, and evaluation — not LLM + RAG + Vector DB demos."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="grid gap-4 md:grid-cols-2">
            {caseStudies.map((cs) => (
              <Link
                key={cs.slug}
                href={cs.href}
                className="group flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-6 transition hover:border-teal-800/50"
              >
                <div className="flex flex-wrap gap-2">
                  {cs.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-teal-50">{cs.title}</h3>
                <p className="mt-2 flex-1 text-sm text-zinc-400">{cs.summary}</p>
                <span className="mt-4 text-sm font-medium text-teal-400">View case study →</span>
              </Link>
            ))}
          </div>
          <ArchitectureDiagram />
        </div>
      </Section>

      <Section
        eyebrow="Latest writing"
        title="Architecture essays — portfolio hub, Substack, Medium, LinkedIn"
        description="Publishing 2–3 articles per week across channels. The portfolio is canonical; social posts drive discovery back to depth."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {featured ? (
            <div className="lg:col-span-1">
              <ArticleCard article={featured} featured />
            </div>
          ) : null}
          <div className="grid gap-4 lg:col-span-2 md:grid-cols-2">
            {articles
              .filter((a) => !a.featured)
              .map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link href="/architecture" className="text-sm font-medium text-teal-400 transition hover:text-teal-300">
            Full architecture section →
          </Link>
          <Link href="/writing" className="text-sm font-medium text-zinc-500 transition hover:text-zinc-300">
            Writing & distribution →
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="Core expertise"
        title="What principal-level buyers need to see"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {expertise.map((e) => (
            <div
              key={e.title}
              className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-5"
            >
              <h3 className="text-sm font-semibold text-white">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{e.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="leadership"
        eyebrow="Leadership"
        title="Principles & takeaways — how every essay and post closes"
        description="Substack deep-dives and LinkedIn posts share architecture depth, then land on leadership takeaways executives can act on. This is that lens on the portfolio."
      >
        <LeadershipSection />
      </Section>

      <Section
        eyebrow="Traffic flywheel"
        title="One portfolio, three distribution channels"
        description="Substack builds repeat audience. Medium expands discovery. LinkedIn signals executive readiness. GitHub proves implementation depth."
      >
        <DistributionGrid />
      </Section>

      <div className="rounded-3xl border border-teal-900/40 bg-gradient-to-r from-teal-950/40 to-zinc-900/40 p-8 text-center md:p-10">
        <h2 className="text-xl font-semibold text-white md:text-2xl">Explore the live platform demo</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
          Venkat AI Platform is the hands-on proof behind the architecture essays — multi-agent LangGraph,
          RAG, observability, and notification routing.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/chat"
            className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-teal-950 hover:bg-teal-400"
          >
            Open AI Chat demo
          </Link>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500"
          >
            View source on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
