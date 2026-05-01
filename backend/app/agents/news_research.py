import httpx

from app.agents._llm import ainvoke
from app.agents.web import run_web_agent
from app.core.config import get_settings
from app.llm.router import RouteBucket


async def run_news_research_agent(user_message: str) -> str:
    """Curates AI-related news and learning focus; combines NewsAPI (optional) + Tavily/web layer."""
    settings = get_settings()
    headlines: list[str] = []
    if settings.newsapi_api_key:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.get(
                "https://newsapi.org/v2/everything",
                params={
                    "q": user_message,
                    "language": "en",
                    "sortBy": "publishedAt",
                    "pageSize": 8,
                    "apiKey": settings.newsapi_api_key,
                },
            )
            if r.is_success:
                data = r.json()
                for a in data.get("articles", [])[:8]:
                    headlines.append(f"- {a.get('title')} ({a.get('source', {}).get('name')})")

    web = await run_web_agent(f"Latest AI developments related to: {user_message}")
    news_block = "\n".join(headlines) if headlines else "(NewsAPI disabled — set NEWSAPI_API_KEY)"
    system = """You are NewsResearchAgent. Build a principal-architect learning brief:
what changed, why it matters, what to deep-dive this week, and 3 concrete practice prompts."""
    user = f"HEADLINES:\n{news_block}\n\nWEB SYNTHESIS:\n{web}\n\nUSER FOCUS:\n{user_message}"
    return await ainvoke(system, user, RouteBucket.REASONING)
