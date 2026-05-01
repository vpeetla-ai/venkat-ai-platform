from app.agents._llm import ainvoke
from app.llm.router import RouteBucket
from app.services.market_data import fetch_quote_snapshot


async def run_portfolio_risk_agent(user_message: str) -> str:
    snapshot = await fetch_quote_snapshot(user_message)
    system = """You are PortfolioRiskAgent. Deliver educational scenario narratives only.
Cover: macro shocks, concentration, liquidity, model risk, and monitoring KPIs.
Prefix with "Not financial advice."
Reference SNAPSHOT where helpful; if data missing, teach how to source defensively."""
    user = f"MARKET SNAPSHOT:\n{snapshot}\n\nUSER:\n{user_message}"
    return await ainvoke(system, user, RouteBucket.REASONING)
