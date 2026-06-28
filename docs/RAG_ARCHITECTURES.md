# RAG Architectures in VAP

VAP implements six retrieval patterns as reference code for enterprise RAG design discussions.

**Module:** `backend/app/memory/rag_strategies.py`

## Strategies

### 1. Naive (`naive`)

Single embedding search, top-k by cosine similarity. Baseline for comparison.

### 2. Multi-query (`multi_query`)

LLM generates 2–3 query variants; results merged and deduplicated. Improves recall on ambiguous questions.

### 3. Hybrid (`hybrid`)

Combines vector score (65%) with keyword overlap (35%). Default for `KnowledgeAgent`. Good when users use exact product names or acronyms.

### 4. Parent document (`parent_document`)

Chunks are indexed with optional metadata:

```json
{
  "id": "chunk-1",
  "text": "small chunk text",
  "metadata": {
    "parent_id": "doc-42",
    "parent_text": "Full section or document for context window"
  }
}
```

Retrieval promotes the best-scoring parent, not just the chunk.

### 5. Rerank (`rerank`)

Fetch 2× candidates, LLM selects top indices. Higher latency, better precision.

### 6. HyDE (`hyde`)

Generate a hypothetical answer passage, embed it, search with that vector. Helps semantic gap between question and document phrasing.

## API

```bash
curl "http://localhost:8000/rag/strategies"
curl -X POST "http://localhost:8000/rag/retrieve?query=enterprise%20rag&strategy=hybrid&limit=5"
```

## RagExpertAgent

Intent `rag_expert` runs **all** strategies, compares previews, and recommends which architecture fits the query.

## Pair with AegisAI

For access-aware retrieval, signed audit on ingest, and fleet-wide policy on RAG tools, route through [AegisAI](https://github.com/vpeetla-ai/aegisai-enterprise-agent-platform) — see [ECOSYSTEM.md](ECOSYSTEM.md).
