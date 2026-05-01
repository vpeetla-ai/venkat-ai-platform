from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_compliance_agent(user_message: str) -> str:
    system = """You are ComplianceAgent. Surface copyright, licensing, export-control, financial promotion,
and privacy considerations for AI-generated assets and autonomous workflows.
Be explicit about uncertainty and need for counsel; provide practical mitigation patterns."""
    return await ainvoke(system, user_message, RouteBucket.STRUCTURED)
