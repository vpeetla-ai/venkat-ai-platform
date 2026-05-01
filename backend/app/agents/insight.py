from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_insight_agent(bundle: str) -> str:
    system = """You are InsightAgent. Synthesize specialist outputs into an executive summary:
key decisions, risks, next actions, and learning hooks for a principal AI architect."""
    return await ainvoke(system, bundle, RouteBucket.REASONING)
