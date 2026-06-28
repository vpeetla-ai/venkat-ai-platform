export function ArchitectureDiagram() {
  const nodes = [
    { id: "chief", label: "Chief", x: 50, y: 12 },
    { id: "planner", label: "Planner", x: 50, y: 28 },
    { id: "workers", label: "Parallel workers", x: 50, y: 46 },
    { id: "insight", label: "Insight", x: 50, y: 64 },
    { id: "critic", label: "Critic", x: 50, y: 80 },
    { id: "notify", label: "Notify", x: 50, y: 94 },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Reference runtime graph</p>
      <svg viewBox="0 0 100 100" className="h-auto w-full max-w-md text-teal-400/80" aria-label="LangGraph workflow diagram">
        <defs>
          <linearGradient id="flow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(45 212 191 / 0.5)" />
            <stop offset="100%" stopColor="rgb(139 92 246 / 0.35)" />
          </linearGradient>
        </defs>
        <line x1="50" y1="16" x2="50" y2="90" stroke="url(#flow)" strokeWidth="0.6" strokeDasharray="2 1.5" />
        {nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x - 18}
              y={n.y - 4}
              width="36"
              height="8"
              rx="2"
              fill="rgb(24 24 27)"
              stroke="rgb(63 63 70)"
              strokeWidth="0.4"
            />
            <text
              x={n.x}
              y={n.y + 0.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgb(228 228 231)"
              fontSize="3.2"
              fontFamily="var(--font-geist-mono), monospace"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-4 text-xs leading-relaxed text-zinc-500">
        Production control plane (published on Substack + LinkedIn): orchestration routes retrieval vs action;
        Critic/guardrails gate compliance tone before Slack, Telegram, or WhatsApp delivery.
      </p>
    </div>
  );
}
