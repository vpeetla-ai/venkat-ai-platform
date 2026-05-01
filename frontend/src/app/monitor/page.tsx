export default function MonitorPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Workflow monitor</h1>
      <p className="text-sm text-zinc-400">
        LangGraph path: Chief → Planner → parallel workers → optional Content → Insight → Critic → Notify.
      </p>
      <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-black/40 p-4 text-xs text-emerald-200">
{`START → chief → planner → workers → content_extra → insight → critic → compose → notify → END

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
jobs: arq app.worker.settings.WorkerSettings (daily brief)`}
      </pre>
    </div>
  );
}
