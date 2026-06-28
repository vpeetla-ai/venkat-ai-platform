"""RAG expert — runs all retrieval architectures and recommends best fit."""

from app.agents._llm import ainvoke
from app.llm.router import RouteBucket
from app.memory.rag_strategies import ALL_STRATEGIES, RagStrategy, format_hits, retrieve, retrieve_all_strategies


async def run_rag_expert_agent(user_message: str) -> str:
    comparison = await retrieve_all_strategies(user_message, limit=3)
    blocks = []
    for strategy in ALL_STRATEGIES:
        entry = comparison.get(strategy.value, {})
        blocks.append(f"## {strategy.value}\n{entry.get('preview', '')}")

    system = """You are RagExpertAgent. Compare retrieval architecture results.
Explain which strategy fits this query (naive, multi_query, hybrid, parent_document, rerank, hyde).
Note tradeoffs: latency, recall, precision, need for parent docs, keyword-heavy vs semantic queries."""
    user = f"QUESTION:\n{user_message}\n\nSTRATEGY RESULTS:\n" + "\n\n".join(blocks)
    recommendation = await ainvoke(system, user, RouteBucket.STRUCTURED)

    hybrid_hits = await retrieve(RagStrategy.HYBRID, user_message, limit=5)
    answer = await ainvoke(
        "Answer using CONTEXT. State that hybrid RAG was used for the final answer.",
        f"CONTEXT:\n{format_hits(hybrid_hits)}\n\nQUESTION:\n{user_message}",
        RouteBucket.STRUCTURED,
    )
    return f"{recommendation}\n\n---\nANSWER (hybrid RAG):\n{answer}"
