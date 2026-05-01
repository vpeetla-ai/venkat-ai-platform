import uuid
from typing import Sequence

from qdrant_client import QdrantClient
from qdrant_client.http import models as qm

from app.core.config import get_settings
from app.memory.embeddings import embed_texts
from app.memory.pinecone_optional import upsert_vectors_async


def _client() -> QdrantClient:
    return QdrantClient(url=get_settings().qdrant_url)


async def ensure_collection(vector_size: int = 1536) -> None:
    settings = get_settings()
    client = _client()
    cols = client.get_collections().collections
    names = {c.name for c in cols}
    if settings.qdrant_collection in names:
        return
    client.create_collection(
        collection_name=settings.qdrant_collection,
        vectors_config=qm.VectorParams(size=vector_size, distance=qm.Distance.COSINE),
    )


async def upsert_chunks(ids: Sequence[str], texts: Sequence[str], payloads: list[dict] | None = None) -> None:
    settings = get_settings()
    vectors = await embed_texts(texts)
    await ensure_collection(vector_size=len(vectors[0]))
    client = _client()
    points = [
        qm.PointStruct(
            id=str(uuid.uuid5(uuid.NAMESPACE_URL, ids[i])),
            vector=vectors[i],
            payload=payloads[i] if payloads else {"text": texts[i], "chunk_id": ids[i]},
        )
        for i in range(len(texts))
    ]
    client.upsert(collection_name=settings.qdrant_collection, points=points)
    pay = payloads if payloads else [{"text": texts[i], "chunk_id": ids[i]} for i in range(len(texts))]
    await upsert_vectors_async(ids, vectors, pay)


async def search(query: str, limit: int = 5) -> list[dict]:
    settings = get_settings()
    qv = (await embed_texts([query]))[0]
    client = _client()
    res = client.search(
        collection_name=settings.qdrant_collection,
        query_vector=qv,
        limit=limit,
    )
    return [{"score": h.score, "payload": h.payload} for h in res]
