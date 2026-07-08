"use client";

import { ArchitectOverview } from "@/components/portfolio/ArchitectOverview";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://vap-api.onrender.com";

const LAYERS = [
  { tier: "L1", name: "Portfolio hub", role: "Principal narrative + live demo entry", components: ["Next.js", "Case studies", "Architecture essays"] },
  { tier: "L2", name: "Multi-agent orchestration", role: "LangGraph workflows", components: ["Intent router", "Specialist agents", "Workflow runs"] },
  { tier: "L3", name: "Knowledge + notify", role: "RAG + delivery", components: ["Hybrid retrieval", "Threads", "Notification routing"] },
  { tier: "L4", name: "Ops", role: "Production proof", components: ["Postgres runs", "Observability", "/api/v1/ops/metrics"] },
];

const TRADEOFFS = [
  { decision: "Portfolio + platform in one repo", gain: "Essays link directly to runnable proof", trade: "Two UX modes (marketing vs chat demo)" },
  { decision: "Postgres workflow_runs table", gain: "Live ops metrics without Langfuse dependency", trade: "DB on Render vs pure static" },
  { decision: "Multi-agent vs single copilot", gain: "Shows orchestration depth for principal interviews", trade: "Higher cold-start complexity" },
  { decision: "Mock LLM on free tier", gain: "Always-on demo", trade: "Response quality ≠ prod models" },
];

export function LivePlatformMetrics() {
  return (
    <ArchitectOverview
      tagline="Venkat AI Platform is the orchestration layer of the vpeetla-ai stack — what agents do, before AegisAI decides what they may do."
      layers={LAYERS}
      tradeoffs={TRADEOFFS}
      metricsUrl={`${API_BASE}/api/v1/ops/metrics`}
      metricLabels={{ runs: "Workflow runs", entities: "Chat threads", latency: "P95 latency" }}
      eagleEyeNote="Pairs with AegisAI (governance), Enterprise RAG (knowledge), and AI Content Factory (application output)."
    />
  );
}
