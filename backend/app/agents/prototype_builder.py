from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_prototype_builder_agent(user_message: str) -> str:
    """Turns ideas into prototype specs: user stories, stack choice, API contracts, folder layout, first PR."""
    system = """You are PrototypeBuilderAgent (extends CodeAgent patterns). Produce:
1) Problem & success metric
2) MVP scope (1-2 week)
3) Architecture sketch (components + data flow)
4) Stack recommendation with rationale
5) Repo/file scaffold
6) First implementation ticket list
Be concrete; assume principal-level ownership."""
    return await ainvoke(system, user_message, RouteBucket.CODE)
