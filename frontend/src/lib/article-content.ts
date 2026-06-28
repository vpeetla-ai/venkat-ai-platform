export type ArticleBody = {
  slug: string;
  sections: { heading?: string; paragraphs?: string[]; bullets?: string[] }[];
  takeaway: string;
};

export const articleBodies: Record<string, ArticleBody> = {
  "langchain-vs-langgraph": {
    slug: "langchain-vs-langgraph",
    sections: [
      {
        paragraphs: [
          "Most enterprise teams pick LangChain because it is familiar — chains, prompts, retrievers, done. That works until your system needs branching, shared state, human review, parallel specialists, and auditable recovery paths. At that point, the abstraction fights you.",
          "LangGraph is not a replacement for every LangChain primitive. It is a orchestration layer for stateful, multi-step agent workflows where the graph structure is the architecture diagram.",
        ],
      },
      {
        heading: "When LangChain is the right call",
        bullets: [
          "Linear RAG or single-agent Q&A with predictable steps",
          "Rapid prototypes where graph complexity is premature",
          "Teams still learning retrieval patterns and evaluation basics",
        ],
      },
      {
        heading: "When LangGraph becomes principal-grade",
        bullets: [
          "Chief routing + planner explainability + parallel worker fan-out",
          "Critic or governance nodes before external delivery channels",
          "Checkpointing, retries, and observability spans per node (Langfuse-class)",
          "Explicit ADRs documenting why the graph shape was chosen",
        ],
      },
      {
        heading: "The decision under uncertainty",
        paragraphs: [
          "The wrong move is bolting LangGraph onto every POC. The equally wrong move is stretching LangChain Expression Language into a pseudo-graph with hidden state in prompt strings.",
          "Principal architects document the reversal criteria: if parallel agents exceed N, if human-in-the-loop is required, or if compliance gates block delivery — graduate to a graph.",
        ],
      },
    ],
    takeaway:
      "Venkat AI Platform uses LangGraph as the runtime spine with LangChain-compatible LLM adapters — the portfolio demo at /chat is the implementation proof.",
  },
  "enterprise-rag-failure-modes": {
    slug: "enterprise-rag-failure-modes",
    sections: [
      {
        paragraphs: [
          "Production RAG failures rarely show up as 'bad answers from GPT.' They show up as stale indexes, permission leaks in retrieval, missing evaluation harnesses, and dual-write drift between vector stores.",
        ],
      },
      {
        heading: "Failure modes principal teams audit first",
        bullets: [
          "Embedding model changes without re-index strategy",
          "Chunking tuned for demos, not for domain document structure",
          "No citation or provenance contract for downstream agents",
          "Silent partial failures on Pinecone/Qdrant dual-write paths",
        ],
      },
      {
        heading: "What good looks like",
        paragraphs: [
          "Treat retrieval as a data product: schema, freshness SLAs, reconciliation jobs, and structured logs when indexing fails. Pair with a small golden-set eval that runs on every embedding or routing change.",
        ],
      },
    ],
    takeaway:
      "RAG is an architecture problem spanning data, security, and ops — not a prompt engineering side quest.",
  },
  "ai-guardrails-trust-boundary": {
    slug: "ai-guardrails-trust-boundary",
    sections: [
      {
        paragraphs: [
          "Guardrails are often implemented as a middleware filter after the model already decided to act. In enterprise agent systems, that is too late — the trust boundary must span users, data, tools, models, and business actions.",
        ],
      },
      {
        heading: "Architect the boundary, not a plugin",
        bullets: [
          "Tool allowlists per intent, not per deployment",
          "Critic or policy nodes before notify/delivery channels",
          "Market and portfolio copy flagged informational-only by construction",
          "Observability that records which gate fired, not just final text",
        ],
      },
      {
        paragraphs: [
          "Principal AI architects publish the threat model alongside the graph: prompt injection into tools, data leakage via retrieval, third-party ToS on search APIs, and financial/compliance tone drift.",
        ],
      },
    ],
    takeaway:
      "If guardrails are invisible in your architecture diagram, they are probably invisible in production too.",
  },
};
