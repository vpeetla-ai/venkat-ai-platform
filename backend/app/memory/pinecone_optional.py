"""Dual-write hook for Pinecone (optional DR / multi-cloud index)."""

from __future__ import annotations

import asyncio
import logging
from typing import Sequence

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def pinecone_enabled() -> bool:
    s = get_settings()
    return bool(s.pinecone_api_key and s.pinecone_index)


def _flatten_metadata(payload: dict | None) -> dict:
    out: dict[str, str | float | int | bool] = {}
    if not payload:
        return out
    for raw_k, raw_v in payload.items():
        key = str(raw_k)[:256]
        if isinstance(raw_v, (str, int, float, bool)):
            out[key] = raw_v
        elif raw_v is None:
            continue
        else:
            out[key] = str(raw_v)[:512]
    return out


def upsert_vectors_sync(
    ids: Sequence[str],
    vectors: Sequence[list[float]],
    payloads: Sequence[dict] | None = None,
) -> None:
    if not pinecone_enabled():
        return
    try:
        from pinecone import Pinecone  # type: ignore[import-not-found]
    except ImportError:
        logger.warning("pinecone-client not installed; skipping Pinecone upsert")
        return

    s = get_settings()
    payloads = payloads or [{} for _ in ids]
    pc = Pinecone(api_key=s.pinecone_api_key)  # type: ignore[arg-type]
    index = pc.Index(s.pinecone_index)  # type: ignore[arg-type]
    batch = []
    for i, chunk_id in enumerate(ids):
        meta = _flatten_metadata(payloads[i] if i < len(payloads) else {})
        meta["chunk_id"] = chunk_id[:256]
        batch.append({"id": chunk_id[:512], "values": list(vectors[i]), "metadata": meta})
    try:
        index.upsert(vectors=batch)  # type: ignore[call-arg]
    except Exception as exc:  # noqa: BLE001
        logger.warning("Pinecone upsert failed (Qdrant remains source of truth): %s", exc)


async def upsert_vectors_async(
    ids: Sequence[str],
    vectors: Sequence[list[float]],
    payloads: Sequence[dict] | None = None,
) -> None:
    """Non-blocking for FastAPI event loop — Pinecone client is synchronous."""
    if not pinecone_enabled():
        return
    await asyncio.to_thread(upsert_vectors_sync, ids, vectors, payloads)
