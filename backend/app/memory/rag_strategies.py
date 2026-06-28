"""RAG architecture variants — reference implementations for enterprise retrieval patterns."""

from __future__ import annotations

import re
from enum import Enum
from typing import Any

from app.memory.vector_store import search


class RagStrategy(str, Enum):
    NAIVE = "naive"
    MULTI_QUERY = "multi_query"
    HYBRID = "hybrid"
    PARENT_DOCUMENT = "parent_document"
    RERANK = "rerank"
    HYDE = "hyde"
    ENTERPRISE = "enterprise"


ALL_STRATEGIES: tuple[RagStrategy, ...] = tuple(RagStrategy)


def _chunk_text(hit: dict) -> str:
    payload = hit.get("payload") or {}
    if isinstance(payload, dict):
        return str(payload.get("text") or payload.get("content") or payload)
    return str(payload)


def _keyword_score(query: str, text: str) -> float:
    q_tokens = {t for t in re.findall(r"\w+", query.lower()) if len(t) > 2}
    if not q_tokens:
        return 0.0
    t_tokens = re.findall(r"\w+", text.lower())
    hits = sum(1 for t in t_tokens if t in q_tokens)
    return hits / max(len(q_tokens), 1)


def _merge_hits(*hit_lists: list[dict], limit: int) -> list[dict]:
    seen: set[str] = set()
    merged: list[dict] = []
    for hits in hit_lists:
        for h in hits:
            text = _chunk_text(h)
            key = text[:200]
            if key in seen:
                continue
            seen.add(key)
            merged.append(h)
            if len(merged) >= limit:
                return merged
    return merged


async def _multi_query_variants(query: str, n: int = 3) -> list[str]:
    from app.agents._llm import ainvoke
    from app.llm.router import RouteBucket

    system = """Generate short search query variants for retrieval.
Return one variant per line, no numbering, max 12 words each."""
    raw = await ainvoke(system, f"Original query:\n{query}\n\nVariants ({n}):", RouteBucket.FAST)
    lines = [ln.strip() for ln in raw.splitlines() if ln.strip()]
    variants = [query, *lines[: n - 1]]
    return list(dict.fromkeys(variants))


async def _hyde_query(query: str) -> str:
    from app.agents._llm import ainvoke
    from app.llm.router import RouteBucket

    system = """Write a short hypothetical document passage (80-120 words) that would answer the question.
No preamble — passage only."""
    return await ainvoke(system, query, RouteBucket.FAST)


async def _llm_rerank(query: str, hits: list[dict], limit: int) -> list[dict]:
    from app.agents._llm import ainvoke
    from app.llm.router import RouteBucket

    if len(hits) <= limit:
        return hits
    numbered = "\n\n".join(f"[{i}] {_chunk_text(h)[:500]}" for i, h in enumerate(hits))
    system = f"""Rank passages by relevance to the query. Return ONLY comma-separated indices of top {limit} (0-based)."""
    raw = await ainvoke(system, f"QUERY:\n{query}\n\nPASSAGES:\n{numbered}", RouteBucket.FAST)
    indices: list[int] = []
    for part in re.findall(r"\d+", raw):
        idx = int(part)
        if 0 <= idx < len(hits) and idx not in indices:
            indices.append(idx)
        if len(indices) >= limit:
            break
    if not indices:
        return hits[:limit]
    return [hits[i] for i in indices]


async def retrieve(strategy: RagStrategy, query: str, limit: int = 5) -> list[dict]:
    """Run a specific RAG retrieval architecture."""
    if strategy == RagStrategy.ENTERPRISE:
        from app.integrations.enterprise_rag import enterprise_rag_enabled, retrieve_chunks

        if enterprise_rag_enabled():
            hits = await retrieve_chunks(query, limit=limit)
            if hits:
                return hits
        return await search(query, limit=limit)

    if strategy == RagStrategy.NAIVE:
        return await search(query, limit=limit)

    if strategy == RagStrategy.MULTI_QUERY:
        variants = await _multi_query_variants(query)
        lists = [await search(v, limit=limit) for v in variants]
        return _merge_hits(*lists, limit=limit)

    if strategy == RagStrategy.HYBRID:
        vector_hits = await search(query, limit=limit * 2)
        for h in vector_hits:
            text = _chunk_text(h)
            vec = float(h.get("score") or 0.0)
            kw = _keyword_score(query, text)
            h["hybrid_score"] = 0.65 * vec + 0.35 * kw
        vector_hits.sort(key=lambda x: x.get("hybrid_score", 0), reverse=True)
        return vector_hits[:limit]

    if strategy == RagStrategy.PARENT_DOCUMENT:
        hits = await search(query, limit=limit * 2)
        parents: dict[str, dict] = {}
        for h in hits:
            payload = h.get("payload") or {}
            parent_id = str(payload.get("parent_id") or payload.get("chunk_id") or _chunk_text(h)[:80])
            parent_text = payload.get("parent_text") or _chunk_text(h)
            score = float(h.get("score") or 0)
            existing = parents.get(parent_id)
            if existing is None or score > float(existing.get("score") or 0):
                parents[parent_id] = {
                    "score": score,
                    "payload": {**payload, "text": parent_text, "parent_id": parent_id},
                }
        ranked = sorted(parents.values(), key=lambda x: x.get("score", 0), reverse=True)
        return ranked[:limit]

    if strategy == RagStrategy.HYDE:
        hypo = await _hyde_query(query)
        return await search(hypo, limit=limit)

    if strategy == RagStrategy.RERANK:
        candidates = await search(query, limit=max(limit * 2, 8))
        return await _llm_rerank(query, candidates, limit)

    return await search(query, limit=limit)


def format_hits(hits: list[dict]) -> str:
    if not hits:
        return "(no retrieval hits — ingest documents via POST /ingest)"
    lines: list[str] = []
    for i, h in enumerate(hits, 1):
        score = h.get("hybrid_score", h.get("score", ""))
        lines.append(f"[{i}] score={score}\n{_chunk_text(h)[:600]}")
    return "\n\n".join(lines)


async def retrieve_all_strategies(query: str, limit: int = 3) -> dict[str, Any]:
    """Run every RAG architecture for comparison (rag_expert intent)."""
    results: dict[str, Any] = {}
    for strategy in ALL_STRATEGIES:
        try:
            hits = await retrieve(strategy, query, limit=limit)
            results[strategy.value] = {
                "hit_count": len(hits),
                "preview": format_hits(hits)[:1200],
            }
        except Exception as exc:  # noqa: BLE001
            results[strategy.value] = {"hit_count": 0, "preview": f"(error: {exc})"}
    return results
