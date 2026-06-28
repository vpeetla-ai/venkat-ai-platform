"""Orchestrator registry — platform (default), research, architecture."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import Any

from app.agents.chief import classify_intent
from app.orchestrator.architecture_graph import run_architecture_turn
from app.orchestrator.graph import run_platform_graph_turn
from app.orchestrator.research_graph import run_research_turn

OrchestratorFn = Callable[[str, list[str] | None], Awaitable[dict[str, Any]]]

ORCHESTRATORS: dict[str, OrchestratorFn] = {
    "platform": run_platform_graph_turn,
    "research": run_research_turn,
    "architecture": run_architecture_turn,
}

INTENT_ORCHESTRATOR: dict[str, str] = {
    "deep_research": "research",
    "architecture_review": "architecture",
}

ORCHESTRATOR_META = [
    {
        "id": "platform",
        "name": "Principal Platform",
        "description": "Chief → parallel workers → insight → critic → notify (default)",
        "intents": [
            "general",
            "news_learning",
            "rag_query",
            "rag_expert",
            "market_analysis",
            "security_review",
        ],
    },
    {
        "id": "research",
        "name": "Deep Research Pipeline",
        "description": "Recon (web + all RAG strategies) → gap analysis → ReAct loop → reflection",
        "intents": ["deep_research"],
    },
    {
        "id": "architecture",
        "name": "Architecture Review",
        "description": "Security + compliance + RAG + plan-execute + reflection loop",
        "intents": ["architecture_review"],
    },
]


async def run_platform_turn(
    user_message: str,
    notify_channels: list[str] | None = None,
    *,
    orchestrator: str | None = None,
) -> dict[str, Any]:
    """Route to the right orchestrator by explicit id or chief intent."""
    orch_id = orchestrator
    if orch_id is None:
        intent = await classify_intent(user_message)
        orch_id = INTENT_ORCHESTRATOR.get(intent, "platform")
    else:
        intent = ""

    runner = ORCHESTRATORS.get(orch_id, run_platform_graph_turn)
    state = await runner(user_message, notify_channels)
    if intent and not state.get("intent"):
        state["intent"] = intent
    return state
