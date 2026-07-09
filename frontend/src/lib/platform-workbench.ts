import type { ArchitectLayer, Tradeoff } from "@/components/portfolio/ArchitectOverview";

export const VAP_API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://vap-api.onrender.com";

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
