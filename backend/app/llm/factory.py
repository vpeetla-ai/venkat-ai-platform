from langchain_openai import ChatOpenAI

from app.core.config import Settings, get_settings
from app.llm.router import RouteBucket


def chat_llm_for_bucket(bucket: RouteBucket, settings: Settings | None = None) -> ChatOpenAI:
    settings = settings or get_settings()
    model = _model_for_bucket(bucket, settings)
    kwargs: dict = {"model": model, "temperature": 0.2}

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
        "No LLM credentials configured. Set OPENROUTER_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY."
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
