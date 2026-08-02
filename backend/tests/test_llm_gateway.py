"""LLM gateway plane wiring (no live gateway required)."""

from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.core.config import get_settings
from app.db.session import get_session
from app.llm.factory import chat_llm_for_bucket, llm_gateway_enabled
from app.llm.router import RouteBucket
from app.main import app


def test_llm_gateway_disabled_by_default(monkeypatch):
    monkeypatch.delenv("LLM_GATEWAY_URL", raising=False)
    get_settings.cache_clear()
    assert llm_gateway_enabled() is False
    get_settings.cache_clear()


def test_factory_prefers_llm_gateway_url(monkeypatch):
    monkeypatch.setenv("LLM_GATEWAY_URL", "http://127.0.0.1:8100/v1")
    monkeypatch.setenv("LLM_GATEWAY_TENANT_ID", "vap-test")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    get_settings.cache_clear()

    assert llm_gateway_enabled() is True
    llm = chat_llm_for_bucket(RouteBucket.FAST)
    base = getattr(llm, "openai_api_base", None) or getattr(llm, "base_url", None)
    assert base is not None
    assert "127.0.0.1:8100" in str(base)

    get_settings.cache_clear()


def test_ops_metrics_shows_llm_gateway(monkeypatch):
    monkeypatch.setenv("LLM_GATEWAY_URL", "http://127.0.0.1:8100/v1")
    monkeypatch.setenv("LLM_GATEWAY_TENANT_ID", "vap")
    get_settings.cache_clear()

    async def _fake_session():
        yield AsyncMock()

    app.dependency_overrides[get_session] = _fake_session
    try:
        with patch(
            "app.api.routes.ops.collect_ops_metrics",
            new=AsyncMock(
                return_value={
                    "service": "venkat-ai-platform",
                    "extra": {"workflow_runs": 0},
                }
            ),
        ):
            client = TestClient(app)
            resp = client.get("/api/v1/ops/metrics")
        assert resp.status_code == 200
        body = resp.json()["extra"]
        gw = body["llm_gateway"]
        assert gw["enabled"] is True
        assert gw["plane"] == "aegis-llm-gateway"
        assert gw["tenant_id"] == "vap"
        assert "aegis_gateway" in body
        assert body["aegis_gateway"]["plane"] == "aegisai-tool-gateway"
        assert body["hitl"]["ui"] == "aegisai"
        assert "module=hitl" in body["hitl"]["deep_link"]
        assert "langfuse_configured" in body["observability"]

        status = client.get("/api/v1/ops/observability/status")
        assert status.status_code == 200
        planes = status.json()["planes"]
        assert planes["llm_gateway"]["plane"] == "aegis-llm-gateway"
        assert planes["aegis_gateway"]["plane"] == "aegisai-tool-gateway"
        assert planes["hitl"]["ui"] == "aegisai"
        assert planes["langfuse"]["configured"] is False
    finally:
        app.dependency_overrides.pop(get_session, None)
        get_settings.cache_clear()
