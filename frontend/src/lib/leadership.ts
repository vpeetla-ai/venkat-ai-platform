import { profile } from "./portfolio";

/** Enduring principles — recur across Substack essays and LinkedIn posts. */
export const enduringPrinciples = [
  {
    id: "system-engineering",
    principle: "From prompt engineering to system engineering",
    meaning:
      "Production AI is orchestration, retrieval, guardrails, state, evaluation, and FinOps — not a better prompt on a demo stack.",
  },
  {
    id: "architecture-trust",
    principle: "RAG helps AI know. Agents help AI do. Architecture decides trust.",
    meaning:
      "Knowledge, action, and the control plane must be designed together — not as competing patterns or bolt-on middleware.",
  },
  {
    id: "production-wins",
    principle: "The strongest production architecture wins — not the newest model",
    meaning:
      "Leaders should fund control-plane depth: governed agents, eval loops, and operational telemetry before model churn.",
  },
  {
    id: "governed-autonomy",
    principle: "Governed autonomy beats full autonomy",
    meaning:
      "Let agents move fast where risk is low. Require human approval where business, financial, or compliance impact is high.",
  },
  {
    id: "evaluate-systems",
    principle: "Evaluate systems, not just models",
    meaning:
      "Observability tells you what happened. Evaluation tells you whether it was good enough for the business workflow.",
  },
  {
    id: "trust-boundary",
    principle: "Guardrails are the trust boundary — not middleware",
    meaning:
      "Move from model access to trusted AI operations: policy, auditability, and runtime enforcement before delivery channels.",
  },
  {
    id: "finops-architecture",
    principle: "AI cost is an architecture problem",
    meaning:
      "Routing, caching, selective agents, and unit economics belong in the architecture diagram — not only in finance reviews.",
  },
  {
    id: "reliable-over-fast",
    principle: "Build reliable systems — not just fast demos",
    meaning:
      "Organizations that win with AI invest in retrieval strategy, governance, evaluation, and operating models — not prototype velocity alone.",
  },
] as const;

/** Leadership takeaways — explicit closing frames from essays & LinkedIn (your signature format). */
export const leadershipTakeaways = [
  {
    takeaway: "The future of enterprise AI will be won by teams with the strongest production architecture — not the team using the newest model.",
    source: "LinkedIn · Enterprise AI blueprint",
    href: profile.links.linkedin,
  },
  {
    takeaway: "Move from AI components to production AI architecture.",
    source: "Substack · RAG vs AI Agents",
    href: `${profile.links.substack}/p/rag-vs-ai-agents-an-enterprise-architecture`,
  },
  {
    takeaway: "Autonomous agents are exciting. Approved agents are production-ready.",
    source: "Substack · Human-in-the-Loop",
    href: `${profile.links.substack}/p/human-in-the-loop-architecture-for`,
  },
  {
    takeaway: "Evaluate. Learn. Improve. That is how AI moves from demos to trusted enterprise systems.",
    source: "Substack · Evaluation layer",
    href: `${profile.links.substack}/p/evaluation-layer-for-ai-systems-the`,
  },
  {
    takeaway: "The best enterprise AI systems are governed, measurable, auditable, and safe by design.",
    source: "LinkedIn · Guardrails framework",
    href: profile.links.linkedin,
  },
  {
    takeaway: "Enterprise RAG must be treated as a production intelligence system — not a vector database experiment.",
    source: "Substack · Why RAG fails in production",
    href: `${profile.links.substack}/p/why-most-enterprise-rag-systems-fail`,
  },
  {
    takeaway: "AI cost is not a finance problem. It is an architecture problem.",
    source: "Substack · Enterprise AI FinOps",
    href: `${profile.links.substack}/p/enterprise-ai-finops-architecture-why`,
  },
] as const;

/** What executives vs engineering teams should expect from principal-level leadership. */
export const leadershipDualAudience = {
  executives: {
    title: "For executives & hiring leaders",
    items: [
      "Clarity on tradeoffs, risks, and reversal criteria — not hype-driven AI roadmaps",
      "Measurable operating outcomes: cost, reliability, governance, and time-to-trust",
      "Decision ownership across agent strategy, platform modernization, and delivery alignment",
      "Language that connects architecture choices to revenue, risk, and organizational readiness",
    ],
  },
  engineering: {
    title: "For principal engineers & platform teams",
    items: [
      "Durable reference architectures, ADRs, and explicit control-plane design",
      "Production patterns: orchestration, hybrid RAG, eval harnesses, HITL, FinOps routing",
      "Hands-on depth from Lucid, Volvo, Kaiser, and Google — not slides-only architecture",
      "Implementation proof via Venkat AI Platform and open repository artifacts",
    ],
  },
} as const;

export const leadershipScope = [
  "AI strategy, architecture governance, and operating model design",
  "Agentic AI, RAG platforms, and production MLOps lifecycle ownership",
  "Enterprise, retail commerce, and supply chain full-stack leadership",
  "Cross-functional execution across product, engineering, and executive stakeholders",
] as const;

/** Questions leaders should ask — mirrors the “leadership takeaway” close in your newsletters. */
export const executiveDecisionLens = [
  "Are we building a demo or a production control plane?",
  "Can we explain who approved high-risk agent actions — and resume workflows after review?",
  "Do we evaluate the full system path, or only the LLM response?",
  "Is retrieval strategy documented, or did we default to “vector DB + embeddings”?",
  "Is AI cost designed into routing and orchestration — or discovered in invoices?",
  "What breaks first under load: model quality, governance, or operating discipline?",
] as const;
