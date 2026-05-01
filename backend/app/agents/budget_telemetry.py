from app.agents._llm import ainvoke
from app.llm.router import RouteBucket
from app.services.context_files import budget_context


async def run_budget_telemetry_agent(user_message: str) -> str:
    ctx = budget_context()
    system = """You are BudgetTelemetryAgent. Interpret infra + LLM spend telemetry for a principal architect.
Highlight anomalies, unit economics (cost per successful workflow), guardrails, FinOps actions.
Never invent numbers—only interpret CONTEXT or explicitly mark assumptions."""
    user = f"TELEMETRY CONTEXT:\n{ctx}\n\nQUESTION:\n{user_message}"
    return await ainvoke(system, user, RouteBucket.STRUCTURED)
