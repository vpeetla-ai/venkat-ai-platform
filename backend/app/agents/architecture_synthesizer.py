"""Architecture synthesizer — merges security, compliance, RAG, and web findings."""

from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_architecture_synthesizer_agent(goal: str, specialist_bundle: str) -> str:
    system = """You are ArchitectureSynthesizerAgent for principal architects.
Produce: (1) Executive summary (2) Architecture diagram in text/mermaid (3) Top risks
(4) Recommendations prioritized P0/P1/P2 (5) Open questions.
Use specialist inputs; flag assumptions clearly."""
    return await ainvoke(system, f"GOAL:\n{goal}\n\nSPECIALIST INPUTS:\n{specialist_bundle}", RouteBucket.REASONING)
