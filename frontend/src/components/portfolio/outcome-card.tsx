import type { Outcome } from "@/lib/portfolio";
import { Tag } from "./tag";

export function OutcomeCard({ outcome }: { outcome: Outcome }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-6 transition hover:border-teal-800/50 hover:bg-zinc-900/45">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-400/90">{outcome.impact}</p>
      <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-teal-50">{outcome.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{outcome.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {outcome.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </article>
  );
}
