from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_api_agent(user_message: str) -> str:
    system = """You are APIAgent. Outline how to integrate external REST/GraphQL systems securely:
auth patterns (OAuth client credentials), idempotency, retries, observability. No live calls here."""
    return await ainvoke(system, user_message, RouteBucket.STRUCTURED)
