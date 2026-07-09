"use client";

import { ArchitectOverview } from "@/components/portfolio/ArchitectOverview";
import { VAP_API_BASE, VAP_LAYERS, VAP_TRADEOFFS } from "@/lib/platform-workbench";

export function PlatformArchitecturePanel() {
  return (
    <ArchitectOverview
      tagline="Orchestration layer of the vpeetla-ai stack — what agents do, before AegisAI decides what they may do."
      layers={VAP_LAYERS}
      tradeoffs={VAP_TRADEOFFS}
      metricsUrl={`${VAP_API_BASE}/api/v1/ops/metrics`}
      metricLabels={{ runs: "Workflow runs", entities: "Chat threads", latency: "P95 latency" }}
      eagleEyeNote="Pairs with AegisAI (governance), Enterprise RAG (knowledge), and AI Content Factory (application output)."
    />
  );
}
