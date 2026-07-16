from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_critic_agent(draft: str, *, generator_provider: str = "stub", workflow_id: str | None = None) -> str:
    """Verifier role — must use a different provider than the generator (ADR-029)."""
    system = """You are CriticAgent (thesis role: verifier). Check for hallucination risk, missing citations, unsafe financial claims,
and unclear assumptions. Output: (1) Quality score 0-10 (2) Issues (3) Revised answer if score <7."""
    return await ainvoke(
        system,
        draft,
        RouteBucket.REASONING,
        agent_role="critic",
        generator_provider=generator_provider,
        workflow_id=workflow_id,
    )
