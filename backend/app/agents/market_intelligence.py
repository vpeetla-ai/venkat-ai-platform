from app.agents._llm import ainvoke
from app.llm.router import RouteBucket
from app.services.market_data import fetch_quote_snapshot


async def run_market_intelligence_agent(user_message: str) -> str:
    """Market analysis helper — informational only, not investment advice."""
    snapshot = await fetch_quote_snapshot(user_message)
    system = """You are MarketIntelligenceAgent. You provide educational market commentary only.
Always prepend: "Not financial advice. For informational purposes only."
Use SNAPSHOT numbers carefully; if missing, explain data gaps and safer research steps."""
    user = f"SNAPSHOT:\n{snapshot}\n\nUSER:\n{user_message}"
    return await ainvoke(system, user, RouteBucket.REASONING)
