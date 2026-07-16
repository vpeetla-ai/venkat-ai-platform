"""Record compliant workflow outcomes to agent-finops (ADR-029)."""

from __future__ import annotations

import logging
from typing import Any

import httpx

from app.core.config import Settings, get_settings

logger = logging.getLogger(__name__)


async def record_platform_outcome(
    *,
    workflow_id: str,
    state: dict[str, Any],
    settings: Settings | None = None,
) -> dict[str, Any] | None:
    settings = settings or get_settings()
    base = (settings.agentfinops_url or "").strip()
    if not base:
        return None

    final = str(state.get("final_answer") or state.get("answer") or state.get("response") or "")
    eval_pass = len(final.strip()) >= 20 and not state.get("error")
    hitl_required = bool(state.get("hitl_pending") or state.get("awaiting_approval"))
    hitl_approved = bool(state.get("hitl_approved", True)) if hitl_required else True
    budget_ok = not bool(state.get("budget_halted") or state.get("budget_breached"))
    policy_deny = bool(state.get("policy_deny") or state.get("gateway_denied"))
    cost = float(state.get("total_cost_usd") or state.get("cost_usd") or 0.0)

    payload = {
        "workflow_id": workflow_id,
        "tenant_id": settings.llm_gateway_tenant_id or "vap",
        "eval_pass": eval_pass,
        "policy_deny": policy_deny,
        "hitl_required": hitl_required,
        "hitl_approved": hitl_approved,
        "budget_ok": budget_ok,
        "total_cost_usd": cost,
    }
    headers = {"Content-Type": "application/json"}
    if settings.agentfinops_api_key:
        headers["X-API-Key"] = settings.agentfinops_api_key
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.post(f"{base.rstrip('/')}/v1/outcomes", json=payload, headers=headers)
            r.raise_for_status()
            return r.json()
    except Exception as exc:  # noqa: BLE001
        logger.warning("finops_outcome_record_failed: %s", exc)
        return {"error": str(exc), "payload": payload}
