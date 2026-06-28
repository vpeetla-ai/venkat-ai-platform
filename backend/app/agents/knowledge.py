"""Knowledge agent — uses configurable RAG strategy (default: hybrid)."""

from app.agents._llm import ainvoke
from app.llm.router import RouteBucket
from app.memory.rag_strategies import RagStrategy, format_hits, retrieve


async def run_knowledge_agent(user_message: str, strategy: RagStrategy = RagStrategy.HYBRID) -> str:
    hits = await retrieve(strategy, user_message, limit=5)
    context = format_hits(hits)
    system = f"""You are KnowledgeAgent using {strategy.value} retrieval.
Answer using CONTEXT snippets when relevant. Cite chunk numbers.
If context is empty, say documents must be ingested via POST /ingest."""
    user = f"CONTEXT:\n{context}\n\nQUESTION:\n{user_message}"
    return await ainvoke(system, user, RouteBucket.STRUCTURED)
