"""Phase 8 enterprise stub — replace with OAuth + REST client."""

from app.core.config import get_settings


def salesforce_configured() -> bool:
    s = get_settings()
    return bool(s.salesforce_client_id and s.salesforce_client_secret and s.salesforce_instance_url)


async def describe_capabilities() -> str:
    if not salesforce_configured():
        return "Salesforce integration not configured (set SALESFORCE_* env vars)."
    return (
        "Salesforce stub: wire OAuth JWT or web server flow, then REST composite requests "
        "and Platform Events subscribers in workers."
    )
