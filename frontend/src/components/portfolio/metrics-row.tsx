import { metrics } from "@/lib/portfolio";

export function MetricsRow() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <p className="text-3xl font-semibold tracking-tight text-blue-700">{m.value}</p>
          <p className="mt-2 text-sm leading-snug text-slate-600">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
