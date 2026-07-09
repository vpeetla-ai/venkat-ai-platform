import type { Outcome } from "@/lib/portfolio";
import { Tag } from "./tag";

export function OutcomeCard({ outcome }: { outcome: Outcome }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{outcome.impact}</p>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{outcome.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{outcome.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {outcome.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </article>
  );
}
