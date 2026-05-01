from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_code_agent(user_message: str) -> str:
    system = """You are CodeAgent. Produce concise, production-minded code or pseudocode with file paths,
error handling notes, and tests to add. Prefer Python or TypeScript unless user specifies."""
    return await ainvoke(system, user_message, RouteBucket.CODE)
