"""Tests for the VAP_API_KEY gate on chat/orchestrator/ingest/rag/threads routes.

These routes previously had zero authentication despite calling an LLM, writing to
the vector DB, sending real Slack/Telegram/WhatsApp notifications, or reading a
user's chat history by thread UUID. Confirmed unauthenticated by direct code
inspection during an org-wide review; see ADR-008.
"""

from unittest.mock import AsyncMock, patch
from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

FAKE_STATE = {"intent": "chat", "plan": "", "outputs": {}, "final": "ok", "delivery": {}}


def test_chat_open_when_no_api_key_set(monkeypatch):
    from app.core.config import get_settings

    monkeypatch.delenv("VAP_API_KEY", raising=False)
    get_settings.cache_clear()
    with patch("app.api.routes.chat.run_platform_turn", new_callable=AsyncMock) as mock_run:
        mock_run.return_value = FAKE_STATE
        resp = client.post("/chat", json={"message": "hi"})
    assert resp.status_code == 200
    get_settings.cache_clear()


def test_chat_rejects_missing_key_when_required(monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setenv("VAP_API_KEY", "secret-key")
    get_settings.cache_clear()
    resp = client.post("/chat", json={"message": "hi"})
    assert resp.status_code == 401
    get_settings.cache_clear()


def test_chat_accepts_correct_key(monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setenv("VAP_API_KEY", "secret-key")
    get_settings.cache_clear()
    with patch("app.api.routes.chat.run_platform_turn", new_callable=AsyncMock) as mock_run:
        mock_run.return_value = FAKE_STATE
        resp = client.post("/chat", json={"message": "hi"}, headers={"X-API-Key": "secret-key"})
    assert resp.status_code == 200
    get_settings.cache_clear()


def test_orchestrator_run_rejects_missing_key_when_required(monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setenv("VAP_API_KEY", "secret-key")
    get_settings.cache_clear()
    resp = client.post("/orchestrators/research/run", json={"message": "hi"})
    assert resp.status_code == 401
    get_settings.cache_clear()


def test_ingest_rejects_missing_key_when_required(monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setenv("VAP_API_KEY", "secret-key")
    get_settings.cache_clear()
    resp = client.post("/ingest", json={"chunks": []})
    assert resp.status_code == 401
    get_settings.cache_clear()


def test_rag_retrieve_rejects_missing_key_when_required(monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setenv("VAP_API_KEY", "secret-key")
    get_settings.cache_clear()
    resp = client.post("/rag/retrieve", params={"query": "test"})
    assert resp.status_code == 401
    get_settings.cache_clear()


def test_thread_messages_rejects_missing_key_when_required(monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setenv("VAP_API_KEY", "secret-key")
    get_settings.cache_clear()
    resp = client.get(f"/threads/{uuid4()}/messages")
    assert resp.status_code == 401
    get_settings.cache_clear()


def test_a2a_discovery_stays_open_regardless_of_key(monkeypatch):
    """A2A discovery endpoints are meant to be public per spec — not gated."""
    from app.core.config import get_settings

    monkeypatch.setenv("VAP_API_KEY", "secret-key")
    get_settings.cache_clear()
    resp = client.get("/.well-known/agent.json")
    assert resp.status_code == 200
    get_settings.cache_clear()
