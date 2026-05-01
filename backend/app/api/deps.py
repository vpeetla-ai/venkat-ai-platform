from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import async_session_factory


async def get_db() -> AsyncIterator[AsyncSession]:
    factory = async_session_factory()
    async with factory() as session:
        yield session
