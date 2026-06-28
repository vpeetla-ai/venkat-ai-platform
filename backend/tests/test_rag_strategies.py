"""Tests for RAG strategy helpers (no LLM / vector DB required)."""

from app.memory.rag_strategies import _keyword_score, _merge_hits


def test_keyword_score():
    assert _keyword_score("enterprise rag architecture", "enterprise rag systems fail") > 0
    assert _keyword_score("", "text") == 0.0


def test_merge_hits_dedupes():
    a = [{"score": 0.9, "payload": {"text": "same chunk"}}]
    b = [{"score": 0.8, "payload": {"text": "same chunk"}}]
    c = [{"score": 0.7, "payload": {"text": "other chunk"}}]
    merged = _merge_hits(a, b, c, limit=5)
    assert len(merged) == 2
