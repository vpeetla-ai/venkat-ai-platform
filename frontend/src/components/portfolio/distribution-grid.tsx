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
          className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <h3 className="text-base font-semibold text-slate-900">{ch.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{ch.body}</p>
          <span className="mt-4 text-sm font-medium text-blue-600 transition group-hover:text-blue-700">
            {ch.cta} →
          </span>
        </a>
      ))}
    </div>
  );
}
