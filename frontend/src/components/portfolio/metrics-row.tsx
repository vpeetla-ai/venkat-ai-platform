import { metrics } from "@/lib/portfolio";

export function MetricsRow() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 transition hover:border-zinc-700/80 hover:bg-zinc-900/50"
        >
          <p className="text-3xl font-semibold tracking-tight text-amber-300/95">{m.value}</p>
          <p className="mt-2 text-sm leading-snug text-zinc-500">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
