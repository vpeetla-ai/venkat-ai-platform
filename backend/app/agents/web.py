import httpx

from app.agents._llm import ainvoke
from app.core.config import get_settings
from app.llm.router import RouteBucket


async def run_web_agent(user_message: str) -> str:
    settings = get_settings()
    snippets: list[str] = []
    if settings.tavily_api_key:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(
                "https://api.tavily.com/search",
                json={
                    "api_key": settings.tavily_api_key,
                    "query": user_message,
                    "max_results": 5,
                },
            )
            r.raise_for_status()
            data = r.json()
            for res in data.get("results", [])[:5]:
                snippets.append(f"- {res.get('title')}: {res.get('content', '')[:400]}")
    context = "\n".join(snippets) if snippets else "(no live web results — add TAVILY_API_KEY)"
    system = """You are WebAgent. Synthesize fresh web findings into crisp bullets with implications.
If no API results, give safe generic guidance and say live search is disabled."""
    user = f"SNIPPETS:\n{context}\n\nUSER:\n{user_message}"
    return await ainvoke(system, user, RouteBucket.REASONING)
