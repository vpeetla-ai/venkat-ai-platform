"""Gateway integration tests (no live AegisAI required)."""

from app.integrations.aegis_gateway import gateway_enabled


def test_gateway_disabled_by_default(monkeypatch):
    monkeypatch.delenv("AEGISAI_API_BASE_URL", raising=False)
    from app.core.config import get_settings

    get_settings.cache_clear()
    assert gateway_enabled() is False
    get_settings.cache_clear()
