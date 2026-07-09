import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureBlueprint } from "@/components/portfolio/architecture-blueprint";
import { ArchitectureDiagram } from "@/components/portfolio/architecture-diagram";
import { Section } from "@/components/portfolio/section";
import { Tag } from "@/components/portfolio/tag";
import {
  architecturePillars,
  guardrailLayers,
  substackEssays,
} from "@/lib/architecture";
import { leadershipTakeaways } from "@/lib/leadership";
import { caseStudies, profile } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "Production enterprise AI architecture — control plane, RAG intelligence, guardrails, HITL, evaluation, and multi-agent orchestration. Aligned to Venkat on AI Architecture (Substack) and LinkedIn publishing.",
};

export default function ArchitecturePage() {
  return (
    <div className="space-y-16">
      <header className="max-w-3xl space-y-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Architecture</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Production enterprise AI architecture
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          This section reflects my published architecture lens on{" "}
          <a
            href={profile.links.substack}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Venkat on AI Architecture (Substack)
          </a>{" "}
          and{" "}
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            LinkedIn
          </a>
          : RAG helps AI <em className="text-slate-800">know</em>, agents help AI{" "}
          <em className="text-slate-800">do</em>, and the control plane decides whether the system can be{" "}
          <em className="text-slate-800">trusted</em>.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/chat"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Live reference implementation
          </Link>
          <a
            href={profile.links.substack}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          >
            Read on Substack
          </a>
        </div>
      </header>

      <Section
        eyebrow="2026 production blueprint"
        title="Beyond LLM + RAG + Vector DB"
        description="The ten-layer stack I publish and implement — orchestration as the brain, not the model alone."
      >
        <ArchitectureBlueprint />
      </Section>

      <Section
        eyebrow="Architecture pillars"
        title="Published themes mapped to implementation"
        description="Each pillar links to a Substack deep-dive and notes how Venkat AI Platform implements the pattern."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {architecturePillars.map((p) => (
            <article
              key={p.id}
              id={p.id}
              className="scroll-mt-24 flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-medium text-blue-700">{p.tagline}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{p.summary}</p>
              <blockquote className="mt-4 border-l-2 border-slate-200 pl-3 text-xs italic leading-relaxed text-slate-500">
                LinkedIn: {p.linkedinHook}
              </blockquote>
              {p.implementedInVap ? (
                <p className="mt-4 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">VAP: </span>
                  {p.implementedInVap}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <a
                href={p.substackHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Substack essay →
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="venkat-ai-platform"
        eyebrow="Reference implementation"
        title="Venkat AI Platform"
        description="Hands-on proof of the orchestrated multi-agent + multi-LLM pattern from my first Substack essay as an AI Architect."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-600">{caseStudies[0].summary}</p>
            {caseStudies[0].highlights.map((h) => (
              <div
                key={h}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-600" aria-hidden />
                {h}
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Open platform demo
              </Link>
              <a
                href={`${profile.links.substack}/p/orchestrated-multi-agent-multi-llm-architecture`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              >
                Originating Substack essay
              </a>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              >
                GitHub
              </a>
            </div>
          </div>
          <ArchitectureDiagram />
        </div>
      </Section>

      <Section
        eyebrow="Guardrails architecture"
        title="Trusted AI operations layer"
        description="From my LinkedIn guardrails framework — six runtime layers before business actions execute."
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {guardrailLayers.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Leadership takeaways"
        title="How architecture essays close for executives"
        description="Technical depth in the body — principles and leadership takeaways at the end. Same rhythm as Substack and LinkedIn."
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {leadershipTakeaways.slice(0, 4).map((t) => (
            <li key={t.takeaway.slice(0, 48)}>
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-slate-800 transition hover:border-amber-300 hover:shadow-sm"
              >
                <span className="font-medium text-slate-900">“{t.takeaway}”</span>
                <span className="mt-2 block text-xs text-slate-500">{t.source}</span>
              </a>
            </li>
          ))}
        </ul>
        <Link href="/#leadership" className="inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
          Full leadership principles on home →
        </Link>
      </Section>

      <Section eyebrow="Essay index" title="Venkat on AI Architecture — Substack series">
        <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {substackEssays.map((essay) => (
            <li key={essay.href}>
              <a
                href={essay.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm font-medium text-slate-900">{essay.title}</span>
                <time className="text-xs text-slate-500" dateTime={essay.date}>
                  {new Date(essay.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
