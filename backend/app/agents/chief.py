from app.agents._llm import ainvoke
from app.llm.router import RouteBucket

_INTENTS = (
    "general",
    "news_learning",
    "prototype_idea",
    "market_analysis",
    "rag_query",
    "rag_expert",
    "deep_research",
    "architecture_review",
    "enterprise_api",
    "portfolio_risk",
    "calendar_commitments",
    "budget_telemetry",
    "security_review",
    "compliance",
    "meeting_brief",
    "experiment",
)


async def classify_intent(user_message: str) -> str:
    system = f"""You classify user goals for a principal AI architect assistant platform.
Return exactly one label from: {", ".join(_INTENTS)}.
- news_learning: AI news, papers, learning paths, what to focus on
- prototype_idea: product ideas, MVPs, technical prototypes
- market_analysis: stocks, markets, ticker commentary (informational only)
- rag_query: questions about uploaded docs / internal knowledge base
- rag_expert: compare RAG architectures (naive, hybrid, multi-query, HyDE, rerank, parent doc)
- deep_research: multi-source deep research with loops (routes to Research orchestrator)
- architecture_review: system design redline, threat model, compliance (routes to Architecture orchestrator)
- enterprise_api: Salesforce, CRM, enterprise integrations
- portfolio_risk: scenarios, stress testing narratives, factor discussions (not advice)
- calendar_commitments: schedule alignment, deep work planning vs meetings
- budget_telemetry: cloud spend, token usage, FinOps, unit economics
- security_review: architecture threat modeling, agent/tool safety
- compliance: legal/licensing/privacy/financial promotion considerations
- meeting_brief: exec briefings before customer or exec meetings
- experiment: offline/online eval design for LLM changes
- general: everything else
Reply with the label only, lowercase, no punctuation."""
    raw = (await ainvoke(system, user_message, RouteBucket.FAST)).strip().lower().replace(" ", "_")
    first = raw.splitlines()[0] if raw else ""
    for label in _INTENTS:
        if first == label or first.startswith(label):
            return label
    for label in _INTENTS:
        if label in raw:
            return label
    return "general"
