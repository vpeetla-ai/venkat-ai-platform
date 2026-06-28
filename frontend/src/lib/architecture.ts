import { profile } from "./portfolio";

const substack = profile.links.substack;

/** 2026 production blueprint — synthesized from LinkedIn + Substack publishing. */
export const productionBlueprint = {
  thesis:
    "LLM + RAG + Vector DB works for demos. Production-grade enterprise AI needs a control plane: orchestration, guardrails, state, hybrid retrieval, evaluation, HITL, observability, and FinOps.",
  shift: "From prompt engineering → to system engineering.",
  layers: [
    {
      id: "orchestration",
      name: "Orchestration engine",
      role: "The brain — routes intent, plans work, coordinates specialists (LangGraph-class).",
      substackSlug: "orchestrated-multi-agent-multi-llm-architecture",
    },
    {
      id: "guardrails",
      name: "Guardrails & policy layer",
      role: "Trust boundary — input/output validation, RBAC, tool authorization, not middleware.",
      substackSlug: "ai-guardrails-architecture-moving-from-model",
    },
    {
      id: "state",
      name: "State & context store",
      role: "Durable workflow memory for multi-step agents, approvals, and resume-after-HITL.",
      substackSlug: "human-in-the-loop-architecture-for",
    },
    {
      id: "retrieval",
      name: "Hybrid retrieval + re-ranking",
      role: "RAG as enterprise intelligence — not a vector DB project. Hybrid search, metadata, citations.",
      substackSlug: "why-most-enterprise-rag-systems-fail",
    },
    {
      id: "knowledge",
      name: "Knowledge graphs (optional)",
      role: "Relationship-aware context when entities, policies, and workflows need graph traversal.",
      substackSlug: "why-most-enterprise-rag-systems-fail",
    },
    {
      id: "routing",
      name: "Model router & fallbacks",
      role: "Right model for the task — cost, latency, capability buckets with eval on route changes.",
      substackSlug: "orchestrated-multi-agent-multi-llm-architecture",
    },
    {
      id: "evaluation",
      name: "Evaluation engine",
      role: "Evaluate systems, not just models. Offline protects releases; online protects users.",
      substackSlug: "evaluation-layer-for-ai-systems-the",
    },
    {
      id: "hitl",
      name: "Human-in-the-loop",
      role: "Governed autonomy — approved agents, not autonomous demos. Risk scoring + audit trail.",
      substackSlug: "human-in-the-loop-architecture-for",
    },
    {
      id: "observability",
      name: "Observability + feedback",
      role: "Observability tells you what happened. Evaluation tells you if it was good enough.",
      substackSlug: "evaluation-layer-for-ai-systems-the",
    },
    {
      id: "finops",
      name: "FinOps, privacy, security, governance",
      role: "AI cost is an architecture problem — routing, caching, batching, and unit economics.",
      substackSlug: "enterprise-ai-finops-architecture-why",
    },
  ],
} as const;

export type ArchitecturePillar = {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  linkedinHook: string;
  tags: string[];
  substackHref: string;
  implementedInVap?: string;
};

/** Architecture pillars aligned to published essays + LinkedIn hooks. */
export const architecturePillars: ArchitecturePillar[] = [
  {
    id: "control-plane",
    title: "Production AI control plane",
    tagline: "RAG helps AI know. Agents help AI do. Architecture decides trust.",
    summary:
      "Enterprise AI is RAG + agents + orchestration — not either/or. The control plane routes retrieval vs action, model selection, tool invocation, and approval gates.",
    linkedinHook:
      "Most Enterprise AI architectures are still stuck at LLM + RAG + Vector DB. In 2026, production needs orchestration, guardrails, state, hybrid retrieval, evaluation, HITL, and telemetry.",
    tags: ["Orchestration", "Control plane", "Agentic AI"],
    substackHref: `${substack}/p/rag-vs-ai-agents-an-enterprise-architecture`,
    implementedInVap: "Chief → Planner → parallel workers → Critic → Notify",
  },
  {
    id: "rag-intelligence",
    title: "Enterprise RAG intelligence system",
    tagline: "Retrieval strategy is the architecture decision — not Pinecone vs Qdrant.",
    summary:
      "Production RAG requires hybrid retrieval, re-ranking, access-aware context, grounded citations, evaluation, guardrails, and feedback loops — six failure modes if any layer is immature.",
    linkedinHook:
      "Most Enterprise RAG systems don't fail because the LLM is weak. They fail because the architecture around retrieval is immature.",
    tags: ["RAG", "Hybrid search", "Context engineering"],
    substackHref: `${substack}/p/why-most-enterprise-rag-systems-fail`,
    implementedInVap: "Qdrant primary retrieval + optional Pinecone ingest mirror",
  },
  {
    id: "guardrails",
    title: "Guardrails as trust boundary",
    tagline: "Move from model access to trusted AI operations.",
    summary:
      "Runtime control across input guardrails, policy enforcement, risk analysis, output validation, HITL auditability, and observability — guardrails are architecture, not a plugin.",
    linkedinHook: "AI guardrails are not middleware. They are the trust boundary between users, data, models, tools, and business actions.",
    tags: ["Governance", "Responsible AI", "Policy"],
    substackHref: `${substack}/p/ai-guardrails-architecture-moving-from`,
    implementedInVap: "Critic node (LLM review) + compliance agents — not approval gateway; pair with AegisAI for HITL",
  },
  {
    id: "hitl",
    title: "Human-in-the-loop & governed autonomy",
    tagline: "Autonomous agents are exciting. Approved agents are production-ready.",
    summary:
      "Risk scoring, approval gateway (Slack/Teams), audit trail, resume-from-step state, and escalation paths for refunds, deletes, payments, and compliance workflows.",
    linkedinHook:
      "The future of enterprise AI is not fully autonomous agents everywhere — it is governed autonomy.",
    tags: ["HITL", "Risk scoring", "Audit"],
    substackHref: `${substack}/p/human-in-the-loop-architecture-for`,
    implementedInVap: "Planner explainability + Critic LLM gate — fleet HITL via AegisAI gateway (planned)",
  },
  {
    id: "evaluation",
    title: "Evaluation layer",
    tagline: "Production AI teams evaluate systems — not just models.",
    summary:
      "Measure relevance, faithfulness, grounding, retrieval quality, tool correctness, agent success, safety, cost, latency, and business impact — offline before release, online in production.",
    linkedinHook: "Observability tells you what happened. Evaluation tells you whether it was good enough.",
    tags: ["Evals", "LLMOps", "Regression"],
    substackHref: `${substack}/p/evaluation-layer-for-ai-systems-the`,
    implementedInVap: "Langfuse spans on critical graph nodes (extensible eval harness)",
  },
  {
    id: "multi-agent-llm",
    title: "Orchestrated multi-agent + multi-LLM",
    tagline: "The orchestrator is the brain. The model router is one tool inside the system.",
    summary:
      "Specialized parallel agents with dynamic LLM routing by task complexity, cost, and latency — LangGraph orchestration, RAG memory, Langfuse observability.",
    linkedinHook: "Don't rely on one LLM — use the right model for the right task.",
    tags: ["LangGraph", "Multi-LLM", "Specialists"],
    substackHref: `${substack}/p/orchestrated-multi-agent-multi-llm-architecture`,
    implementedInVap: "Full VAP reference stack — live at /chat",
  },
  {
    id: "finops",
    title: "AI FinOps architecture",
    tagline: "AI cost is not a finance problem. It is an architecture problem.",
    summary:
      "Token economics via model routing buckets, caching, selective agents, batching, and cost telemetry — FinOps belongs in the architecture diagram, not a spreadsheet alone.",
    linkedinHook: "Production AI must be cost-aware at the routing and orchestration layer.",
    tags: ["FinOps", "Routing", "Unit economics"],
    substackHref: `${substack}/p/enterprise-ai-finops-architecture-why`,
    implementedInVap: "LLM factory + router buckets + budget telemetry agent",
  },
  {
    id: "redline",
    title: "Architecture redline review",
    tagline: "Production-readiness is hidden in what diagrams forget.",
    summary:
      "Redline checklist for enterprise AI diagrams: guardrails, eval, HITL, state, access-aware retrieval, FinOps, and operational runbooks — what most AI architecture slides omit.",
    linkedinHook: "Most AI architecture diagrams look impressive. Production-readiness is in what's missing.",
    tags: ["Review", "ADRs", "Production bar"],
    substackHref: `${substack}/p/ai-architecture-redline-review-checklist`,
  },
];

export const guardrailLayers = [
  "Input guardrails — PII/PCI/PHI, prompt injection, jailbreak detection",
  "Policy enforcement — RBAC/ABAC, tool authorization, regulatory constraints",
  "Context & risk analysis — intent, sensitivity, business impact scoring",
  "Output guardrails — grounding, citations, schema validation, topic containment",
  "Human-in-the-loop & auditability — approvals, decision logs, break-glass",
  "Observability & feedback — guardrail traces, LLM-as-judge evals, continuous tuning",
];

export const substackEssays = [
  {
    title: "Enterprise AI FinOps Architecture: Why AI Cost Is an Architecture Problem",
    date: "2026-06-09",
    href: `${substack}/p/enterprise-ai-finops-architecture-why`,
  },
  {
    title: "AI Architecture Redline Review Checklist: What Most AI Diagrams Forget",
    date: "2026-06-08",
    href: `${substack}/p/ai-architecture-redline-review-checklist`,
  },
  {
    title: "RAG vs AI Agents: An Enterprise Architecture View",
    date: "2026-06-03",
    href: `${substack}/p/rag-vs-ai-agents-an-enterprise-architecture`,
  },
  {
    title: "Why Most Enterprise RAG Systems Fail in Production",
    date: "2026-05-09",
    href: `${substack}/p/why-most-enterprise-rag-systems-fail`,
  },
  {
    title: "Evaluation Layer for AI Systems: The Engine of Trusted Enterprise AI",
    date: "2026-05-15",
    href: `${substack}/p/evaluation-layer-for-ai-systems-the`,
  },
  {
    title: "Human-in-the-Loop Architecture for AI Agents",
    date: "2026-05-17",
    href: `${substack}/p/human-in-the-loop-architecture-for`,
  },
  {
    title: "Orchestrated Multi-Agent + Multi-LLM Architecture",
    date: "2026-04-25",
    href: `${substack}/p/orchestrated-multi-agent-multi-llm-architecture`,
  },
];
