"""Tests for A2A Agent Card endpoints."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_well_known_agent_json():
    response = client.get("/.well-known/agent.json")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Venkat AI Platform"
    assert len(data["skills"]) == 3
    assert data["protocolVersion"] == "0.2.0"


def test_platform_agent_card():
    response = client.get("/a2a/agent-card")
    assert response.status_code == 200
    assert response.json()["url"].endswith("/orchestrators")


def test_research_orchestrator_agent_card():
    response = client.get("/orchestrators/research/agent-card")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Deep Research Pipeline"
    assert "deep_research" in data["skills"][0]["tags"]


def test_unknown_orchestrator_agent_card_404():
    response = client.get("/orchestrators/unknown/agent-card")
    assert response.status_code == 404
