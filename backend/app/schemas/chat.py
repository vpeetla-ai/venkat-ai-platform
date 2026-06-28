from uuid import UUID

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=32000)
    notify_channels: list[str] | None = Field(
        default=None,
        description="Optional: slack, telegram, whatsapp — sends final report if configured",
    )
    thread_id: UUID | None = Field(
        default=None,
        description="Continue an existing conversation; omit to start a new persisted thread",
    )
    orchestrator: str | None = Field(
        default=None,
        description="Force orchestrator: platform | research | architecture (auto-routed by intent if omitted)",
    )


class ChatResponse(BaseModel):
    thread_id: UUID | None = None
    run_id: UUID | None = None
    intent: str
    plan: str
    outputs: dict[str, str]
    final: str
    delivery: dict[str, bool]
