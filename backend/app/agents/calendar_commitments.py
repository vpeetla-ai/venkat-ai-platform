from app.agents._llm import ainvoke
from app.llm.router import RouteBucket
from app.services.context_files import calendar_context


async def run_calendar_commitments_agent(user_message: str) -> str:
    ctx = calendar_context()
    system = """You are CalendarCommitmentsAgent. Align research/prototyping cadence with obligations.
Output: (1) week map (2) deep-work blocks (3) risks to slipping deadlines (4) delegation suggestions.
If CONTEXT is empty, explain how to export ICS or paste agenda bullets into CALENDAR_CONTEXT_PATH."""
    user = f"CONTEXT:\n{ctx}\n\nREQUEST:\n{user_message}"
    return await ainvoke(system, user, RouteBucket.STRUCTURED)
