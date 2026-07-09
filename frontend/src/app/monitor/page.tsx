"use client";

import Link from "next/link";
import { PlatformArchitecturePanel } from "@/components/portfolio/PlatformArchitecturePanel";
import { ProductWorkbench } from "@/components/portfolio/ProductWorkbench";

const WORKFLOW_TRACE = `START → chief → planner → workers → content_extra → insight → critic → compose → notify → END

workers (intent-aware, always +web):
  • news_learning         → +news
  • prototype_idea        → +prototype +code
  • market_analysis       → +market
  • rag_query             → +knowledge
  • enterprise_api        → +api
  • portfolio_risk        → +portfolio_risk +market
  • calendar_commitments  → +calendar
  • budget_telemetry      → +budget
  • security_review       → +security
  • compliance            → +compliance
  • meeting_brief         → +meeting
  • experiment            → +experiment
  • general               → +knowledge +code

persistence: POST /chat (thread_id) · history: GET /threads/{id}/messages
jobs: arq app.worker.settings.WorkerSettings (daily brief)`;

export default function MonitorPage() {
  return (
    <ProductWorkbench
      eyebrow="Runtime visibility"
      productName="Workflow monitor"
      subtitle="LangGraph path: Chief → Planner → parallel workers → optional Content → Insight → Critic → Notify."
      headerActions={
        <Link href="/chat" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Run chat demo
        </Link>
      }
      productPanel={
        <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-5 text-xs leading-relaxed text-emerald-100 shadow-sm">
          {WORKFLOW_TRACE}
        </pre>
      }
      architecturePanel={<PlatformArchitecturePanel />}
    />
  );
}
