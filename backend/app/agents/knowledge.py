from app.agents._llm import ainvoke
from app.llm.router import RouteBucket
from app.memory.vector_store import search


async def run_knowledge_agent(user_message: str) -> str:
    hits = await search(user_message, limit=5)
    context = "\n".join(str(h.get("payload")) for h in hits) or "(no vector hits yet)"
    system = """You are KnowledgeAgent. Answer using the CONTEXT snippets when relevant.
If context is empty, say you need documents ingested and give best-effort general guidance."""
    user = f"CONTEXT:\n{context}\n\nQUESTION:\n{user_message}"
    return await ainvoke(system, user, RouteBucket.STRUCTURED)