from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.db.session import get_session
from app.llm.factory import llm_gateway_enabled
from app.services.ops_metrics import collect_ops_metrics

router = APIRouter(prefix="/api/v1/ops", tags=["ops"])

AEGIS_HITL_DEEP_LINK = (
    "https://aegisai-enterprise-agent-platform.vercel.app/?view=product&module=hitl"
)


@router.get("/metrics")
async def ops_metrics(db: Annotated[AsyncSession, Depends(get_session)]):
    """Public anonymized ops metrics for architect landing dashboard."""
    metrics = await collect_ops_metrics(db)
    settings = get_settings()
    extra = dict(metrics.get("extra") or {})
    aegis_configured = bool((settings.aegisai_api_base_url or "").strip())
    langfuse_configured = bool(
        (settings.langfuse_public_key or "").strip() and (settings.langfuse_secret_key or "").strip()
    )
    extra["llm_gateway"] = {
        "enabled": llm_gateway_enabled(settings),
        "url_configured": bool(settings.llm_gateway_url),
        "tenant_id": settings.llm_gateway_tenant_id if llm_gateway_enabled(settings) else None,
        "plane": "aegis-llm-gateway",
    }
    extra["aegis_gateway"] = {
        "configured": aegis_configured,
        "enabled": bool(settings.aegisai_gateway_enabled) and aegis_configured,
        "fail_open": bool(settings.aegisai_gateway_fail_open),
        "agent_id": settings.aegisai_agent_id if aegis_configured else None,
        "plane": "aegisai-tool-gateway",
    }
    extra["observability"] = {
        "langfuse_configured": langfuse_configured,
        "langfuse_host": settings.langfuse_host if langfuse_configured else None,
        "note": "Langfuse is optional; AegisAI remains HITL/audit source of truth.",
    }
    extra["hitl"] = {
        "ui": "aegisai",
        "deep_link": AEGIS_HITL_DEEP_LINK,
    }
    metrics["extra"] = extra
    return metrics


@router.get("/observability/status")
async def observability_status():
    """Compose-plane honesty for VAP (orchestration) — not governance SoT."""
    settings = get_settings()
    aegis_configured = bool((settings.aegisai_api_base_url or "").strip())
    langfuse_configured = bool(
        (settings.langfuse_public_key or "").strip() and (settings.langfuse_secret_key or "").strip()
    )
    return {
        "source_of_truth": (
            "VAP run/thread store for orchestration plans; "
            "AegisAI remains HITL/audit source of truth for side effects"
        ),
        "exporters": [
            {
                "name": "OpsMetrics",
                "state": "live",
                "detail": "GET /api/v1/ops/metrics — anonymized run counters + compose planes",
            },
            {
                "name": "Langfuse",
                "state": "configured" if langfuse_configured else "unconfigured",
                "detail": "Optional trace export — not required for Demo mode",
            },
        ],
        "planes": {
            "llm_gateway": {
                "enabled": llm_gateway_enabled(settings),
                "url_configured": bool(settings.llm_gateway_url),
                "plane": "aegis-llm-gateway",
            },
            "aegis_gateway": {
                "configured": aegis_configured,
                "enabled": bool(settings.aegisai_gateway_enabled) and aegis_configured,
                "fail_open": bool(settings.aegisai_gateway_fail_open),
                "plane": "aegisai-tool-gateway",
            },
            "langfuse": {
                "configured": langfuse_configured,
                "host": settings.langfuse_host if langfuse_configured else None,
            },
            "hitl": {"ui": "aegisai", "deep_link": AEGIS_HITL_DEEP_LINK},
        },
        "recommendation": (
            "Use VAP for what agents should do; route irreversible tools through AegisAI. "
            "Do not treat Langfuse as the governance ledger."
        ),
    }