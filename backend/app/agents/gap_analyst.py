"""Gap analyst — identifies missing evidence after recon phase."""

from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_gap_analyst_agent(goal: str, evidence_bundle: str) -> str:
    system = """You are GapAnalystAgent. Given a research goal and collected evidence:
1. List what is well covered
2. List critical gaps (missing data, conflicting claims, stale sources)
3. Suggest 2-3 targeted follow-up questions for the next research loop
Be concise, bullet format."""
    return await ainvoke(system, f"GOAL:\n{goal}\n\nEVIDENCE:\n{evidence_bundle}", RouteBucket.STRUCTURED)
