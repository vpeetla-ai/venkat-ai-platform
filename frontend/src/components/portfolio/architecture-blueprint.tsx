import { productionBlueprint } from "@/lib/architecture";
import { profile } from "@/lib/portfolio";

export function ArchitectureBlueprint() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-teal-900/40 bg-teal-950/20 p-6">
        <p className="text-sm font-medium leading-relaxed text-teal-100/90">{productionBlueprint.thesis}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-400/80">
          {productionBlueprint.shift}
        </p>
      </div>

      <ol className="space-y-2">
        {productionBlueprint.layers.map((layer, i) => (
          <li
            key={layer.id}
            className="group flex gap-4 rounded-xl border border-zinc-800/70 bg-zinc-900/25 px-4 py-3 transition hover:border-teal-800/40"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-xs font-semibold text-teal-300">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{layer.name}</h3>
                <a
                  href={`${profile.links.substack}/p/${layer.substackSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 transition hover:text-teal-400"
                >
                  Essay →
                </a>
              </div>
              <p className="mt-1 text-sm leading-snug text-zinc-400">{layer.role}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
