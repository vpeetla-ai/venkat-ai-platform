import { productionBlueprint } from "@/lib/architecture";
import { profile } from "@/lib/portfolio";

export function ArchitectureBlueprint() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-sm font-medium leading-relaxed text-slate-800">{productionBlueprint.thesis}</p>
        <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-blue-700">
          {productionBlueprint.shift}
        </p>
      </div>

      <ol className="space-y-2">
        {productionBlueprint.layers.map((layer, i) => (
          <li
            key={layer.id}
            className="group flex gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-blue-200"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-700">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{layer.name}</h3>
                <a
                  href={`${profile.links.substack}/p/${layer.substackSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-medium uppercase tracking-wide text-slate-500 transition hover:text-blue-600"
                >
                  Essay →
                </a>
              </div>
              <p className="mt-1 text-sm leading-snug text-slate-600">{layer.role}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
