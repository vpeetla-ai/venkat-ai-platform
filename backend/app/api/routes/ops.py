from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.services.ops_metrics import collect_ops_metrics

router = APIRouter(prefix="/api/v1/ops", tags=["ops"])


@router.get("/metrics")
async def ops_metrics(db: Annotated[AsyncSession, Depends(get_session)]):
    """Public anonymized ops metrics for architect landing dashboard."""
    return await collect_ops_metrics(db)
