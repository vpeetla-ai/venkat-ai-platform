import re

import httpx

from app.core.config import get_settings


def _guess_symbol(text: str) -> str:
    tickers = re.findall(r"\b([A-Z]{2,5})\b", text.upper())
    stop = {"THE", "AND", "FOR", "NOT", "YOU", "ARE", "HOW", "WHAT", "WHEN"}
    for t in tickers:
        if t not in stop:
            return t
    return "SPY"


async def fetch_quote_snapshot(user_message: str) -> str:
    settings = get_settings()
    symbol = _guess_symbol(user_message)

    if settings.finnhub_api_key:
        async with httpx.AsyncClient(timeout=20.0) as client:
            r = await client.get(
                "https://finnhub.io/api/v1/quote",
                params={"symbol": symbol, "token": settings.finnhub_api_key},
            )
            if r.is_success:
                q = r.json()
                return (
                    f"symbol={symbol} current={q.get('c')} high={q.get('h')} low={q.get('l')} "
                    f"open={q.get('o')} prev_close={q.get('pc')} timestamp={q.get('t')}"
                )

    if settings.alpha_vantage_api_key:
        async with httpx.AsyncClient(timeout=20.0) as client:
            r = await client.get(
                "https://www.alphavantage.co/query",
                params={
                    "function": "GLOBAL_QUOTE",
                    "symbol": symbol,
                    "apikey": settings.alpha_vantage_api_key,
                },
            )
            if r.is_success:
                g = r.json().get("Global Quote") or {}
                return (
                    f"symbol={symbol} price={g.get('05. price')} change={g.get('09. change')} "
                    f"pct={g.get('10. change percent')} volume={g.get('06. volume')}"
                )

    return (
        f"No market API keys configured (FINNHUB_API_KEY or ALPHA_VANTAGE_API_KEY). "
        f"Parsed symbol guess={symbol}."
    )
