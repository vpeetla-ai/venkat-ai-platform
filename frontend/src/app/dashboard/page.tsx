export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Wire Langfuse and backend metrics here; placeholder tiles mirror the architecture checklist.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: "Agent executions / day", value: "—" },
          { label: "Average latency", value: "—" },
          { label: "Error rate", value: "—" },
          { label: "Est. token cost", value: "—" },
        ].map((tile) => (
          <div key={tile.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{tile.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{tile.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
