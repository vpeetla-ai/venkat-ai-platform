"""A2A Agent Card endpoints — teaching layer for inter-agent protocol (ADR-007)."""

from __future__ import annotations

import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.orchestrator.registry import ORCHESTRATOR_META
from app.schemas.a2a import AgentCapabilities, AgentCard, AgentSkill

router = APIRouter(tags=["a2a"])


def _base_url() -> str:
    return os.getenv("PUBLIC_API_BASE_URL", "http://localhost:8000").rstrip("/")


def build_platform_agent_card() -> AgentCard:
    base = _base_url()
    skills = [
        AgentSkill(
            id=meta["id"],
            name=meta["name"],
            description=meta["description"],
            tags=meta.get("intents", []),
        )
        for meta in ORCHESTRATOR_META
    ]
    return AgentCard(
        name="Venkat AI Platform",
        description="Multi-agent orchestration OS — LangGraph specialists with gateway-wrapped delivery.",
        url=f"{base}/orchestrators",
        skills=skills,
        capabilities=AgentCapabilities(streaming=True, pushNotifications=True, stateTransitionHistory=True),
    )


def build_orchestrator_agent_card(orchestrator_id: str) -> AgentCard:
    meta = next((m for m in ORCHESTRATOR_META if m["id"] == orchestrator_id), None)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Unknown orchestrator: {orchestrator_id}")
    base = _base_url()
    return AgentCard(
        name=meta["name"],
        description=meta["description"],
        url=f"{base}/orchestrators/{orchestrator_id}/run",
        skills=[
            AgentSkill(
                id=meta["id"],
                name=meta["name"],
                description=meta["description"],
                tags=meta.get("intents", []),
            )
        ],
    )


@router.get("/a2a/agent-card", response_model=AgentCard)
async def platform_agent_card() -> AgentCard:
    """Platform-level A2A Agent Card."""
    return build_platform_agent_card()


@router.get("/orchestrators/{orchestrator_id}/agent-card", response_model=AgentCard)
async def orchestrator_agent_card(orchestrator_id: str) -> AgentCard:
    """Per-specialist A2A Agent Card."""
    return build_orchestrator_agent_card(orchestrator_id)


@router.get("/.well-known/agent.json")
async def well_known_agent_card() -> JSONResponse:
    """Well-known discovery URL for A2A clients."""
    card = build_platform_agent_card()
    return JSONResponse(content=card.model_dump())
