from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @staticmethod
    def _bool(v: object) -> bool:
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.strip().lower() in {"1", "true", "yes", "on"}
        return bool(v)

    @field_validator("daily_brief_enabled", "enable_db_persistence", mode="before")
    @classmethod
    def coerce_bool_flags(cls, value: object) -> bool:
        return Settings._bool(value)

    @field_validator("aegisai_gateway_enabled", "aegisai_gateway_fail_open", mode="before")
    @classmethod
    def coerce_gateway_flags(cls, value: object) -> bool:
        return Settings._bool(value)

    @field_validator("enterprise_rag_enabled", mode="before")
    @classmethod
    def coerce_enterprise_rag_flag(cls, value: object) -> bool:
        return Settings._bool(value)

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: object) -> object:
        if not isinstance(value, str):
            return value
        if value.startswith("postgresql://") and "+asyncpg" not in value:
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return value

    app_env: str = "development"
    backend_cors_origins: str = "http://localhost:3000"

    # API auth — gates the routes that cost an LLM call, write to the vector DB, or send
    # a real notification (Slack/Telegram/WhatsApp). Unset = open (dev/demo).
    vap_api_key: str | None = None

    database_url: str = "postgresql+asyncpg://vap:vap@localhost:5432/venkat_ai_platform"
    redis_url: str = "redis://localhost:6379/0"

    # Principal OS extensions (optional structured context for agents)
    calendar_context_path: str | None = None
    budget_summary_path: str | None = None
    meeting_context_path: str | None = None

    # Scheduled jobs (arq worker)
    daily_brief_enabled: bool = False
    daily_brief_hour_utc: int = 7
    daily_brief_minute: int = 0
    daily_brief_channels: str = "slack"  # comma: slack,telegram,whatsapp

    # Persistence / scale
    enable_db_persistence: bool = True

    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str | None = None
    qdrant_collection: str = "vap_documents"

    pinecone_api_key: str | None = None
    pinecone_index: str | None = None
    pinecone_environment: str | None = None

    openai_api_key: str | None = None
    openrouter_api_key: str | None = None
    groq_api_key: str | None = None
    anthropic_api_key: str | None = None

    llm_default_provider: str = "openrouter"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"

    # Shared LLM gateway plane (ADR-028) — when set, all chat completions go through
    # aegis-llm-gateway (OpenAI-shaped). Direct provider keys become fallback only.
    llm_gateway_url: str | None = None  # e.g. http://127.0.0.1:8100/v1
    llm_gateway_api_key: str | None = None
    llm_gateway_tenant_id: str = "vap"

    # ADR-029 outcome KPI (optional)
    agentfinops_url: str | None = None
    agentfinops_api_key: str | None = None

    embedding_provider: str = "openai"
    cohere_api_key: str | None = None

    langfuse_public_key: str | None = None
    langfuse_secret_key: str | None = None
    langfuse_host: str = "https://cloud.langfuse.com"

    tavily_api_key: str | None = None
    newsapi_api_key: str | None = None

    alpha_vantage_api_key: str | None = None
    finnhub_api_key: str | None = None

    slack_webhook_url: str | None = None
    telegram_bot_token: str | None = None
    telegram_chat_id: str | None = None
    twilio_account_sid: str | None = None
    twilio_auth_token: str | None = None
    twilio_whatsapp_from: str | None = None
    twilio_whatsapp_to: str | None = None

    salesforce_client_id: str | None = None
    salesforce_client_secret: str | None = None
    salesforce_instance_url: str | None = None

    # Model names (override per routing bucket)
    model_reasoning: str = "meta-llama/llama-3.3-70b-instruct"
    model_structured: str = "openai/gpt-4o-mini"
    model_fast: str = "mistralai/mistral-7b-instruct"
    model_code: str = "openai/gpt-4o-mini"

    # AegisAI governance gateway (optional — direct delivery when unset)
    aegisai_api_base_url: str | None = None
    aegisai_gateway_enabled: bool = True
    aegisai_gateway_fail_open: bool = True
    aegisai_agent_id: str = "venkat-ai-platform"
    aegisai_tenant_id: str = "bank-demo"
    aegisai_principal_id: str = "vap-orchestrator"
    aegisai_auth_bearer: str | None = None
    aegisai_roles: str = "workflow_owner,execution_broker"

    # Enterprise RAG Platform (optional governed knowledge layer)
    enterprise_rag_enabled: bool = False
    enterprise_rag_api_base_url: str | None = None
    enterprise_rag_api_key: str | None = None
    enterprise_rag_tenant_id: str = "acme"
    enterprise_rag_user_id: str = "vap-orchestrator"
    enterprise_rag_groups: str = "engineering,ai-platform"

    def enterprise_rag_groups_list(self) -> list[str]:
        return [g.strip() for g in self.enterprise_rag_groups.split(",") if g.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


def database_url_sync(url: str | None = None) -> str:
    u = url or get_settings().database_url
    return u.replace("postgresql+asyncpg://", "postgresql://")
