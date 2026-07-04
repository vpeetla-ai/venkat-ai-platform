import secrets
from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.db.session import async_session_factory


async def get_db() -> AsyncIterator[AsyncSession]:
    factory = async_session_factory()
    async with factory() as session:
        yield session


def require_api_key(x_api_key: Annotated[str | None, Header()] = None) -> None:
    """Gate routes that cost an LLM call, write to the vector DB, or send a real
    notification (Slack/Telegram/WhatsApp). Only enforced when VAP_API_KEY is set,
    so local dev/demo defaults stay open — see ADR-008 (auth gate on VAP routes)."""
    expected = get_settings().vap_api_key
    if not expected:
        return
    if not x_api_key or not secrets.compare_digest(x_api_key, expected):
        raise HTTPException(status_code=401, detail="Invalid or missing X-API-Key")
