import logging

from fastapi import APIRouter, Depends
from sse_starlette.sse import EventSourceResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_api_key
from app.core.config import get_settings
from app.orchestrator.registry import run_platform_turn
from app.repositories.chat_repository import append_message, persist_workflow_run, resolve_thread
from app.schemas.chat import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse, dependencies=[Depends(require_api_key)])
async def chat(req: ChatRequest, session: AsyncSession = Depends(get_db)) -> ChatResponse:
    settings = get_settings()
    state = await run_platform_turn(
        req.message,
        notify_channels=req.notify_channels or [],
        orchestrator=req.orchestrator,
    )
    response = ChatResponse(
        intent=state.get("intent", ""),
        plan=state.get("plan", ""),
        outputs=state.get("outputs", {}),
        final=state.get("final", ""),
        delivery=state.get("delivery", {}),
    )

    if not settings.enable_db_persistence:
        return response

    try:
        thread = await resolve_thread(session, req.thread_id)
        await append_message(session, thread.id, "user", req.message)
        run = await persist_workflow_run(
            session,
            thread_id=thread.id,
            intent=response.intent,
            plan=response.plan,
            outputs=response.outputs,
            final=response.final,
            delivery=response.delivery,
        )
        await append_message(
            session,
            thread.id,
            "assistant",
            response.final,
            meta={"intent": response.intent, "run_id": str(run.id)},
        )
        await session.commit()
        return response.model_copy(update={"thread_id": thread.id, "run_id": run.id})
    except Exception:  # noqa: BLE001
        logger.exception("Persistence failed; returning ephemeral response")
        await session.rollback()
        return response


@router.post("/stream", dependencies=[Depends(require_api_key)])
async def chat_stream(req: ChatRequest):
    """Streams after full graph completion (MVP). Persistence hooks land on non-stream path first."""

    async def gen():
        state = await run_platform_turn(
            req.message,
            notify_channels=req.notify_channels or [],
            orchestrator=req.orchestrator,
        )
        text = state.get("final", "")
        step = max(len(text) // 80, 24)
        for i in range(0, len(text), step):
            yield {"event": "token", "data": text[i : i + step]}
        yield {"event": "done", "data": state.get("intent", "")}

    return EventSourceResponse(gen())
