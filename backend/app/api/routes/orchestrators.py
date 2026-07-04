from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import require_api_key
from app.orchestrator.registry import ORCHESTRATOR_META, ORCHESTRATORS, run_platform_turn
from app.schemas.orchestrators import OrchestratorInvokeRequest, OrchestratorListResponse

router = APIRouter(prefix="/orchestrators", tags=["orchestrators"])


@router.get("", response_model=OrchestratorListResponse)
async def list_orchestrators() -> OrchestratorListResponse:
    return OrchestratorListResponse(orchestrators=ORCHESTRATOR_META)


@router.post("/{orchestrator_id}/run", dependencies=[Depends(require_api_key)])
async def run_orchestrator(orchestrator_id: str, req: OrchestratorInvokeRequest):
    if orchestrator_id not in ORCHESTRATORS:
        raise HTTPException(status_code=404, detail=f"Unknown orchestrator: {orchestrator_id}")
    state = await run_platform_turn(
        req.message,
        notify_channels=req.notify_channels,
        orchestrator=orchestrator_id,
    )
    return {
        "orchestrator": orchestrator_id,
        "intent": state.get("intent", ""),
        "plan": state.get("plan", ""),
        "outputs": state.get("outputs", {}),
        "final": state.get("final", ""),
        "delivery": state.get("delivery", {}),
    }
