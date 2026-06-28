from fastapi import APIRouter, Query

from app.memory.rag_strategies import ALL_STRATEGIES, RagStrategy, format_hits, retrieve

router = APIRouter(prefix="/rag", tags=["rag"])


@router.get("/strategies")
async def list_rag_strategies():
    return {"strategies": [s.value for s in ALL_STRATEGIES]}


@router.post("/retrieve")
async def rag_retrieve(
    query: str = Query(..., min_length=1),
    strategy: RagStrategy = RagStrategy.HYBRID,
    limit: int = Query(5, ge=1, le=20),
):
    hits = await retrieve(strategy, query, limit=limit)
    return {"strategy": strategy.value, "hits": hits, "formatted": format_hits(hits)}
