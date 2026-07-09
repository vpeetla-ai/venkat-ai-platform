import type { AdrLink, ArchitectLayer, Tradeoff } from "@/components/portfolio/ArchitectOverview";

export const VAP_API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://vap-api.onrender.com";

const PORTFOLIO = "https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main";

export const VAP_LAYERS: ArchitectLayer[] = [
  { tier: "L1", name: "Chat workbench", role: "Operator experience", components: ["Intent routing", "Thread memory", "Delivery toggles"] },
  { tier: "L2", name: "Orchestration", role: "LangGraph workflows", components: ["Chief", "Planner", "Specialists", "Critic"] },
  { tier: "L3", name: "Knowledge + notify", role: "RAG + channels", components: ["7 RAG strategies", "Slack/Telegram/WhatsApp", "AegisAI gateway"] },
  { tier: "L4", name: "Ops", role: "Production proof", components: ["workflow_runs", "Observability", "/api/v1/ops/metrics"] },
];

export const VAP_TRADEOFFS: Tradeoff[] = [
  { decision: "LangGraph over linear chains", gain: "Checkpoints, HITL, and multi-step enterprise workflows", trade: "Higher graph complexity than single-prompt UX" },
  { decision: "Postgres workflow_runs", gain: "Live ops metrics without Langfuse dependency", trade: "Render Postgres vs pure static demo" },
  { decision: "Gateway-wrapped notify channels", gain: "Side effects gated like production fleets", trade: "Extra hop through AegisAI for delivery" },
  { decision: "Mock LLM on free tier", gain: "Always-on public demo", trade: "Response depth ≠ production models" },
];

export const VAP_ADR_LINKS: AdrLink[] = [
  { title: "Case study — Venkat AI Platform", href: `${PORTFOLIO}/case-studies/venkat-ai-platform.md` },
  { title: "Essay — Orchestrated multi-agent architecture", href: "https://venkatapeetla.substack.com/p/orchestrated-multi-agent-multi-llm-architecture" },
];

export const VAP_DOCS_LINKS: AdrLink[] = [
  { title: "Architecture", href: "https://github.com/vpeetla-ai/venkat-ai-platform/blob/main/docs/ARCHITECTURE.md" },
  { title: "SLO targets", href: "https://github.com/vpeetla-ai/venkat-ai-platform/blob/main/docs/SLO.md" },
  { title: "Ecosystem map", href: "https://github.com/vpeetla-ai/venkat-ai-platform/blob/main/docs/ECOSYSTEM.md" },
];

export const VAP_ARCHITECTURE_PROPS = {
  tagline: "Orchestration layer of the vpeetla-ai stack — what agents do, before AegisAI decides what they may do.",
  layers: VAP_LAYERS,
  tradeoffs: VAP_TRADEOFFS,
  metricsUrl: `${VAP_API_BASE}/api/v1/ops/metrics`,
  metricLabels: { runs: "Workflow runs", entities: "Chat threads", latency: "P95 latency" },
  eagleEyeNote: "Pairs with AegisAI (governance), Enterprise RAG (knowledge), and AI Content Factory (application output).",
  adrLinks: VAP_ADR_LINKS,
  docsLinks: VAP_DOCS_LINKS,
} as const;
