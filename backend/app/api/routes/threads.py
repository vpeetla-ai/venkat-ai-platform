from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_api_key
from app.repositories.chat_repository import list_messages

router = APIRouter(prefix="/threads", tags=["threads"])


class ThreadMessageOut(BaseModel):
    id: str
    role: str
    content: str
    created_at: str


@router.get(
    "/{thread_id}/messages",
    response_model=list[ThreadMessageOut],
    dependencies=[Depends(require_api_key)],
)
async def thread_messages(thread_id: UUID, session: AsyncSession = Depends(get_db)) -> list[ThreadMessageOut]:
    rows = await list_messages(session, thread_id)
    return [
        ThreadMessageOut(
            id=str(m.id),
            role=m.role,
            content=m.content,
            created_at=m.created_at.isoformat(),
        )
        for m in rows
    ]
