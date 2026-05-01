import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import ChatMessage, ChatThread, WorkflowRun


async def resolve_thread(session: AsyncSession, thread_id: uuid.UUID | None) -> ChatThread:
    if thread_id is None:
        thread = ChatThread(title=None)
        session.add(thread)
        await session.flush()
        return thread
    thread = await session.get(ChatThread, thread_id)
    if thread is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="thread not found")
    return thread


async def append_message(
    session: AsyncSession,
    thread_id: uuid.UUID,
    role: str,
    content: str,
    meta: dict | None = None,
) -> ChatMessage:
    msg = ChatMessage(thread_id=thread_id, role=role, content=content, meta=meta)
    session.add(msg)
    await session.flush()
    return msg


async def persist_workflow_run(
    session: AsyncSession,
    *,
    thread_id: uuid.UUID | None,
    intent: str,
    plan: str,
    outputs: dict,
    final: str,
    delivery: dict,
) -> WorkflowRun:
    run = WorkflowRun(
        thread_id=thread_id,
        intent=intent,
        plan=plan,
        outputs=outputs,
        final=final,
        delivery=delivery,
    )
    session.add(run)
    await session.flush()
    return run


async def list_messages(session: AsyncSession, thread_id: uuid.UUID) -> list[ChatMessage]:
    result = await session.execute(
        select(ChatMessage).where(ChatMessage.thread_id == thread_id).order_by(ChatMessage.created_at)
    )
    return list(result.scalars())
