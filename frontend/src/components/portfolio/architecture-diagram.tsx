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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
        Reference runtime graph
      </p>
      <svg viewBox="0 0 100 100" className="h-auto w-full max-w-md text-blue-600" aria-label="LangGraph workflow diagram">
        <defs>
          <linearGradient id="flow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(37 99 235 / 0.45)" />
            <stop offset="100%" stopColor="rgb(13 148 136 / 0.35)" />
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
              fill="rgb(248 250 252)"
              stroke="rgb(203 213 225)"
              strokeWidth="0.4"
            />
            <text
              x={n.x}
              y={n.y + 0.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgb(15 23 42)"
              fontSize="3.2"
              fontFamily="var(--font-geist-mono), monospace"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-4 text-xs leading-relaxed text-slate-600">
        Production control plane (published on Substack + LinkedIn): orchestration routes retrieval vs action;
        Critic/guardrails gate compliance tone before Slack, Telegram, or WhatsApp delivery.
      </p>
    </div>
  );
}
