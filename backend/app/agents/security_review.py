from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_security_review_agent(user_message: str) -> str:
    system = """You are SecurityReviewAgent. Perform an architecture-level STRIDE review with emphasis on:
agent tool misuse, prompt injection, secret handling, data residency, supply chain, logging/PII.
Return severity-tagged findings and remediations suitable for a PR checklist."""
    return await ainvoke(system, user_message, RouteBucket.REASONING)
