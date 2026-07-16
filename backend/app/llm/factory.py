from langchain_openai import ChatOpenAI

from app.core.config import Settings, get_settings
from app.llm.router import RouteBucket

# App-local → thesis (keep VAP names; contract-aligned)
_BUCKET_TIER = {
    RouteBucket.REASONING: "high_reasoning",
    RouteBucket.STRUCTURED: "specialized",
    RouteBucket.FAST: "fast",
    RouteBucket.CODE: "specialized",
}

_AGENT_THESIS = {
    "chief": "planner",
    "planner": "planner",
    "researcher": "retriever",
    "worker": "executor",
    "coder": "executor",
    "critic": "verifier",
    "verifier": "verifier",
    "summarizer": "summarizer",
}


def llm_gateway_enabled(settings: Settings | None = None) -> bool:
    settings = settings or get_settings()
    return bool(settings.llm_gateway_url and settings.llm_gateway_url.strip())


def chat_llm_for_bucket(
    bucket: RouteBucket,
    settings: Settings | None = None,
    *,
    agent_role: str | None = None,
    data_class: str = "internal",
    generator_provider: str | None = None,
    workflow_id: str | None = None,
) -> ChatOpenAI:
    settings = settings or get_settings()
    model = _model_for_bucket(bucket, settings)
    kwargs: dict = {"model": model, "temperature": 0.2}

    # Federated LLM gateway plane (aegis-llm-gateway) — preferred when configured.
    if llm_gateway_enabled(settings):
        base = settings.llm_gateway_url.rstrip("/")
        thesis = _AGENT_THESIS.get((agent_role or "").lower(), "executor")
        # Verifier independence: selected provider must differ from generator.
        selected = "gemini" if thesis == "verifier" else "stub"
        if thesis == "verifier" and (generator_provider or "").lower() == "gemini":
            selected = "anthropic"
        headers = {
            "X-Tenant-Id": settings.llm_gateway_tenant_id or "vap",
            "X-Agent-Role": agent_role or "worker",
            "X-Thesis-Role": thesis,
            "X-Data-Class": data_class,
            "X-Selected-Provider": selected,
            "X-Model-Tier": _BUCKET_TIER.get(bucket, "high_reasoning"),
        }
        if workflow_id:
            headers["X-Workflow-Id"] = workflow_id
        if generator_provider:
            headers["X-Generator-Provider"] = generator_provider
        if thesis == "verifier":
            headers["X-Cache-Bypass"] = "true"
        if settings.llm_gateway_principal_id:
            headers["X-Principal-Id"] = settings.llm_gateway_principal_id
            # Prefer structured/reasoning model but different provider label for enforce
            kwargs["model"] = settings.model_reasoning
        return ChatOpenAI(
            api_key=settings.llm_gateway_api_key or "vap-gateway",
            base_url=base,
            default_headers=headers,
            **kwargs,
        )

    if settings.llm_default_provider == "openrouter" and settings.openrouter_api_key:
        return ChatOpenAI(
            api_key=settings.openrouter_api_key,
            base_url=settings.openrouter_base_url,
            **kwargs,
        )
    if settings.openai_api_key:
        return ChatOpenAI(api_key=settings.openai_api_key, **kwargs)
    if settings.groq_api_key:
        return ChatOpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
            model=_groq_model_alias(model),
            temperature=0.2,
        )
    raise RuntimeError(
        "No LLM credentials configured. Set LLM_GATEWAY_URL, OPENROUTER_API_KEY, "
        "OPENAI_API_KEY, or GROQ_API_KEY."
    )


def _model_for_bucket(bucket: RouteBucket, settings: Settings) -> str:
    return {
        RouteBucket.REASONING: settings.model_reasoning,
        RouteBucket.STRUCTURED: settings.model_structured,
        RouteBucket.FAST: settings.model_fast,
        RouteBucket.CODE: settings.model_code,
    }[bucket]


def _groq_model_alias(openrouter_style: str) -> str:
    """Map common OpenRouter ids to Groq-hosted ids when using Groq base URL."""
    lower = openrouter_style.lower()
    if "llama-3.3" in lower or "llama3.3" in lower:
        return "llama-3.3-70b-versatile"
    if "mistral" in lower:
        return "mixtral-8x7b-32768"
    if "gpt-4" in lower:
        return "llama-3.3-70b-versatile"
    return "llama-3.3-70b-versatile"
