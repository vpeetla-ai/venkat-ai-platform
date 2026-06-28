export type ArticleChannel = "portfolio" | "substack" | "medium" | "linkedin";

export type Article = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  readMinutes: number;
  channels: ArticleChannel[];
  href: string;
  featured?: boolean;
};

export type Outcome = {
  title: string;
  impact: string;
  summary: string;
  tags: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  highlights: string[];
  href: string;
};

export type Expertise = {
  title: string;
  body: string;
};

export const profile = {
  name: "Venkata Peetla",
  shortName: "Venkat",
  title: "Principal AI Architect",
  tagline: "Sr. Staff Engineer @ Lucid Motors · Agentic AI · Production MLOps",
  headline:
    "Enterprise AI architect turning agentic systems, platform modernization, and operating workflows into measurable business outcomes.",
  bio: "I operate at the intersection of hands-on principal engineering, AI architecture, and director-level execution — 19+ years across mobile, full-stack platforms, DevOps, retail commerce, supply chain, and production AI/ML. Executives get clarity; engineering teams get durable architecture.",
  roles: ["Principal AI Engineer", "AI Architect", "Director of AI / Engineering"],
  email: "vpeetla.ai@gmail.com",
  site: "https://venkat-ai.com",
  links: {
    linkedin: "https://www.linkedin.com/in/venkata-peetla",
    github: "https://github.com/vpeetla-ai/venkat-ai-platform",
    substack: "https://venkatapeetla.substack.com",
    medium: "https://medium.com/@venkatapeetla",
    platform: "/chat",
    designDoc: "/architecture#venkat-ai-platform",
  },
} as const;

export const metrics = [
  { label: "Years building enterprise systems", value: "19+" },
  { label: "Years leading senior engineers", value: "10+" },
  { label: "Engineers led across teams", value: "20+" },
  { label: "Annualized revenue & savings impact", value: "$MM+" },
] as const;

export const outcomes: Outcome[] = [
  {
    title: "Gulf Payments Modernization",
    impact: "Multi-million-dollar annualized impact",
    summary:
      "Integrated Stripe and GIB payment gateways for Gulf markets — scalable regional payment foundation with stronger transaction coverage and market fit.",
    tags: ["Payments", "Stripe", "Regional scale"],
  },
  {
    title: "Subscription Revenue Platform",
    impact: "Durable recurring revenue growth",
    summary:
      "Delivered subscription capabilities that moved core product lines toward continuous revenue with stronger lifecycle, billing, and operational controls.",
    tags: ["Subscriptions", "Billing", "Lifecycle"],
  },
  {
    title: "Supply Chain EDI Re-Platforming",
    impact: "Multi-million-dollar annualized savings",
    summary:
      "Replaced SAP and TrueCommerce license-heavy EDI flows with full-stack architecture — lower recurring cost, stronger ownership and adaptability.",
    tags: ["EDI", "Supply chain", "Cost reduction"],
  },
  {
    title: "AI Agent Operations Automation",
    impact: "Staffing intensity 10 → 2",
    summary:
      "Designed multi-agent automation for repeatable supply chain workflows across intake, validation, exception handling, and operational routing.",
    tags: ["Agentic AI", "Automation", "Operations"],
  },
];

export const expertise: Expertise[] = [
  {
    title: "Enterprise AI & Agent Strategy",
    body: "Lead enterprise AI programs from strategy through delivery — multi-agent systems, governance, and measurable operating outcomes.",
  },
  {
    title: "AI Agents & RAG Platforms",
    body: "Architect secure, production-grade agentic systems with orchestration, retrieval, evaluation, and enterprise reliability controls.",
  },
  {
    title: "Enterprise Full-Stack Architecture",
    body: "Design domain services, APIs, integration layers, and cloud platforms for long-term scalability and team velocity.",
  },
  {
    title: "MLOps & Data Foundations",
    body: "Build model and data pipelines with observability, quality controls, deployment safety, and lifecycle management.",
  },
  {
    title: "Retail & Supply Chain Systems",
    body: "Lead architecture for high-throughput commerce and supply chain platforms — reliability, speed, and cost in balance.",
  },
  {
    title: "Cross-Functional Technology Leadership",
    body: "Govern architecture standards, execution planning, and senior stakeholder alignment across enterprise AI delivery.",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "venkat-ai-platform",
    title: "Venkat AI Platform — Production control plane reference",
    summary:
      "Orchestrated multi-agent + multi-LLM stack (Substack origin essay): LangGraph brain, specialist agents, RAG, guardrails/critic, Langfuse telemetry, FinOps routing.",
    tags: ["LangGraph", "Control plane", "Multi-LLM"],
    highlights: [
      "RAG helps AI know · Agents help AI do · Orchestration decides trust",
      "Chief → Planner → parallel specialists → Insight → Critic → Notify",
      "Qdrant + optional Pinecone, model router, budget telemetry",
    ],
    href: "/architecture#venkat-ai-platform",
  },
  {
    slug: "enterprise-rag",
    title: "Enterprise RAG intelligence system",
    summary:
      "Hybrid retrieval, context engineering, evaluation, and governance — not a vector-database experiment. Six production failure modes from published Substack framework.",
    tags: ["RAG", "Hybrid search", "Evaluation"],
    highlights: [
      "Retrieval strategy > Pinecone vs Qdrant vendor choice",
      "Access-aware context, citations, offline + online eval",
      "Guardrails + feedback loop as architecture requirements",
    ],
    href: "/architecture#rag-intelligence",
  },
  {
    slug: "governed-autonomy",
    title: "Governed autonomy (HITL + guardrails)",
    summary:
      "Approved agents, not autonomous demos — risk scoring, approval gateway, audit trail, and resume-from-step state for high-impact business actions.",
    tags: ["HITL", "Guardrails", "Governance"],
    highlights: [
      "Six-layer guardrails trust boundary (LinkedIn framework)",
      "Autonomous agents are exciting; approved agents are production-ready",
      "Observability = what happened; evaluation = good enough",
    ],
    href: "/architecture#hitl",
  },
];

/** Synced to Venkat on AI Architecture (Substack) + LinkedIn distribution. */
export const articles: Article[] = [
  {
    slug: "enterprise-ai-finops",
    title: "Enterprise AI FinOps Architecture: Why AI Cost Is an Architecture Problem",
    summary:
      "AI cost is not a finance problem — it is routing, orchestration, caching, and model selection designed into the control plane.",
    tags: ["FinOps", "Architecture", "Enterprise AI"],
    publishedAt: "2026-06-09",
    readMinutes: 11,
    channels: ["substack", "linkedin"],
    href: "https://venkatapeetla.substack.com/p/enterprise-ai-finops-architecture-why",
    featured: true,
  },
  {
    slug: "rag-vs-agents",
    title: "RAG vs AI Agents: An Enterprise Architecture View",
    summary:
      "RAG helps AI know. Agents help AI do. Production AI combines both with a control plane for trust — not a false either/or choice.",
    tags: ["RAG", "Agentic AI", "Control plane"],
    publishedAt: "2026-06-03",
    readMinutes: 14,
    channels: ["substack", "linkedin", "medium"],
    href: "https://venkatapeetla.substack.com/p/rag-vs-ai-agents-an-enterprise-architecture",
  },
  {
    slug: "enterprise-rag-failure-modes",
    title: "Why Most Enterprise RAG Systems Fail in Production",
    summary:
      "Six failure modes: retrieval strategy, data governance, context engineering, evaluation, safety, and platform ops — the Substack deep-dive behind my LinkedIn RAG posts.",
    tags: ["RAG", "Enterprise AI", "Evaluation"],
    publishedAt: "2026-05-09",
    readMinutes: 12,
    channels: ["substack", "linkedin", "medium"],
    href: "https://venkatapeetla.substack.com/p/why-most-enterprise-rag-systems-fail",
  },
  {
    slug: "evaluation-layer",
    title: "Evaluation Layer for AI Systems: The Engine of Trusted Enterprise AI",
    summary:
      "Production AI teams evaluate systems — relevance, grounding, tool correctness, agent success, safety, cost, and business impact.",
    tags: ["Evaluation", "LLMOps", "Observability"],
    publishedAt: "2026-05-15",
    readMinutes: 13,
    channels: ["substack", "linkedin"],
    href: "https://venkatapeetla.substack.com/p/evaluation-layer-for-ai-systems-the",
  },
  {
    slug: "hitl-architecture",
    title: "Human-in-the-Loop Architecture for AI Agents",
    summary:
      "Governed autonomy: risk scoring, approval gateway, audit trail, and resume-from-step state — approved agents are production-ready.",
    tags: ["HITL", "Governance", "Agentic AI"],
    publishedAt: "2026-05-17",
    readMinutes: 12,
    channels: ["substack", "linkedin"],
    href: "https://venkatapeetla.substack.com/p/human-in-the-loop-architecture-for",
  },
  {
    slug: "multi-agent-multi-llm",
    title: "Orchestrated Multi-Agent + Multi-LLM Architecture",
    summary:
      "LangGraph orchestration, specialist agents in parallel, dynamic LLM routing, RAG memory, and Langfuse observability — the VAP origin essay.",
    tags: ["LangGraph", "Multi-LLM", "Orchestration"],
    publishedAt: "2026-04-25",
    readMinutes: 8,
    channels: ["substack", "linkedin", "portfolio"],
    href: "https://venkatapeetla.substack.com/p/orchestrated-multi-agent-multi-llm-architecture",
  },
];

export const distributionChannels = [
  {
    id: "substack",
    title: "Substack — owned audience",
    body: "Weekly AI architecture essays, newsletter subscribers, and repeat traffic back to canonical portfolio articles.",
    cta: "Subscribe on Substack",
    href: profile.links.substack,
  },
  {
    id: "medium",
    title: "Medium — discovery & syndication",
    body: "Republished technical articles for broader discovery, publication SEO, and backlinks into the portfolio hub.",
    cta: "Follow on Medium",
    href: profile.links.medium,
  },
  {
    id: "linkedin",
    title: "LinkedIn — executive signal",
    body: "Short-form architecture takes, hiring/advisory visibility, and distribution into principal and director buyer networks.",
    cta: "Connect on LinkedIn",
    href: profile.links.linkedin,
  },
  {
    id: "github",
    title: "GitHub — build-side proof",
    body: "Implementation credibility through repos, READMEs, and live reference architecture readers can inspect and share.",
    cta: "View on GitHub",
    href: profile.links.github,
  },
] as const;

export const roleFit = [
  {
    role: "Principal AI Engineer",
    fit: "Hands-on architecture across agent systems, MLOps, data pipelines, reliability controls, and production execution.",
  },
  {
    role: "AI Architect",
    fit: "Turn ambiguous strategy into system design decisions, reference architectures, governance standards, and delivery pathways.",
  },
  {
    role: "AI Director",
    fit: "Multi-team execution with business alignment, platform reuse, risk-aware operating models, and measurable enterprise outcomes.",
  },
];

export function getFeaturedArticle() {
  return articles.find((a) => a.featured) ?? articles[0];
}

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}
