from fastapi import APIRouter

from app.memory.vector_store import upsert_chunks
from app.schemas.ingest import IngestRequest

router = APIRouter(prefix="/ingest", tags=["rag"])


@router.post("")
async def ingest(req: IngestRequest):
    ids = [c.id for c in req.chunks]
    texts = [c.text for c in req.chunks]
    payloads = [
        {"text": c.text, **(c.metadata or {}), "chunk_id": c.id} for c in req.chunks
    ]
    await upsert_chunks(ids, texts, payloads)
    return {"ingested": len(req.chunks)}
