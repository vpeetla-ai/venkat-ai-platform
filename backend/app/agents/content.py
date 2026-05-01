from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_content_agent(user_message: str, research_bundle: str) -> str:
    system = """You are ContentAgent. Draft LinkedIn-ready or blog-ready content with hooks and hashtags,
grounded in RESEARCH. Keep claims cautious; mark speculation."""
    user = f"RESEARCH:\n{research_bundle}\n\nREQUEST:\n{user_message}"
    return await ainvoke(system, user, RouteBucket.STRUCTURED)
