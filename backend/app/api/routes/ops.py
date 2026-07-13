from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.db.session import get_session
from app.llm.factory import llm_gateway_enabled
from app.services.ops_metrics import collect_ops_metrics

router = APIRouter(prefix="/api/v1/ops", tags=["ops"])


@router.get("/metrics")
async def ops_metrics(db: Annotated[AsyncSession, Depends(get_session)]):
    """Public anonymized ops metrics for architect landing dashboard."""
    metrics = await collect_ops_metrics(db)
    settings = get_settings()
    extra = dict(metrics.get("extra") or {})
    extra["llm_gateway"] = {
        "enabled": llm_gateway_enabled(settings),
        "url_configured": bool(settings.llm_gateway_url),
        "tenant_id": settings.llm_gateway_tenant_id if llm_gateway_enabled(settings) else None,
        "plane": "aegis-llm-gateway",
    }
    metrics["extra"] = extra
    return metrics
