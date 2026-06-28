"""Tests for orchestrator registry."""

from app.orchestrator.registry import INTENT_ORCHESTRATOR, ORCHESTRATORS


def test_orchestrator_registry():
    assert "platform" in ORCHESTRATORS
    assert "research" in ORCHESTRATORS
    assert "architecture" in ORCHESTRATORS
    assert INTENT_ORCHESTRATOR["deep_research"] == "research"
    assert INTENT_ORCHESTRATOR["architecture_review"] == "architecture"
