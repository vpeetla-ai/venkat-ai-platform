"""Enterprise RAG Platform adapter — governed retrieval via sibling knowledge service."""

from __future__ import annotations

import logging
from typing import Any

import httpx

from app.core.config import get_settings
from app.integrations.aegis_gateway import authorize_tool

logger = logging.getLogger(__name__)


def enterprise_rag_enabled() -> bool:
    settings = get_settings()
    return bool(settings.enterprise_rag_api_base_url and settings.enterprise_rag_enabled)


def _headers() -> dict[str, str]:
    settings = get_settings()
    headers = {"Content-Type": "application/json"}
    if settings.enterprise_rag_api_key:
        headers["Authorization"] = f"Bearer {settings.enterprise_rag_api_key}"
    return headers


async def retrieve_chunks(query: str, *, limit: int = 5, case_id: str | None = None) -> list[dict]:
    """Retrieve authorized chunks from enterprise RAG /v1/retrieve."""
    settings = get_settings()
    if not enterprise_rag_enabled():
        return []

    authz = await authorize_tool(
        tool_name="rag.search_policy_memory",
        action_type="retrieve",
        target_system="enterprise_rag",
        case_id=case_id,
    )
    if authz.blocked:
        logger.warning("Enterprise RAG retrieval blocked by gateway: %s", authz.reason)
        return []

    payload = {
        "query": query,
        "tenant_id": settings.enterprise_rag_tenant_id,
        "user_id": settings.enterprise_rag_user_id,
        "groups": settings.enterprise_rag_groups_list(),
        "top_k": limit,
        "rerank": True,
        "case_id": case_id,
    }
    url = f"{settings.enterprise_rag_api_base_url.rstrip('/')}/v1/retrieve"
    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(url, json=payload, headers=_headers())
            response.raise_for_status()
            data = response.json()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Enterprise RAG retrieve failed: %s", exc)
        return []

    hits: list[dict] = []
    for item in data.get("hits", []):
        if not isinstance(item, dict):
            continue
        hits.append(
            {
                "score": float(item.get("score") or 0.0),
                "payload": {
                    "text": item.get("text", ""),
                    "title": item.get("title", ""),
                    "document_id": item.get("document_id", ""),
                    "uri": item.get("uri", ""),
                    "owner": item.get("owner", ""),
                    "source": "enterprise_rag",
                },
            }
        )
    return hits[:limit]


async def answer_with_governance(query: str, *, case_id: str | None = None) -> dict[str, Any]:
    settings = get_settings()
    payload = {
        "query": query,
        "tenant_id": settings.enterprise_rag_tenant_id,
        "user_id": settings.enterprise_rag_user_id,
        "groups": settings.enterprise_rag_groups_list(),
        "case_id": case_id,
    }
    url = f"{settings.enterprise_rag_api_base_url.rstrip('/')}/v1/answer"
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(url, json=payload, headers=_headers())
        response.raise_for_status()
        return response.json()
