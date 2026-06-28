from pydantic import BaseModel, Field


class OrchestratorInfo(BaseModel):
    id: str
    name: str
    description: str
    intents: list[str]


class OrchestratorListResponse(BaseModel):
    orchestrators: list[OrchestratorInfo]


class OrchestratorInvokeRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=32000)
    notify_channels: list[str] | None = None
