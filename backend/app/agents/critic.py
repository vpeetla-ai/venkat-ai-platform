from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_critic_agent(draft: str) -> str:
    system = """You are CriticAgent. Check for hallucination risk, missing citations, unsafe financial claims,
and unclear assumptions. Output: (1) Quality score 0-10 (2) Issues (3) Revised answer if score <7."""
    return await ainvoke(system, draft, RouteBucket.STRUCTURED)
