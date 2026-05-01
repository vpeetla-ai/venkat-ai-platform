from app.agents._llm import ainvoke
from app.llm.router import RouteBucket
from app.services.context_files import meeting_context


async def run_meeting_brief_agent(user_message: str) -> str:
    ctx = meeting_context()
    system = """You are MeetingBriefAgent. Produce an exec-ready brief: objective, stakeholder map,
talking points, likely objections, decision asks, and follow-ups.
Blend CONTEXT (calendar/CRM/notion export) with the user ask."""
    user = f"CONTEXT:\n{ctx}\n\nMEETING REQUEST:\n{user_message}"
    return await ainvoke(system, user, RouteBucket.REASONING)
