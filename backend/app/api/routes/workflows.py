from fastapi import APIRouter

from app.services.salesforce_stub import describe_capabilities

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("/salesforce/status")
async def salesforce_status():
    return {"detail": await describe_capabilities()}
