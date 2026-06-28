import { distributionChannels } from "@/lib/portfolio";

export function DistributionGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {distributionChannels.map((ch) => (
        <a
          key={ch.id}
          href={ch.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-6 transition hover:border-teal-800/50 hover:bg-zinc-900/45"
        >
          <h3 className="text-base font-semibold text-white group-hover:text-teal-50">{ch.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{ch.body}</p>
          <span className="mt-4 text-sm font-medium text-teal-400 transition group-hover:text-teal-300">
            {ch.cta} →
          </span>
        </a>
      ))}
    </div>
  );
}
